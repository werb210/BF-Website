import { useEffect } from "react"

interface Props {
  title: string
  description: string
}

export default function Meta({ title, description }: Props) {
  useEffect(() => {
    document.title = title

    let tag = document.querySelector("meta[name='description']")

    if (!tag) {
      tag = document.createElement("meta")
      tag.setAttribute("name", "description")
      document.head.appendChild(tag)
    }

    tag.setAttribute("content", description)
  }, [title, description])

  return null
}
