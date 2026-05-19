import fs from "node:fs";
import path from "node:path";
import { seoClusters } from "../client/src/data/seoClusters";

interface GeneratedRouteEntry {
  route: string;
  importName: string;
  fileName: string;
  priority: string;
  changefreq: "weekly" | "monthly";
}

const BASE_URL = process.env.VITE_SITE_URL ?? "https://borealfinancial.ca";
const generatedDir = path.resolve(process.cwd(), "client/src/pages/seo-generated");
const routesJsonPath = path.resolve(process.cwd(), "client/src/data/generatedSeoRoutes.json");
const routeManifestPath = path.resolve(generatedDir, "routeManifest.ts");

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function toTitleCase(value: string) {
  return value
    .split("-")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

function pascalCase(value: string) {
  return value
    .split("-")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join("");
}

function buildInternalLinks(productSlug: string) {
  const locationLinks = seoClusters.locations
    .map((location) => {
      const locationSlug = toSlug(location);
      return `<li><a className="text-blue-700 underline" href="/products/${productSlug}/${locationSlug}">${location}</a></li>`;
    })
    .join("\n            ");

  const industryLinks = seoClusters.industries
    .map((industry) => `<li><a className="text-blue-700 underline" href="/products/${productSlug}/industry/${toSlug(industry)}">${toTitleCase(toSlug(industry))}</a></li>`)
    .join("\n            ");

  const intentLinks = seoClusters.intents
    .map((intent) => `<li><a className="text-blue-700 underline" href="/products/${productSlug}/intent/${toSlug(intent)}">${toTitleCase(toSlug(intent))}</a></li>`)
    .join("\n            ");

  return { locationLinks, industryLinks, intentLinks };
}

function pageTemplate(args: {
  componentName: string;
  title: string;
  description: string;
  canonicalPath: string;
  h1: string;
  intro: string;
  productName: string;
  productSlug: string;
  faqGetter: string;
  faqArgs: string;
}) {
  const internal = buildInternalLinks(args.productSlug);

  return `import { Seo } from "@/components/Seo";
import { SEOFAQ } from "@/components/SEOFAQ";
import { ${args.faqGetter} } from "@/data/faqs";

const BASE_URL = "${BASE_URL}";

export default function ${args.componentName}() {
  const faqs = ${args.faqGetter}(${args.faqArgs});
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Boreal Financial",
    url: BASE_URL,
    logo: BASE_URL + "/header.png"
  };

  const financialServiceJsonLd = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: "Boreal Financial",
    serviceType: "${args.productName}",
    areaServed: "Canada",
    description: "${args.description}",
    url: BASE_URL + "${args.canonicalPath}"
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <Seo
        title="${args.title}"
        description="${args.description}"
        canonical={BASE_URL + "${args.canonicalPath}"}
        jsonLd={[organizationJsonLd, financialServiceJsonLd]}
      />

      <h1 className="text-4xl font-bold text-primary mb-4">${args.h1}</h1>
      <p className="text-lg text-slate-700 mb-6">${args.intro}</p>

      <section className="space-y-4 text-slate-700">
        <p>
          This page is part of Boreal Financial&apos;s scalable SEO framework. Use this section as
          a structured content scaffold to expand with product specifics, qualification guidelines,
          expected timelines, and rate considerations for ${args.productName.toLowerCase()}.
        </p>
        <p>
          Include market-aware details, trust indicators, underwriting context, and value propositions
          tailored to the target search intent. Keep content naturally readable while covering the key
          user questions that drive conversions for commercial finance topics.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-3">Related ${args.productName} Resources</h2>
        <p className="mb-3">
          Start with the main product overview: <a className="text-blue-700 underline" href="/products/${args.productSlug}">${args.productName}</a>.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-semibold mb-2">Locations</h3>
            <ul className="space-y-1">
            ${internal.locationLinks}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Industries</h3>
            <ul className="space-y-1">
            ${internal.industryLinks}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Intent Paths</h3>
            <ul className="space-y-1">
            ${internal.intentLinks}
            </ul>
          </div>
        </div>
      </section>

      <section className="mt-10 bg-slate-50 rounded-lg p-6 border">
        <h2 className="text-2xl font-semibold mb-2">Get a tailored quote</h2>
        <p className="mb-3">Talk to Boreal Financial specialists to compare lender options and structure a competitive offer.</p>
        <a href="/contact" className="inline-block px-4 py-2 bg-primary text-white rounded-md">Request Funding Options</a>
      </section>

      <SEOFAQ faqs={faqs} title="${args.productName} FAQs" />
    </main>
  );
}
`;
}

function writePage(fileName: string, content: string) {
  fs.writeFileSync(path.resolve(generatedDir, fileName), content, "utf8");
}

async function generate() {
  fs.mkdirSync(generatedDir, { recursive: true });

  const generatedEntries: GeneratedRouteEntry[] = [];

  for (const product of seoClusters.products) {
    const productComponent = `${pascalCase(product.slug)}PillarPage`;
    const productFile = `${product.slug}-pillar.tsx`;
    const productRoute = `/products/${product.slug}`;

    writePage(
      productFile,
      pageTemplate({
        componentName: productComponent,
        title: `${product.name} | Boreal Financial`,
        description: `Explore ${product.name.toLowerCase()} options with Boreal Financial, including approval factors, timelines, and funding structures for Canadian businesses.`,
        canonicalPath: productRoute,
        h1: `${product.name} in Canada`,
        intro: `Discover how ${product.name.toLowerCase()} can support growth, cover operational gaps, and improve cash-flow flexibility for your business.`,
        productName: product.name,
        productSlug: product.slug,
        faqGetter: "getProductFaqs",
        faqArgs: `"${product.name}"`
      })
    );

    generatedEntries.push({ route: productRoute, importName: productComponent, fileName: productFile, priority: "0.9", changefreq: "weekly" });

    for (const location of seoClusters.locations) {
      const locationSlug = toSlug(location);
      const componentName = `${pascalCase(product.slug)}${pascalCase(locationSlug)}LocationPage`;
      const fileName = `${product.slug}-${locationSlug}-location.tsx`;
      const route = `/products/${product.slug}/${locationSlug}`;

      writePage(
        fileName,
        pageTemplate({
          componentName,
          title: `${product.name} in ${location} | Boreal Financial`,
          description: `Find ${product.name.toLowerCase()} in ${location} with lender options aligned to local business needs, eligibility, and repayment preferences.`,
          canonicalPath: route,
          h1: `${product.name} in ${location}`,
          intro: `Boreal Financial helps businesses in ${location} compare ${product.name.toLowerCase()} offers with transparent guidance and practical timelines.`,
          productName: product.name,
          productSlug: product.slug,
          faqGetter: "getLocationFaqs",
          faqArgs: `"${product.name}", "${location}"`
        })
      );

      generatedEntries.push({ route, importName: componentName, fileName, priority: "0.8", changefreq: "weekly" });
    }

    for (const industry of seoClusters.industries) {
      const industrySlug = toSlug(industry);
      const componentName = `${pascalCase(product.slug)}${pascalCase(industrySlug)}IndustryPage`;
      const fileName = `${product.slug}-${industrySlug}-industry.tsx`;
      const route = `/products/${product.slug}/industry/${industrySlug}`;

      writePage(
        fileName,
        pageTemplate({
          componentName,
          title: `${product.name} for ${toTitleCase(industrySlug)} | Boreal Financial`,
          description: `Learn how ${product.name.toLowerCase()} supports ${industry} businesses with financing structures designed for operational realities and growth goals.`,
          canonicalPath: route,
          h1: `${product.name} for ${toTitleCase(industrySlug)} Businesses`,
          intro: `Compare ${product.name.toLowerCase()} programs built for ${industry} operators seeking predictable repayment and working-capital resilience.`,
          productName: product.name,
          productSlug: product.slug,
          faqGetter: "getIndustryFaqs",
          faqArgs: `"${product.name}", "${industry}"`
        })
      );

      generatedEntries.push({ route, importName: componentName, fileName, priority: "0.75", changefreq: "monthly" });
    }

    for (const intent of seoClusters.intents) {
      const intentSlug = toSlug(intent);
      const componentName = `${pascalCase(product.slug)}${pascalCase(intentSlug)}IntentPage`;
      const fileName = `${product.slug}-${intentSlug}-intent.tsx`;
      const route = `/products/${product.slug}/intent/${intentSlug}`;

      writePage(
        fileName,
        pageTemplate({
          componentName,
          title: `${product.name} - ${toTitleCase(intentSlug)} | Boreal Financial`,
          description: `Review ${product.name.toLowerCase()} options for businesses prioritizing ${intent}, with clear expectations for qualification and funding timelines.`,
          canonicalPath: route,
          h1: `${product.name} with ${toTitleCase(intentSlug)}`,
          intro: `If your priority is ${intent}, this page outlines how ${product.name.toLowerCase()} solutions can be structured to meet your financing goals.`,
          productName: product.name,
          productSlug: product.slug,
          faqGetter: "getIntentFaqs",
          faqArgs: `"${product.name}", "${intent}"`
        })
      );

      generatedEntries.push({ route, importName: componentName, fileName, priority: "0.72", changefreq: "monthly" });
    }
  }

  const importLines = generatedEntries
    .map((entry) => `import ${entry.importName} from "./${entry.fileName.replace(/\.tsx$/, "")}";`)
    .join("\n");

  const mapLines = generatedEntries.map((entry) => `  "${entry.route}": ${entry.importName},`).join("\n");

  const routeManifestContent = `${importLines}
import type { ComponentType } from "react";

export const seoGeneratedPages: Record<string, ComponentType> = {
${mapLines}
};
`;

  fs.writeFileSync(routeManifestPath, routeManifestContent, "utf8");
  fs.writeFileSync(routesJsonPath, JSON.stringify(generatedEntries, null, 2), "utf8");

  console.log(`Generated ${generatedEntries.length} SEO pages and route manifest.`);
}

generate().catch((error: unknown) => {
  console.error("Failed to generate SEO pages", error);
  process.exit(1);
});
