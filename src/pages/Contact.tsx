import { useEffect } from "react";
import { SEO } from "@/seo/SEO";
import { scrollToTop } from "@/utils/scrollToTop";
import ContactForm from "@/components/ContactForm";

export default function Contact() {
  useEffect(() => {
    scrollToTop();
  }, []);

  return (
    <section className="mx-auto max-w-3xl px-4 py-12 text-white">
      <SEO title="Contact Boreal" description="Connect with Boreal for structured capital advisory." url="https://borealfinancial.ca/contact" />
      <h1 className="text-4xl font-semibold text-white">Contact Boreal</h1>
      <h2 className="mt-3 text-4xl font-bold text-white">Tell us about your business and an advisor will follow up.</h2>
      <ContactForm />
    </section>
  );
}
