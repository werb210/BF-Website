import { Helmet } from "react-helmet-async"

interface Props {
  title: string
  description: string
  url?: string
}

export default function SEO({ title, description, url }: Props) {
  const site = "https://borealfinance.com"

  return (
    <Helmet>
      <title>{title}</title>

      <meta name="description" content={description} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${site}${url || ""}`} />

      <meta name="twitter:card" content="summary_large_image" />

      <link rel="canonical" href={`${site}${url || ""}`} />
    </Helmet>
  )
}
