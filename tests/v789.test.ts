// BF_WEBSITE_v789_AUDIT_ROUND2 - one check per audit item. Behaviour tests
// for the client modules are in client/src/__tests__/v789_audit.test.ts and
// client/src/__tests__/formLabels.v789.test.ts.
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { stampServiceWorker, SW_PLACEHOLDER, buildHash } from "../scripts/stamp-sw.ts";
import { applyHead, outputPathFor, prerenderHeads } from "../scripts/prerender-head.ts";

const read = (p: string) => fs.readFileSync(p, "utf8");
const SRC = "client/src";

function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) return e.name === "__tests__" ? [] : walk(full);
    return /\.(tsx?)$/.test(e.name) ? [full] : [];
  });
}

describe("[12] talk-to-a-human token", () => {
  it("FloatingChat stores visitor_token and ends the session on 401/403", () => {
    const chat = read(`${SRC}/components/FloatingChat.tsx`);
    assert.match(chat, /saveConversation\(esc\.conversation_id, esc\.visitor_token \?\? null\)/);
    assert.ok(chat.includes("isSessionEndedError(err)"));
    assert.ok(chat.includes("endChatSession()"));
    assert.ok(chat.includes("CHAT_SESSION_ENDED_MESSAGE"));
  });
});

describe("[121] consent", () => {
  const html = read("client/index.html");
  const init = read("client/public/js/head-init.js");
  it("index.html has no inline script and no Clarity", () => {
    const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)];
    for (const [, attrs, body] of scripts) {
      assert.match(attrs as string, /\bsrc=/, "inline <script> in index.html");
      assert.equal((body as string).trim(), "");
    }
    assert.ok(!/clarity\.ms|\(window, document, "clarity"/.test(html), "Clarity still loads unconditionally");
    assert.ok(!/\son[a-z]+="/.test(html), "inline event handler in index.html");
    assert.ok(html.indexOf("/js/head-init.js") < html.indexOf("googletagmanager.com/gtag/js"));
  });
  it("Consent Mode defaults deny analytics and ads", () => {
    const defaults = init.slice(init.indexOf('"consent", "default"'), init.indexOf("wait_for_update"));
    for (const k of ["analytics_storage", "ad_storage", "ad_user_data", "ad_personalization"]) {
      assert.match(defaults, new RegExp(`${k}: "denied"`), k);
    }
    assert.ok(!init.includes("clarity"), "head-init must not load Clarity");
  });
  it("journey and site-behaviour tracking start only through the consent gate", () => {
    const main = read(`${SRC}/main.tsx`);
    assert.ok(main.includes("return onAnalyticsConsent(startBehaviourTracking);"));
    const start = main.slice(main.indexOf("function startBehaviourTracking"), main.indexOf("function TrackingProvider"));
    assert.ok(start.includes("initJourneyTracking()") && start.includes("initSiteBehaviour();"));
    const banner = read(`${SRC}/components/ConsentBanner.tsx`);
    assert.match(banner, /if \(stored === "granted"\) \{ applyConsent\(true\); grantAnalyticsConsent\(\); return; \}/);
    assert.match(banner, /if \(granted\) grantAnalyticsConsent\(\);/);
  });
  it("the privacy policy describes the same behaviour", () => {
    const p = read(`${SRC}/pages/privacy.tsx`);
    assert.ok(p.includes("analytics storage, ad storage, ad user data and ad personalisation all set to denied"));
    assert.ok(p.includes("Microsoft Clarity is not loaded at all"));
    assert.ok(p.includes("Clarity and our own site analytics load again only if the stored choice is Accept"));
  });
});

describe("[122] security headers", () => {
  const cfg = JSON.parse(read("client/public/staticwebapp.config.json"));
  const h = cfg.globalHeaders as Record<string, string>;
  it("sets every required header", () => {
    assert.equal(h["Strict-Transport-Security"], "max-age=31536000; includeSubDomains");
    assert.equal(h["X-Frame-Options"], "DENY");
    assert.equal(h["X-Content-Type-Options"], "nosniff");
    assert.equal(h["Referrer-Policy"], "strict-origin-when-cross-origin");
    assert.equal(h["Permissions-Policy"], "camera=(), microphone=(), geolocation=()");
  });
  it("CSP: default-src self, no eval, no inline script, the origins the site uses", () => {
    const csp = h["Content-Security-Policy"] as string;
    const dir = (name: string) => csp.split(";").map((d) => d.trim()).find((d) => d.startsWith(`${name} `)) ?? "";
    assert.equal(dir("default-src"), "default-src 'self'");
    assert.ok(!csp.includes("unsafe-eval"));
    assert.ok(!dir("script-src").includes("unsafe-inline"));
    for (const o of ["https://www.googletagmanager.com", "https://www.clarity.ms"]) assert.ok(dir("script-src").includes(o), o);
    for (const o of ["https://server.boreal.financial", "https://*.google-analytics.com", "https://*.clarity.ms"]) assert.ok(dir("connect-src").includes(o), o);
    assert.ok(dir("font-src").includes("https://fonts.gstatic.com"));
    assert.ok(dir("style-src").includes("https://fonts.googleapis.com"));
    assert.ok(dir("frame-src").length > 0 && dir("img-src").length > 0);
  });
});

