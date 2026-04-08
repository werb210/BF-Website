import type { ComponentType } from "react";
import { SEO } from "@/seo/SEO";
import { seoGeneratedPages } from "@/pages/seo-generated/routeManifest";
import NotFound from "@/pages/NotFound";

interface SeoGeneratedPageProps {
  path: string;
}

export default function SeoGeneratedPage({ path }: SeoGeneratedPageProps) {
  const PageComponent = seoGeneratedPages[path] as ComponentType | undefined;
  if (!PageComponent) {
    return (
      <>
        <SEO title="Page Not Found" description="The requested page does not exist." noindex />
        <NotFound />
      </>
    );
  }

  return <PageComponent />;
}
