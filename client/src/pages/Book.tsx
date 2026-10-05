// BF_WEBSITE_BOOKING_v173 - clients book a 30-minute phone call or Teams meeting with Boreal.
// Times come from each advisor's Outlook calendar (BF-Server /api/booking). Conference calls are
// staff-only and are not offered here.
import { useEffect, useMemo, useState } from "react";
import SEO from "@/components/SEO";
import { dayHeading, dayKey, monthCells, MONTHS, pad2, slotsByDay, timeIn, visitorTimeZone, zoneLabel } from "@/lib/bookingCalendar"; // BF_WEBSITE_BOOKING_CALENDAR_v176 / BF_WEBSITE_LOCAL_TIME_v177

const API = (import.meta.env.VITE_MAYA_API_BASE ?? "https://server.boreal.financial").trim().replace(/[/]+$/, "");
type Slot = { startsAt: string; staffIds: string[] };
type Staff = { id: string; firstName: string };
// BF_WEBSITE_ALBERTA_TIME_v175 - Alberta is UTC-6 all year since 2026. Visitors whose phone or browser has older
// time-zone data would see the Edmonton zone fall back an hour on Nov 1; America/Regina is UTC-6 everywhere.
const TZ = "America/Regina";

// BF_WEBSITE_BOOKING_PER_STAFF_v174 - each advisor has their own link: boreal.financial/book-todd
// shows only Todd's free times and never lists the rest of the team. Plain /book books the
// first free advisor without naming anyone.
export default function Book({ slug }: { slug?: string } = {}) {
  const [kind, setKind] = useState<"phone" | "teams">("phone");
  const [advisor, setAdvisor] = useState<Staff | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [staffId, setStaffId] = useState(slug ? "" : "any");
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
  // BF_WEBSITE_LOCAL_TIME_v177 - show times in the visitor's own zone; one tap switches to Alberta time.
  const localTz = useMemo(() => visitorTimeZone(), []);
  const [tz, setTz] = useState(localTz);
  const zoneName = zoneLabel(tz);

  useEffect(() => {
    if (!slug) return;
    fetch(API + "/api/booking/staff/" + encodeURIComponent(slug))
      .then(async (r) => { if (!r.ok) throw new Error("not_found"); const d = await r.json(); setAdvisor(d.staff); setStaffId(d.staff.id); })
      .catch(() => setNotFound(true));
  }, [slug]);
  useEffect(() => {
    if (!staffId) return;
    setSlots(null); setPick(null);
    fetch(API + "/api/booking/slots?staff=" + encodeURIComponent(staffId))
      .then(async (r) => { const d = await r.json(); if (!r.ok) throw new Error(d?.message || "unavailable"); setSlots(Array.isArray(d?.slots) ? d.slots : []); })
      .catch((e) => { setSlots([]); setError(e instanceof Error ? e.message : "Booking is temporarily unavailable. Please call (866) 631-8939."); });
  }, [staffId]);
  const byDay = useMemo(() => slotsByDay(slots ?? [], tz), [slots, tz]);
  const firstKey = useMemo(() => (slots && slots.length ? dayKey(slots[0]!.startsAt, tz) : null), [slots, tz]);
  const [day, setDay] = useState<string | null>(null);
  const [view, setView] = useState<{ y: number; m: number } | null>(null);
  useEffect(() => { if (firstKey) { setDay(firstKey); setView({ y: Number(firstKey.slice(0, 4)), m: Number(firstKey.slice(5, 7)) }); } }, [firstKey]);
  const keys = useMemo(() => [...byDay.keys()].sort(), [byDay]);
  const minMonth = keys.length ? keys[0]!.slice(0, 7) : "";
  const maxMonth = keys.length ? keys[keys.length - 1]!.slice(0, 7) : "";
  const viewMonth = view ? view.y + "-" + pad2(view.m) : "";
  const shiftMonth = (by: number) => setView((v) => { if (!v) return v; const d = new Date(Date.UTC(v.y, v.m - 1 + by, 1)); return { y: d.getUTCFullYear(), m: d.getUTCMonth() + 1 }; });
  const chooseDay = (k: string) => { setDay(k); if (pick && dayKey(pick, tz) !== k) setPick(null); };
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
            <h1 className="font-display text-4xl font-bold text-white">{advisor ? "Book a call with " + advisor.firstName : "Book a call"}</h1>
            <p className="mt-3 text-[17px] text-[#e2e8f0]">30 minutes with a Boreal Financial advisor, by phone or Microsoft Teams. Times are shown in your time zone.</p>
          </div>
        </section>
        <section className="mx-auto max-w-[820px] px-6 py-10" data-testid="booking">
          {notFound ? (
            <p data-testid="booking-not-found">This booking link isn't active. Please call us at (866) 631-8939 or use <a href="/book" style={{ textDecoration: "underline" }}>boreal.financial/book</a>.</p>
          ) : state === "done" && done ? (
            <div data-testid="booking-done">
              <h2 className="text-2xl font-bold">You're booked</h2>
              <p className="mt-2">{new Intl.DateTimeFormat("en-CA", { timeZone: tz, dateStyle: "full", timeStyle: "short" }).format(new Date(done.startsAt))} ({zoneName}){tz !== TZ ? " - " + timeIn(done.startsAt, TZ) + " Alberta time" : ""}{done.staffFirstName ? " with " + done.staffFirstName : ""}.</p>
              <p className="mt-2">{kind === "teams" ? "A calendar invitation with the Teams link is on its way to your email." : "We'll call you at " + phone + ". A calendar invitation is on its way to your email."}</p>
            </div>
          ) : (
            <>
              <h2 className="text-lg font-bold">1. How would you like to meet?</h2>
              <div className="mt-3 flex gap-3">
                <button type="button" style={btn(kind === "phone")} aria-pressed={kind === "phone"} onClick={() => setKind("phone")}>Phone call</button>
                <button type="button" style={btn(kind === "teams")} aria-pressed={kind === "teams"} onClick={() => setKind("teams")}>Microsoft Teams</button>
              </div>
              <h2 className="mt-8 text-lg font-bold">2. Pick a time</h2>
              <p data-testid="booking-zone" className="mt-2" style={{ fontSize: 14, color: "#334155" }}>
                Times are in {zoneName}.
                {localTz !== TZ && (
                  <button type="button" onClick={() => setTz(tz === TZ ? localTz : TZ)} style={{ marginLeft: 8, background: "none", border: 0, padding: 0, color: "#0B1F3A", fontWeight: 600, textDecoration: "underline", cursor: "pointer" }}>
                    {tz === TZ ? "Show my time zone" : "Show Alberta time"}
                  </button>
                )}
              </p>
              {slots === null && <p className="mt-3">Loading times...</p>}
              {slots !== null && !slots.length && <p className="mt-3">{error ?? "No times are open in the next two weeks. Please call (866) 631-8939."}</p>}
              {/* BF_WEBSITE_BOOKING_CALENDAR_v176 - calendar on the left (on top on a phone), that day's times on the right. */}
              {slots !== null && slots.length > 0 && view && (
                <div data-testid="booking-calendar" className="mt-4 grid gap-6 md:grid-cols-[320px_1fr]">
                  <div style={{ border: "1px solid #cbd5e1", borderRadius: 12, padding: 14 }}>
                    <div className="flex items-center justify-between">
                      <button type="button" aria-label="Previous month" disabled={viewMonth <= minMonth} onClick={() => shiftMonth(-1)} style={{ ...btn(false), padding: "6px 12px", opacity: viewMonth <= minMonth ? 0.35 : 1 }}>&lsaquo;</button>
                      <div className="font-semibold">{MONTHS[view.m - 1]} {view.y}</div>
                      <button type="button" aria-label="Next month" disabled={viewMonth >= maxMonth} onClick={() => shiftMonth(1)} style={{ ...btn(false), padding: "6px 12px", opacity: viewMonth >= maxMonth ? 0.35 : 1 }}>&rsaquo;</button>
                    </div>
                    <div className="mt-3 grid grid-cols-7 gap-1 text-center" style={{ fontSize: 12, color: "#51617D", fontWeight: 600 }}>
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((w) => <div key={w}>{w}</div>)}
                    </div>
                    <div className="mt-1 grid grid-cols-7 gap-1">
                      {monthCells(view.y, view.m).map((n, i) => {
                        if (n === null) return <div key={"b" + i} />;
                        const k = viewMonth + "-" + pad2(n);
                        const open = byDay.has(k);
                        const on = day === k;
                        return <button key={k} type="button" disabled={!open} aria-pressed={on} aria-label={dayHeading(k) + (open ? "" : " - no times")} onClick={() => chooseDay(k)}
                          style={{ height: 40, borderRadius: 8, border: open ? "1px solid #0B1F3A" : "1px solid transparent", background: on ? "#0B1F3A" : "#fff", color: on ? "#fff" : open ? "#0B1F3A" : "#64748b", fontWeight: open ? 700 : 400, cursor: open ? "pointer" : "default" }}>{n}</button>;
                      })}
                    </div>
                  </div>
                  <div data-testid="booking-times">
                    <div className="font-semibold">{day ? dayHeading(day) : "Pick a day"}</div>
                    <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {(day ? byDay.get(day) ?? [] : []).map((s) => <button key={s.startsAt} type="button" aria-pressed={pick === s.startsAt} style={{ ...btn(pick === s.startsAt), width: "100%" }} onClick={() => setPick(s.startsAt)}>{timeIn(s.startsAt, tz)}</button>)}
                    </div>
                  </div>
                </div>
              )}
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
