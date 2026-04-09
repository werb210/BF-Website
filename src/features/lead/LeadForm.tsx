import { useState } from "react";
import { api } from "../../lib/api";

export default function LeadForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function update(key: "name" | "email" | "phone", value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit() {
    setError("");

    if (!form.email.includes("@")) {
      setError("Invalid email");
      return;
    }

    try {
      await api("/api/crm/lead", {
        method: "POST",
        body: JSON.stringify(form),
      });

      setSuccess(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "API_ERROR");
    }
  }

  if (success) {
    window.location.href = "/apply";
    return null;
  }

  return (
    <div>
      <input onChange={(e) => update("name", e.target.value)} />
      <input onChange={(e) => update("email", e.target.value)} />
      <input onChange={(e) => update("phone", e.target.value)} />

      <button onClick={() => void handleSubmit()}>Start Application</button>

      {error && <div>{error}</div>}
    </div>
  );
}
