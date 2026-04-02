import { getEnv } from "@/config/env";

export default function SystemStatus() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">System Status</h1>
      <p>Environment: {getEnv().MODE}</p>
      <p>Application is running.</p>
    </main>
  );
}
