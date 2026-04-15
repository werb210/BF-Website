import { useState } from "react";
import { api } from "@/lib/api";

type Step = "contact" | "questions" | "result";
type Score = "Strong" | "Moderate" | "Needs Structuring";

interface ContactInfo {
  fullName: string;
  phone: string;
  email: string;
}

interface ScoreAnswers {
  yearsInBusiness: number;
  annualRevenue: number;
  profitable: boolean;
  estimatedCreditScore: number;
}

function calculateScore(answers: ScoreAnswers): Score {
  let points = 0;
  if (answers.yearsInBusiness > 2) points += 2;
  if (answers.annualRevenue > 500000) points += 2;
  if (answers.profitable) points += 2;
  if (answers.estimatedCreditScore > 650) points += 2;
  if (points >= 7) return "Strong";
  if (points >= 4) return "Moderate";
  return "Needs Structuring";
}

export default function ReadinessModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<Step>("contact");
  const [contact, setContact] = useState<ContactInfo>({ fullName: "", phone: "", email: "" });
  const [answers, setAnswers] = useState<ScoreAnswers>({
    yearsInBusiness: 0,
    annualRevenue: 0,
    profitable: true,
    estimatedCreditScore: 0,
  });
  const [score, setScore] = useState<Score | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmitQuestions() {
    const computedScore = calculateScore(answers);
    setScore(computedScore);
    setSubmitting(true);
    setError(null);

    try {
      const result = await api<{ sessionToken: string; score: string }>("/api/crm/readiness", {
        method: "POST",
        body: {
          fullName: contact.fullName,
          phone: contact.phone,
          email: contact.email,
          yearsInBusiness: answers.yearsInBusiness,
          annualRevenue: answers.annualRevenue,
          profitable: answers.profitable,
          estimatedCreditScore: answers.estimatedCreditScore,
          score: computedScore,
        },
      });
      setSessionToken(result.sessionToken);
      setStep("result");
    } catch {
      setError("Unable to save. Your score is still shown below.");
      setStep("result");
    } finally {
      setSubmitting(false);
    }
  }

  const clientAppUrl = sessionToken
    ? `https://client.boreal.financial/otp?readiness_token=${sessionToken}`
    : "https://client.boreal.financial/otp";

  const scoreColors: Record<Score, string> = {
    Strong: "#16a34a",
    Moderate: "#d97706",
    "Needs Structuring": "#dc2626",
  };

  return (
    <div style={{ maxWidth: 480, margin: "0 auto" }}>
      {step === "contact" && (
        <>
          <h2>Check Your Capital Readiness</h2>
          <p style={{ color: "#6b7280", marginBottom: 20 }}>
            We'll give you an instant funding likelihood score.
          </p>

          <label>Full Name *</label>
          <input
            value={contact.fullName}
            onChange={(e) => setContact((p) => ({ ...p, fullName: e.target.value }))}
            placeholder="John Smith"
            required
          />

          <label>Phone Number *</label>
          <input
            type="tel"
            value={contact.phone}
            onChange={(e) => setContact((p) => ({ ...p, phone: e.target.value }))}
            placeholder="+1 (555) 000-0000"
            required
          />

          <label>Email Address *</label>
          <input
            type="email"
            value={contact.email}
            onChange={(e) => setContact((p) => ({ ...p, email: e.target.value }))}
            placeholder="john@company.com"
            required
          />

          <button
            onClick={() => setStep("questions")}
            disabled={!contact.fullName || !contact.phone || !contact.email}
          >
            Continue →
          </button>
        </>
      )}

      {step === "questions" && (
        <>
          <h2>Tell Us About Your Business</h2>

          <label>Years in business</label>
          <input
            type="number"
            value={answers.yearsInBusiness || ""}
            onChange={(e) => setAnswers((p) => ({ ...p, yearsInBusiness: Number(e.target.value) }))}
            placeholder="e.g. 3"
          />

          <label>Annual revenue ($)</label>
          <input
            type="number"
            value={answers.annualRevenue || ""}
            onChange={(e) => setAnswers((p) => ({ ...p, annualRevenue: Number(e.target.value) }))}
            placeholder="e.g. 750000"
          />

          <label>Is the business profitable?</label>
          <select
            value={answers.profitable ? "yes" : "no"}
            onChange={(e) => setAnswers((p) => ({ ...p, profitable: e.target.value === "yes" }))}
          >
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>

          <label>Estimated credit score</label>
          <input
            type="number"
            value={answers.estimatedCreditScore || ""}
            onChange={(e) => setAnswers((p) => ({ ...p, estimatedCreditScore: Number(e.target.value) }))}
            placeholder="e.g. 680"
          />

          {error && <p style={{ color: "red" }}>{error}</p>}

          <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
            <button onClick={() => setStep("contact")}>← Back</button>
            <button onClick={() => void handleSubmitQuestions()} disabled={submitting}>
              {submitting ? "Calculating..." : "Get My Score →"}
            </button>
          </div>
        </>
      )}

      {step === "result" && score && (
        <>
          <h2>Your Capital Readiness Score</h2>
          <div style={{ textAlign: "center", padding: "32px 0" }}>
            <div style={{ fontSize: 48, fontWeight: 800, color: scoreColors[score] }}>{score}</div>
            <p style={{ color: "#6b7280", marginTop: 8 }}>
              {score === "Strong" && "Your business profile is well-positioned for financing."}
              {score === "Moderate" && "You have a solid foundation with some areas to strengthen."}
              {score === "Needs Structuring" &&
                "Let's work together to prepare your business for financing."}
            </p>
          </div>

          {error && <p style={{ color: "red", marginBottom: 12 }}>{error}</p>}

          <a
            href={clientAppUrl}
            style={{
              display: "block",
              textAlign: "center",
              padding: "14px",
              background: "#2563eb",
              color: "#fff",
              borderRadius: 8,
              textDecoration: "none",
              fontWeight: 600,
              marginBottom: 12,
            }}
          >
            Start Your Application →
          </a>
          <button
            onClick={onClose}
            style={{
              width: "100%",
              padding: 12,
              background: "transparent",
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </>
      )}
    </div>
  );
}