describe("[123][124][125] readability", () => {
  it("readiness error text is dark red, Apply fallback is light on #020817", () => {
    const cr = read(`${SRC}/pages/CreditReadiness.tsx`);
    assert.ok(cr.includes("text-[#b91c1c]") && !cr.includes("text-red-300"));
    assert.ok(cr.includes("placeholder:text-[#6b7280]"));
    const apply = read(`${SRC}/pages/Apply.tsx`);
    assert.ok(apply.includes("text-[#cbd5e1]") && !apply.includes("text-slate-600"));
    assert.match(read(`${SRC}/styles/global.css`), /::placeholder[\s\S]*?color: #6b7280/);
  });
});

describe("[126] CASL on every lead form", () => {
  it("contact, readiness, Maya and booking send casl fields", () => {
    for (const f of ["components/ContactForm.tsx", "pages/CreditReadiness.tsx", "components/FloatingChat.tsx", "pages/Book.tsx"]) {
      const s = read(`${SRC}/${f}`);
      assert.ok(s.includes("caslFields("), `${f} does not send casl fields`);
      assert.ok(s.includes("<CaslConsent"), `${f} does not show the consent box`);
      assert.ok(s.includes("useState(false)"), `${f}: box must start unticked`);
    }
  });
});

describe("[127] dead server removed", () => {
  it("files, scripts and packages are gone", () => {
    for (const f of ["server", "drizzle.config.ts", "Dockerfile", "Procfile", "docs/azure-deployment.md", `${SRC}/utils/chatSocket.ts`, "tests/contact-form.test.ts", "tests/readiness-submission.test.ts"]) {
      assert.equal(fs.existsSync(f), false, f);
    }
    const pkg = JSON.parse(read("package.json"));
    for (const s of ["start", "build:server", "db:push"]) assert.equal(pkg.scripts[s], undefined, s);
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };
    for (const d of ["express", "passport", "express-session", "connect-pg-simple", "memorystore", "@neondatabase/serverless", "drizzle-orm", "drizzle-zod", "drizzle-kit", "ws", "helmet", "compression"]) {
      assert.equal(deps[d], undefined, d);
    }
  });
});

describe("[128] email landing iframe", () => {
  it("is sandboxed without scripts or same-origin", () => {
    const s = read(`${SRC}/pages/EmailLanding.tsx`);
    assert.ok(s.includes('sandbox="allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"'));
    const attr = s.match(/sandbox="([^"]*)"/)?.[1] ?? "";
    assert.ok(!/allow-scripts|allow-same-origin/.test(attr));
  });
});

describe("[129][138] real upstream packages", () => {
  it("no vendored stand-ins for the listed packages", () => {
    const pkg = JSON.parse(read("package.json"));
    const deps = { ...pkg.dependencies, ...pkg.devDependencies } as Record<string, string>;
    assert.match(deps.html2canvas ?? "", /^\^1\./);
    assert.match(deps["react-helmet-async"] ?? "", /^\^2\./);
    assert.match(deps["vite-plugin-compression"] ?? "", /^\^0\./);
    for (const d of ["react-router-dom", "react-helmet", "@replit/vite-plugin-cartographer", "@replit/vite-plugin-runtime-error-modal"]) {
      assert.equal(deps[d], undefined, d);
    }
    for (const v of ["html2canvas", "react-helmet", "react-helmet-async", "react-router-dom", "compression", "helmet", "vite-plugin-compression"]) {
      assert.equal(fs.existsSync(`vendor/${v}`), false, `vendor/${v}`);
    }
    assert.ok(!/audit\s*=\s*false/.test(read(".npmrc")));
  });
});

