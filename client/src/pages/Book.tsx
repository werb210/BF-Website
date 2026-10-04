// BF_WEBSITE_BOOKING_v173 - clients book a 30-minute phone call or Teams meeting with Boreal.
// Times come from each advisor's Outlook calendar (BF-Server /api/booking). Conference calls are
// staff-only and are not offered here.
import { useEffect, useMemo, useState } from "react";
import SEO from "@/components/SEO";

const API = (import.meta.env.VITE_MAYA_API_BASE ?? "https://server.boreal.financial").trim().replace(/[/]+$/, "");
type Slot = { startsAt: string; staffIds: string[] };
type Staff = { id: string; firstName: string };
const TZ = "America/Edmonton";

export function groupByDay(slots: Slot[]): Array<{ day: string; slots: Slot[] }> {
  const fmt = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, weekday: "long", month: "long", day: "numeric" });
  const out: Array<{ day: string; slots: Slot[] }> = [];
  for (const s of slots) {
    const day = fmt.format(new Date(s.startsAt));
    const last = out[out.length - 1];
    if (last && last.day === day) last.slots.push(s); else out.push({ day, slots: [s] });
  }
  return out;
}
const timeLabel = (iso: string) => new Intl.DateTimeFormat("en-CA", { timeZone: TZ, hour: "numeric", minute: "2-digit" }).format(new Date(iso));

