// BF_WEBSITE_SITE_BEHAVIOUR_v169
// Everything a visitor does on the site, not just which pages they open:
//   click        - every button or link clicked (label + destination)
//   cta_view     - a button or apply link that was on screen (so we can see
//                  what was seen but never clicked)
//   section_view - a page section that was on screen for at least a second
//   scroll       - 25 / 50 / 75 / 100 percent of each page
//   form_start, field_complete, form_submit, form_abandon - forms, by field
//                  NAME only. What a visitor types is never recorded.
// Each event goes to the visitor journey on BF-Server (stitched to the CRM
// contact if they later apply) and to Google Analytics 4.
// Fails silently: tracking must never break the site.
import { trackJourney, flushJourney } from "@/utils/journey";
import { trackEvent } from "@/analytics/ga";

const MAX_PER_PAGE = 60;
let path = "";
let sent = 0;
let seenCtas = new Set<string>();
let seenSections = new Set<string>();
let depths = new Set<number>();
let observer: IntersectionObserver | null = null;
const timers = new Map<Element, ReturnType<typeof setTimeout>>();
const forms = new Map<HTMLFormElement, { name: string; lastField: string; fields: Set<string>; submitted: boolean }>();

function clean(text: string | null | undefined, max = 80): string {
  return String(text ?? "").replace(/\s+/g, " ").trim().slice(0, max);
}

function emit(type: string, meta: Record<string, unknown>): void {
  try {
    if (sent >= MAX_PER_PAGE && type !== "form_abandon") return;
    sent += 1;
    trackJourney({ type, path, title: typeof document !== "undefined" ? document.title : undefined, meta });
    trackEvent(type, { page_path: path, ...meta });
  } catch { /* never break the page */ }
}

export function ctaLabel(el: Element): string {
  const explicit = el.getAttribute("data-cta") || el.getAttribute("aria-label") || el.getAttribute("title");
  return clean(explicit || (el as HTMLElement).innerText || el.textContent);
}

function sectionName(el: Element): string {
  const named = el.getAttribute("data-section") || el.getAttribute("aria-label") || el.id;
  if (named) return clean(named);
  const heading = el.querySelector("h1, h2, h3");
  return clean(heading?.textContent) || "";
}

function isCta(el: Element): boolean {
  if (el.matches("button, [role='button'], [data-cta]")) return true;
  const href = el.getAttribute("href") || "";
  return el.matches("a") && /client\.boreal\.financial|\/apply|\/credit-readiness|\/contact/.test(href);
}

export function scrollDepthsReached(scrollY: number, viewport: number, total: number): number[] {
  const scrollable = total - viewport;
  if (scrollable <= 0) return [100];
  const pct = ((scrollY + 1) / scrollable) * 100;
  return [25, 50, 75, 100].filter((d) => pct >= d);
}

function onClick(event: MouseEvent): void {
  const target = event.target as Element | null;
  const el = target?.closest?.("a, button, [role='button'], [data-cta]");
  if (!el) return;
  const href = el.getAttribute("href") || "";
  emit("click", { label: ctaLabel(el), href: href.slice(0, 200), section: sectionName(el.closest("section, [data-section]") ?? el) });
}

function onScroll(): void {
  for (const d of scrollDepthsReached(window.scrollY, window.innerHeight, document.documentElement.scrollHeight)) {
    if (depths.has(d)) continue;
    depths.add(d);
    emit("scroll", { depth: d });
  }
}

function formState(form: HTMLFormElement) {
  let state = forms.get(form);
  if (!state) {
    state = { name: clean(form.getAttribute("name") || form.id || form.getAttribute("aria-label") || sectionName(form) || "form", 60), lastField: "", fields: new Set(), submitted: false };
    forms.set(form, state);
    emit("form_start", { form: state.name });
  }
  return state;
}

function fieldName(el: Element): string {
  return clean(el.getAttribute("name") || el.id || el.getAttribute("aria-label") || el.getAttribute("placeholder") || "field", 60);
}

function onFocus(event: FocusEvent): void {
  const el = event.target as Element | null;
  if (!el?.matches?.("input, select, textarea")) return;
  const form = el.closest("form");
  if (!form) return;
  formState(form).lastField = fieldName(el);
}

function onChange(event: Event): void {
  const el = event.target as Element | null;
  if (!el?.matches?.("input, select, textarea")) return;
  const form = el.closest("form");
  if (!form) return;
  const state = formState(form);
  const name = fieldName(el);
  state.lastField = name;
  if (!state.fields.has(name)) {
    state.fields.add(name);
    emit("field_complete", { form: state.name, field: name });
  }
}

function onSubmit(event: Event): void {
  const form = event.target as HTMLFormElement | null;
  if (!form || form.tagName !== "FORM") return;
  const state = formState(form);
  state.submitted = true;
  emit("form_submit", { form: state.name, fields: state.fields.size });
}

function flushAbandoned(): void {
  for (const state of forms.values()) {
    if (state.submitted) continue;
    emit("form_abandon", { form: state.name, field: state.lastField, fields: state.fields.size });
    state.submitted = true;
  }
}

function watch(): void {
  if (typeof IntersectionObserver === "undefined") return;
  observer?.disconnect();
  observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const el = entry.target;
      if (!entry.isIntersecting) {
        const t = timers.get(el);
        if (t) { clearTimeout(t); timers.delete(el); }
        continue;
      }
      if (isCta(el)) {
        const label = ctaLabel(el);
        if (label && !seenCtas.has(label)) { seenCtas.add(label); emit("cta_view", { label }); }
        continue;
      }
      if (timers.has(el)) continue;
      timers.set(el, setTimeout(() => {
        timers.delete(el);
        const name = sectionName(el);
        if (name && !seenSections.has(name)) { seenSections.add(name); emit("section_view", { section: name }); }
      }, 1000));
    }
  }, { threshold: 0.5 });
  document.querySelectorAll("section, [data-section]").forEach((el) => observer?.observe(el));
  document.querySelectorAll("a, button, [role='button'], [data-cta]").forEach((el) => { if (isCta(el)) observer?.observe(el); });
}

/** Call on every route change. */
export function siteBehaviourPage(nextPath: string): void {
  try {
    if (typeof window === "undefined") return;
    flushAbandoned();
    forms.clear();
    path = nextPath;
    sent = 0;
    seenCtas = new Set();
    seenSections = new Set();
    depths = new Set();
    timers.forEach((t) => clearTimeout(t));
    timers.clear();
    // Let the new page render before looking for its sections and buttons.
    setTimeout(watch, 600);
  } catch { /* never break the page */ }
}

/** Call once at start-up. */
export function initSiteBehaviour(): void {
  try {
    if (typeof window === "undefined") return;
    path = window.location.pathname;
    document.addEventListener("click", onClick, { capture: true, passive: true });
    document.addEventListener("focusin", onFocus, { capture: true });
    document.addEventListener("change", onChange, { capture: true });
    document.addEventListener("submit", onSubmit, { capture: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    // The journey tracker has already flushed by the time these run, so send again.
    const leaving = () => { flushAbandoned(); flushJourney(true); };
    window.addEventListener("pagehide", leaving);
    document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") leaving(); });
    setTimeout(watch, 600);
  } catch { /* never break the page */ }
}
