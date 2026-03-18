import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const results = {
  eslint: { passed: false, warnings: 0, errors: 0, output: "" },
  typescript: { passed: false, errors: 0, skipped: false, output: "" },
  audit: { passed: false, critical: 0, high: 0, moderate: 0, low: 0, output: "" },
  depcheck: { passed: false, unusedDependencies: [], unusedDevDependencies: [], output: "" },
  madge: { passed: false, skipped: false, circular: [], output: "" },
  build: { passed: false, skipped: false, output: "" },
  bundle: { passed: false, skipped: false, ran: false, totalBytes: 0, output: "" },
};

const viteConfigFiles = ["vite.config.ts", "vite.config.js", "vite.config.mjs", "vite.config.cjs"];
const packageJson = JSON.parse(fs.readFileSync(path.resolve("package.json"), "utf8"));

function section(title) {
  console.log(`\n--- ${title} ---`);
}

function run(cmd) {
  return execSync(cmd, { encoding: "utf8", stdio: "pipe" });
}

function toText(err) {
  const stdout = err?.stdout?.toString() || "";
  const stderr = err?.stderr?.toString() || "";
  return `${stdout}\n${stderr}`.trim() || String(err?.message || err);
}

function parseEslintCounts(text) {
  const warnings = Number(text.match(/(\d+) warnings?/i)?.[1] || 0);
  const errors = Number(text.match(/(\d+) errors?/i)?.[1] || 0);
  return { warnings, errors };
}

function parseAuditJson(text) {
  try {
    const parsed = JSON.parse(text);
    const vulnerabilities = parsed?.metadata?.vulnerabilities || {};
    return {
      critical: vulnerabilities.critical || 0,
      high: vulnerabilities.high || 0,
      moderate: vulnerabilities.moderate || 0,
      low: vulnerabilities.low || 0,
    };
  } catch {
    return { critical: 0, high: 0, moderate: 0, low: 0 };
  }
}

function parseDepcheckJson(text) {
  try {
    const parsed = JSON.parse(text);
    return {
      unusedDependencies: parsed.dependencies || [],
      unusedDevDependencies: parsed.devDependencies || [],
    };
  } catch {
    return { unusedDependencies: [], unusedDevDependencies: [] };
  }
}

function directorySizeBytes(rootDir) {
  if (!fs.existsSync(rootDir)) return 0;
  let total = 0;
  const stack = [rootDir];

  while (stack.length > 0) {
    const current = stack.pop();
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
      } else if (entry.isFile()) {
        total += fs.statSync(fullPath).size;
      }
    }
  }

  return total;
}

function humanSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function walkSourceFiles(rootDir, collected = []) {
  if (!fs.existsSync(rootDir)) return collected;
  const entries = fs.readdirSync(rootDir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(rootDir, entry.name);
    if (entry.isDirectory()) {
      if (["node_modules", "dist", ".git", ".vite"].includes(entry.name)) {
        continue;
      }
      walkSourceFiles(fullPath, collected);
      continue;
    }

    if (entry.isFile() && /\.(ts|tsx|js|jsx|mjs|cjs)$/.test(entry.name)) {
      collected.push(fullPath);
    }
  }
  return collected;
}

function resolveImport(fromFile, importPath) {
  if (!importPath.startsWith(".") && !path.isAbsolute(importPath)) return null;

  const basePath = path.resolve(path.dirname(fromFile), importPath);
  const candidates = [
    basePath,
    `${basePath}.ts`,
    `${basePath}.tsx`,
    `${basePath}.js`,
    `${basePath}.jsx`,
    `${basePath}.mjs`,
    `${basePath}.cjs`,
    path.join(basePath, "index.ts"),
    path.join(basePath, "index.tsx"),
    path.join(basePath, "index.js"),
    path.join(basePath, "index.jsx"),
    path.join(basePath, "index.mjs"),
    path.join(basePath, "index.cjs"),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return candidate;
    }
  }
  return null;
}

