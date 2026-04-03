import { api } from "@/lib/api";

export async function submitLead(form: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
}) {
  return api<{ leadId: string }>("/api/lead/submit", {
    method: "POST",
    body: form,
  });
}
