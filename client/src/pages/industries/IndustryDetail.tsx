import { useParams } from "react-router-dom"

interface Props {
  slug?: string
}

export default function IndustryDetail({ slug }: Props) {
  const params = useParams()

  const industry = slug || params.slug || "construction"

  return (
    <div className="industry-page">
      <h1>{industry.replace("-", " ").toUpperCase()}</h1>
      <p>Industry financing solutions for {industry} businesses.</p>
    </div>
  )
}
