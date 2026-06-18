import { useEffect } from "react"
import { useLocation } from "wouter"
import { AppRouter as Router } from "@/router/AppRouter"
import FloatingChat from "./components/FloatingChat"
import ConsentBanner from "./components/ConsentBanner"

function App() {
  const [location] = useLocation()

  // #53 — fire a GTM page_view on every SPA route change (and initial load).
  useEffect(() => {
    const w = window as unknown as { dataLayer?: unknown[] }
    if (Array.isArray(w.dataLayer)) {
      w.dataLayer.push({
        event: "page_view",
        page_path: location,
        page_location: window.location.href,
        page_title: document.title,
        timestamp: Date.now(),
      })
    }
  }, [location])

  return (
    <>
      <Router />
      <FloatingChat />
      <ConsentBanner />
    </>
  )
}

export default App
