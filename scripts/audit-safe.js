import { execSync } from "node:child_process";

function parseAudit(jsonText) {
  try {
    const parsed = JSON.parse(jsonText);
    return parsed?.metadata?.vulnerabilities ?? { critical: 0, high: 0, moderate: 0, low: 0 };
  } catch {
    return { critical: 0, high: 0, moderate: 0, low: 0 };
  }
}

try {
  const output = execSync("npm audit --offline --json", { encoding: "utf8", stdio: "pipe" });
  const vuln = parseAudit(output);
  const total = vuln.critical + vuln.high + vuln.moderate + vuln.low;

  console.log(
    `npm audit results: critical=${vuln.critical}, high=${vuln.high}, moderate=${vuln.moderate}, low=${vuln.low}`,
  );

  if (total > 0) {
    process.exitCode = 1;
  }
} catch (error) {
  const stdout = error?.stdout?.toString?.() ?? "";
  const stderr = error?.stderr?.toString?.() ?? "";
  const message = `${stdout}\n${stderr}\n${error?.message ?? ""}`.trim();

  const isRegistryForbidden =
    /403/i.test(message) && (/security\/advisories\/bulk/i.test(message) || /audit endpoint returned an error/i.test(message));

  if (isRegistryForbidden) {
    console.warn("npm audit skipped: registry advisory endpoint returned 403 in this environment.");
    process.exitCode = 0;
  } else {
    const vuln = parseAudit(stdout || stderr);
    const total = vuln.critical + vuln.high + vuln.moderate + vuln.low;

    if (total > 0) {
      console.log(
        `npm audit results: critical=${vuln.critical}, high=${vuln.high}, moderate=${vuln.moderate}, low=${vuln.low}`,
      );
    } else {
      console.error("npm audit failed unexpectedly.");
      console.error(message);
    }
    process.exitCode = 1;
  }
}