export default function Book() {
  const [kind, setKind] = useState<"phone" | "teams">("phone");
  const [staff, setStaff] = useState<Staff[]>([]);
  const [staffId, setStaffId] = useState("any");
  const [slots, setSlots] = useState<Slot[] | null>(null);
  const [pick, setPick] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [trap, setTrap] = useState("");
  const [state, setState] = useState<"idle" | "saving" | "done">("idle");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<{ startsAt: string; staffFirstName: string | null; joinUrl: string | null } | null>(null);

  useEffect(() => { fetch(API + "/api/booking/staff").then((r) => r.json()).then((d) => setStaff(Array.isArray(d?.staff) ? d.staff : [])).catch(() => setStaff([])); }, []);
  useEffect(() => {
    setSlots(null); setPick(null);
    fetch(API + "/api/booking/slots?staff=" + encodeURIComponent(staffId))
      .then(async (r) => { const d = await r.json(); if (!r.ok) throw new Error(d?.message || "unavailable"); setSlots(Array.isArray(d?.slots) ? d.slots : []); })
      .catch((e) => { setSlots([]); setError(e instanceof Error ? e.message : "Booking is temporarily unavailable. Please call (866) 631-8939."); });
  }, [staffId]);
  const days = useMemo(() => groupByDay(slots ?? []), [slots]);
  const ready = pick && name.trim() && /^[^@ ]+@[^@ ]+[.][^@ ]+$/.test(email.trim()) && (kind === "teams" || phone.replace(/[^0-9]/g, "").length >= 10);

  const submit = async () => {
    setState("saving"); setError(null);
    try {
      const r = await fetch(API + "/api/booking", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind, startsAt: pick, staffId, name: name.trim(), email: email.trim(), phone: phone.trim(), notes: notes.trim(), website: trap }) });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) { setError(d?.message || "That didn't go through. Please try another time or call (866) 631-8939."); setState("idle"); if (r.status === 409) setStaffId((s) => s); return; }
      setDone(d.booking ?? null); setState("done");
    } catch { setError("That didn't go through. Please call (866) 631-8939."); setState("idle"); }
  };

  const btn = (on: boolean) => ({ padding: "10px 14px", borderRadius: 10, border: "1px solid #cbd5e1", background: on ? "#0B1F3A" : "#fff", color: on ? "#fff" : "#0B1F3A", fontWeight: 600, cursor: "pointer" });
  const field = { width: "100%", padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: 8, color: "#0B1F3A", background: "#fff" };
  return (
    <>
      <SEO title="Book a call" description="Book a phone call or Microsoft Teams meeting with a Boreal Financial advisor." url="https://www.boreal.financial/book" />
      <main className="bg-white font-sans text-boreal-ink" style={{ color: "#0B1F3A" }}>
        <section className="bg-gradient-to-br from-boreal-ink via-boreal-inkDeep to-[#0d233f]">
          <div className="mx-auto max-w-[820px] px-6 py-12">
            <h1 className="font-display text-4xl font-bold text-white">Book a call</h1>
            <p className="mt-3 text-[17px] text-[#e2e8f0]">30 minutes with a Boreal Financial advisor, by phone or Microsoft Teams. Times are Mountain time.</p>
          </div>
        </section>
        <section className="mx-auto max-w-[820px] px-6 py-10" data-testid="booking">
          {state === "done" && done ? (
            <div data-testid="booking-done">
              <h2 className="text-2xl font-bold">You're booked</h2>
              <p className="mt-2">{new Intl.DateTimeFormat("en-CA", { timeZone: TZ, dateStyle: "full", timeStyle: "short" }).format(new Date(done.startsAt))} (Mountain time){done.staffFirstName ? " with " + done.staffFirstName : ""}.</p>
              <p className="mt-2">{kind === "teams" ? "A calendar invitation with the Teams link is on its way to your email." : "We'll call you at " + phone + ". A calendar invitation is on its way to your email."}</p>
            </div>
          ) : (
            <>
              <h2 className="text-lg font-bold">1. How would you like to meet?</h2>
              <div className="mt-3 flex gap-3">
                <button type="button" style={btn(kind === "phone")} aria-pressed={kind === "phone"} onClick={() => setKind("phone")}>Phone call</button>
                <button type="button" style={btn(kind === "teams")} aria-pressed={kind === "teams"} onClick={() => setKind("teams")}>Microsoft Teams</button>
              </div>
              {staff.length > 1 && (
                <>
                  <h2 className="mt-8 text-lg font-bold">2. Who would you like to speak with?</h2>
                  <select aria-label="Advisor" value={staffId} onChange={(e) => setStaffId(e.target.value)} style={{ ...field, maxWidth: 320, marginTop: 12 }}>
                    <option value="any">First available</option>
                    {staff.map((s) => <option key={s.id} value={s.id}>{s.firstName}</option>)}
                  </select>
                </>
              )}
              <h2 className="mt-8 text-lg font-bold">{staff.length > 1 ? "3" : "2"}. Pick a time</h2>
              {slots === null && <p className="mt-3">Loading times...</p>}
              {slots !== null && !slots.length && <p className="mt-3">{error ?? "No times are open in the next two weeks. Please call (866) 631-8939."}</p>}
              <div className="mt-3 grid gap-5">
                {days.slice(0, 10).map((d) => (
                  <div key={d.day}>
                    <div className="font-semibold">{d.day}</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {d.slots.map((s) => <button key={s.startsAt} type="button" aria-pressed={pick === s.startsAt} style={btn(pick === s.startsAt)} onClick={() => setPick(s.startsAt)}>{timeLabel(s.startsAt)}</button>)}
                    </div>
                  </div>
                ))}
              </div>
              <h2 className="mt-8 text-lg font-bold">Your details</h2>
              <div className="mt-3 grid gap-3" style={{ maxWidth: 480 }}>
                <input aria-label="Full name" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} style={field} />
                <input aria-label="Email" type="email" placeholder="Email (for the calendar invitation)" value={email} onChange={(e) => setEmail(e.target.value)} style={field} />
                <input aria-label="Phone" type="tel" placeholder={kind === "phone" ? "Phone number we should call" : "Phone (optional)"} value={phone} onChange={(e) => setPhone(e.target.value)} style={field} />
                <textarea aria-label="Notes" placeholder="What would you like to talk about? (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} style={{ ...field, minHeight: 80 }} />
                <input tabIndex={-1} autoComplete="off" aria-hidden="true" value={trap} onChange={(e) => setTrap(e.target.value)} style={{ position: "absolute", left: -9999, width: 1, height: 1 }} />
                {error && slots && slots.length > 0 && <p role="alert" style={{ color: "#b91c1c" }}>{error}</p>}
                <button type="button" disabled={!ready || state === "saving"} onClick={() => void submit()} style={{ ...btn(true), opacity: ready ? 1 : 0.5 }}>{state === "saving" ? "Booking..." : "Book it"}</button>
              </div>
            </>
          )}
        </section>
      </main>
    </>
  );
}
