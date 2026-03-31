import { AppRouter as Router } from "@/router/AppRouter"
import FloatingChat from "./components/FloatingChat"
import MayaWidget from "@/components/MayaWidget"
import LeadForm from "@/components/LeadForm"

function App() {
  return (
    <>
      <Router />
      <LeadForm />
      <MayaWidget />
      <FloatingChat />
    </>
  )
}

export default App