function parseImports(fileContent) {
  const imports = [];
  const patterns = [
    /import\s+[^'"]*?from\s+['"]([^'"]+)['"]/g,
    /import\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
    /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
    /export\s+[^'"]*?from\s+['"]([^'"]+)['"]/g,
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(fileContent)) !== null) {
      imports.push(match[1]);
    }
  }
  return imports;
}

function findCircularDependencies(entryDirs) {
  const files = entryDirs.flatMap((dir) => walkSourceFiles(path.resolve(dir)));
  const graph = new Map();

  for (const file of files) {
    const content = fs.readFileSync(file, "utf8");
    const imports = parseImports(content);
    const resolvedDeps = new Set();
    for (const importPath of imports) {
      const resolved = resolveImport(file, importPath);
      if (resolved) resolvedDeps.add(resolved);
    }
    graph.set(file, [...resolvedDeps]);
  }

  const cycles = new Set();
  const state = new Map(); // 0=unvisited, 1=visiting, 2=visited
  const stack = [];

  function dfs(node) {
    state.set(node, 1);
    stack.push(node);
    for (const dep of graph.get(node) || []) {
      if (!graph.has(dep)) continue;
      const depState = state.get(dep) || 0;
      if (depState === 0) {
        dfs(dep);
      } else if (depState === 1) {
        const idx = stack.indexOf(dep);
        if (idx !== -1) {
          const cyclePath = [...stack.slice(idx), dep]
            .map((filePath) => path.relative(process.cwd(), filePath))
            .join(" -> ");
          cycles.add(cyclePath);
        }
      }
    }
    stack.pop();
    state.set(node, 2);
  }

  for (const node of graph.keys()) {
    if ((state.get(node) || 0) === 0) dfs(node);
  }

  return [...cycles].sort();
}

console.log("=== ENTERPRISE REPOSITORY AUDIT ===");

section("CHECK 1: ESLINT");
try {
  const output = run("npx eslint . --ext .ts,.tsx,.js,.jsx");
  const { warnings, errors } = parseEslintCounts(output);
  results.eslint = { passed: true, warnings, errors, output };
  console.log(output || "No ESLint issues reported.");
} catch (err) {
  const output = toText(err);
  const { warnings, errors } = parseEslintCounts(output);
  results.eslint = { passed: false, warnings, errors: errors || 1, output };
  console.log(output);
}

section("CHECK 2: TYPESCRIPT STRICT CHECK");
if (fs.existsSync(path.resolve("tsconfig.json"))) {
  try {
    const output = run("npx tsc --noEmit");
    results.typescript = { passed: true, errors: 0, skipped: false, output };
    console.log(output || "TypeScript check passed.");
  } catch (err) {
    const output = toText(err);
    const errors = (output.match(/error TS\d+:/g) || []).length || 1;
    results.typescript = { passed: false, errors, skipped: false, output };
    console.log(output);
  }
} else {
  results.typescript = { passed: false, errors: 0, skipped: true, output: "Skipped: tsconfig.json not found." };
  console.log(results.typescript.output);
}

section("CHECK 3: VULNERABILITY SCAN");
try {
  const output = run("npm audit --offline --json");
  const counts = parseAuditJson(output);
  results.audit = {
    passed: counts.critical + counts.high + counts.moderate + counts.low === 0,
    ...counts,
    output,
  };
} catch (err) {
  const output = toText(err);
  const counts = parseAuditJson(output);
  results.audit = { passed: false, ...counts, output };
}
console.log(`critical=${results.audit.critical}, high=${results.audit.high}, moderate=${results.audit.moderate}, low=${results.audit.low}`);

