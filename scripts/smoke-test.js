import { execSync } from "node:child_process";

try {
  console.log("Running build...");
  execSync("npm run build", { stdio: "inherit" });
  console.log("✅ Build successful");
} catch {
  console.error("❌ Smoke test failed");
  process.exit(1);
}