describe("[130] per-page head tags", () => {
  it("prerenders each sitemap route with its own head", () => {
    const dist = fs.mkdtempSync(path.join(os.tmpdir(), "bf-dist-"));
    fs.writeFileSync(
      path.join(dist, "index.html"),
      '<html><head>\n    <title>Boreal Financial</title>\n    <meta\n      data-rh="true"\n      name="description"\n      content="generic"\n    />\n  </head><body></body></html>',
    );
    const written = prerenderHeads(dist, ["/", "/contact", "/products/loc"]);
    assert.equal(written.length, 3);
    const contact = fs.readFileSync(outputPathFor(dist, "/contact"), "utf8");
    assert.match(contact, /<title>Contact Boreal Financial \| Talk To A Real Person<\/title>/);
    assert.match(contact, /<link data-rh="true" rel="canonical" href="https:\/\/www\.boreal\.financial\/contact" \/>/);
    assert.match(contact, /property="og:image" content="https:\/\/www\.boreal\.financial\/images\//);
    assert.ok(!contact.includes('content="generic"'), "the generic description is still there");
    assert.equal((contact.match(/name="description"/g) ?? []).length, 1);
    const home = fs.readFileSync(path.join(dist, "index.html"), "utf8");
    assert.match(home, /href="https:\/\/www\.boreal\.financial\/"/);
    assert.throws(() => prerenderHeads(dist, ["/not-in-the-map"]), /No route meta/);
    assert.throws(() => applyHead("<html></html>", { path: "/", title: "t", description: "d", canonical: "c", ogTitle: "t", ogDescription: "d", ogImage: "i" }));
  });
  it("runs after every build, and SEO uses the real react-helmet-async", () => {
    const pkg = JSON.parse(read("package.json"));
    assert.match(pkg.scripts.build, /^vite build && tsx scripts\/prerender-head\.ts && tsx scripts\/stamp-sw\.ts$/);
    assert.ok(read(`${SRC}/components/SEO.tsx`).includes('from "react-helmet-async"'));
    assert.ok(read(`${SRC}/components/RouteHead.tsx`).includes('from "react-helmet-async"'));
  });
});

describe("[131][132] dead and duplicate modules", () => {
  it("are deleted, and nothing imports them", () => {
    const gone = [
      "components/layout/Footer.tsx", "components/Navbar.tsx", "components/layout/Navbar.tsx", "components/navigation.tsx",
      "components/ContactModal.tsx", "features/contact/ContactModal.tsx", "components/IndustryCards.tsx",
      "components/marketplace/IndustryCards.tsx", "components/MarketplaceSteps.tsx", "components/marketplace/MarketplaceSteps.tsx",
      "components/ProductGrid.tsx", "components/marketplace/ProductGrid.tsx", "components/CompareModal.tsx",
      "components/ProductComparisonModal.tsx", "features/comparison/ComparisonModal.tsx", "utils/readinessScore.ts",
      "utils/lenderCount.ts", "hooks/useLenderCount.ts", "features/lead/ExitIntentModal.tsx", "data/seoClusters.ts",
      "data/seoFramework.ts", "data/seoLandingConfig.ts", "templates/ProductTemplate.tsx", "components/SeoJsonLd.tsx",
    ];
    for (const f of gone) assert.equal(fs.existsSync(`${SRC}/${f}`), false, f);
    assert.equal(fs.existsSync("client/components/SEO.tsx"), false);
    assert.ok(fs.existsSync(`${SRC}/components/footer.tsx`), "the live footer must stay");
    assert.ok(fs.existsSync(`${SRC}/lib/creditReadinessScore.ts`), "the live readiness score must stay");
    const maya = read(`${SRC}/services/mayaService.ts`);
    for (const fn of ["trackMarketingLead", "fetchFaq", "joinStartupWaitlist"]) assert.ok(!maya.includes(fn), fn);
  });
});

describe("[133] one API base module", () => {
  it("only config/env.ts names the server origin", () => {
    const offenders = walk(SRC).filter((f) => !f.endsWith(path.join("config", "env.ts")) && read(f).includes("server.boreal.financial"));
    assert.deepEqual(offenders, []);
    assert.equal(fs.existsSync(`${SRC}/config/api.ts`), false);
    for (const f of walk(SRC)) assert.ok(!/\/api\/v1\//.test(read(f)), `${f} calls /api/v1/`);
  });
});

describe("[134] phone click", () => {
  it("fires phone_click, never apply_click", () => {
    const s = read(`${SRC}/pages/Contact.tsx`);
    const tag = s.slice(s.indexOf("<a href={PHONE_HREF}"), s.indexOf("{PHONE_DISPLAY}</a>"));
    assert.ok(tag.includes('trackEvent("phone_click"'));
    assert.ok(!tag.includes("apply_click") && !tag.includes("trackConversion"));
  });
});

describe("[135] organization logo", () => {
  it("points at a file in public/images", () => {
    const s = read(`${SRC}/lib/structured-data.ts`);
    const p = s.match(/ORGANIZATION_LOGO_PATH = "([^"]+)"/)?.[1] ?? "";
    assert.match(p, /^\/images\//);
    assert.ok(fs.existsSync(`client/public${p}`), p);
    assert.ok(s.includes("logo: `${BASE_URL}${ORGANIZATION_LOGO_PATH}`"));
  });
});

describe("[136] service worker", () => {
  const sw = read("client/public/sw.js");
  it("has a build-time hash placeholder, not a hand-edited version", () => {
    assert.ok(sw.includes(`const VERSION = "${SW_PLACEHOLDER}";`));
    const stamped = stampServiceWorker(sw, "0123456789abcdef");
    assert.ok(stamped.includes('const VERSION = "0123456789abcdef";') && !stamped.includes(SW_PLACEHOLDER));
    assert.throws(() => stampServiceWorker("const VERSION = 'v16';", "0123456789abcdef"));
  });
  it("the hash follows the build output", () => {
    const dist = fs.mkdtempSync(path.join(os.tmpdir(), "bf-sw-"));
    fs.writeFileSync(path.join(dist, "index.html"), "a");
    fs.writeFileSync(path.join(dist, "sw.js"), sw);
    const one = buildHash(dist);
    fs.writeFileSync(path.join(dist, "sw.js"), "changed");
    assert.equal(buildHash(dist), one, "sw.js itself must not feed the hash");
    fs.writeFileSync(path.join(dist, "index.html"), "b");
    assert.notEqual(buildHash(dist), one);
  });
  it("is network-first for HTML, sitemap.xml and llms.txt", () => {
    assert.ok(sw.includes('"/sitemap.xml"') && sw.includes('"/llms.txt"'));
    assert.ok(sw.includes('if (req.mode === "navigate") return true;'));
    assert.ok(sw.includes('accept.includes("text/html")'));
    assert.ok(sw.includes("isNetworkFirst(req, url) ? networkFirst(req) : cacheFirst(req)"));
  });
});

describe("[137] readiness phone validation", () => {
  it("uses the same rule as the contact form", () => {
    const cr = read(`${SRC}/pages/CreditReadiness.tsx`);
    const cf = read(`${SRC}/components/ContactForm.tsx`);
    for (const s of [cr, cf]) assert.ok(s.includes("pattern={PHONE_PATTERN} title={PHONE_TITLE}"));
  });
});

describe("[3] CI", () => {
  it("checks run on PRs to main and gate the deploy; the empty Deploy workflow is gone", () => {
    assert.equal(fs.existsSync(".github/workflows/deploy.yml"), false);
    const ci = read(".github/workflows/ci.yml");
    assert.match(ci, /pull_request:\s*\n\s*branches: \[ main \]/);
    for (const step of ["npm run typecheck", "npm run lint", "npm test", "npm run build"]) assert.ok(ci.includes(step), step);
    const swa = read(".github/workflows/azure-static-web-apps-brave-flower-03cdffe0f.yml");
    assert.ok(swa.includes("uses: ./.github/workflows/ci.yml"));
    assert.match(swa, /build_and_deploy_job:\s*\n\s*needs: checks/);
  });
});

describe("rules", () => {
  it("the only phone number added is the 866 main line", () => {
    for (const f of [...walk(SRC), "client/public/js/head-init.js"]) {
      const numbers = read(f).match(/\(?\b\d{3}\)?[ .-]\d{3}-\d{4}\b/g) ?? [];
      // 555-01xx numbers are reserved fictional examples (formatting hints)
      for (const n of numbers) assert.match(n, /866\)? ?631-8939|555-01\d\d/, `${f}: ${n}`);
    }
  });
  it("new v789 files are ASCII only", () => {
    const files = [
      `${SRC}/lib/conversationToken.ts`, `${SRC}/lib/casl.ts`, `${SRC}/components/CaslConsent.tsx`, `${SRC}/analytics/consent.ts`,
      `${SRC}/seo/routeMeta.ts`, `${SRC}/components/RouteHead.tsx`, `${SRC}/config/env.ts`, `${SRC}/lib/safeFetch.ts`,
      `${SRC}/lib/mayaClient.ts`, "client/public/js/head-init.js", "client/public/sw.js", "client/public/staticwebapp.config.json",
      "scripts/prerender-head.ts", "scripts/stamp-sw.ts", ".github/workflows/ci.yml",
    ];
    for (const f of files) assert.ok([...read(f)].every((ch) => ch.charCodeAt(0) < 128), `${f} has non-ASCII characters`);
  });
});
