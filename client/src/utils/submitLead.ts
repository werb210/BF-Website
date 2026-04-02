import { api } from "@/lib/api";

export async function submitLead(form: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
}) {
  const res = await api<{ leadId: string }>("/api/leads", {
    method: "POST",
    body: JSON.stringify(form),
  });

  if (!res.success) {
    throw new Error(res.error.message);
  }

  return res.data;
}