section("CHECK 4: UNUSED DEPENDENCIES");
try {
  const output = run("npx depcheck --json");
  const { unusedDependencies, unusedDevDependencies } = parseDepcheckJson(output);
  results.depcheck = {
    passed: unusedDependencies.length === 0 && unusedDevDependencies.length === 0,
    unusedDependencies,
    unusedDevDependencies,
    output,
  };
} catch (err) {
  const output = toText(err);
  const { unusedDependencies, unusedDevDependencies } = parseDepcheckJson(output);
  results.depcheck = { passed: false, unusedDependencies, unusedDevDependencies, output };
}
console.log("Unused dependencies:", results.depcheck.unusedDependencies);
console.log("Unused devDependencies:", results.depcheck.unusedDevDependencies);

section("CHECK 5: CIRCULAR DEPENDENCIES");
try {
  const circular = findCircularDependencies(["client", "server", "shared", "tests", "scripts"]);
  const output =
    circular.length > 0
      ? `Found ${circular.length} circular dependency cycle(s).\n${circular.join("\n")}`
      : "No circular dependencies found in scanned source directories.";
  results.madge = {
    passed: circular.length === 0,
    skipped: false,
    circular,
    output,
  };
  console.log(output);
} catch (err) {
  const output = toText(err);
  const circular = output
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && line.includes("->"));
  results.madge = { passed: false, skipped: false, circular, output };
  console.log(output);
}

section("CHECK 6: BUILD VERIFICATION");
if (packageJson?.scripts?.build) {
  try {
    const output = run("npm run build");
    results.build = { passed: true, skipped: false, output };
    console.log(output);
  } catch (err) {
    const output = toText(err);
    results.build = { passed: false, skipped: false, output };
    console.log(output);
  }
} else {
  results.build = { passed: false, skipped: true, output: "Skipped: no build script found." };
  console.log(results.build.output);
}

section("CHECK 7: BUNDLE SIZE (if Vite detected)");
const hasViteConfig = viteConfigFiles.some((file) => fs.existsSync(path.resolve(file)));
if (hasViteConfig) {
  results.bundle.ran = true;
  try {
    const output = run("npx vite build --mode production");
    const totalBytes = directorySizeBytes(path.resolve("dist"));
    results.bundle = {
      passed: true,
      skipped: false,
      ran: true,
      totalBytes,
      output,
    };
    console.log(output);
    console.log(`Total dist bundle size: ${humanSize(totalBytes)}`);
  } catch (err) {
    const output = toText(err);
    results.bundle = { passed: false, skipped: false, ran: true, totalBytes: 0, output };
    console.log(output);
  }
} else {
  results.bundle = { passed: false, skipped: true, ran: false, totalBytes: 0, output: "Skipped: no Vite config found." };
  console.log(results.bundle.output);
}

section("FINAL SUMMARY");
const securityScore = Math.max(
  0,
  100 - (results.audit.critical * 30 + results.audit.high * 15 + results.audit.moderate * 7 + results.audit.low * 3),
);
const codeQualityScore = Math.max(0, 100 - (results.eslint.errors * 8 + results.eslint.warnings * 2 + results.typescript.errors * 10));
const dependencyHealth =
  results.depcheck.unusedDependencies.length + results.depcheck.unusedDevDependencies.length === 0 ? "Healthy" : "Needs Review";
const buildStatus =
  results.build.skipped ? "Skipped" : results.build.passed && (results.bundle.skipped || results.bundle.passed) ? "Passing" : "Failing";

const riskScore =
  (100 - securityScore) * 0.45 +
  (100 - codeQualityScore) * 0.35 +
  (buildStatus === "Failing" ? 20 : 0) +
  (dependencyHealth === "Needs Review" ? 10 : 0);

let overallRiskLevel = "Low";
if (riskScore >= 75) overallRiskLevel = "Critical";
else if (riskScore >= 50) overallRiskLevel = "High";
else if (riskScore >= 25) overallRiskLevel = "Medium";

console.log(`Security Score: ${securityScore}/100`);
console.log(`Code Quality Score: ${codeQualityScore}/100`);
console.log(`Dependency Health: ${dependencyHealth}`);
console.log(`Build Status: ${buildStatus}`);
console.log(`Overall Risk Level: ${overallRiskLevel}`);
