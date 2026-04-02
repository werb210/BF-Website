import { apiRequest } from "@/lib/api";
import { retry } from "@/lib/retry";

export async function submitLead(data: unknown) {
  return retry(
    () =>
      apiRequest("/api/lead", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    3,
    500,
  );
}
