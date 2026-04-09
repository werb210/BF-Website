import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Users, Clock, DollarSign } from "lucide-react";
import { Seo } from "@/components/SEO";
import { SeoImage } from "@/components/SeoImage";
import { APPLY_URL } from "@/config/links";
import SeoJsonLd from "@/components/SeoJsonLd";
import { faqSchema, serviceSchema } from "@/seo/structuredData";

export default function BusinessLineOfCredit() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Seo title="Business Line of Credit | Boreal Financial" description="A business line of credit that provides revolving access to capital as your cash flow needs change." canonical="https://borealfinancial.ca/business-line-of-credit" />
      <SeoJsonLd
        data={serviceSchema(
          "Business Line of Credit",
          "Flexible working capital financing for Canadian businesses.",
          "/line-of-credit"
        )}
      />
      <SeoJsonLd
        data={faqSchema([
          {
            question: "How fast can I get a business line of credit?",
            answer: "Approvals can occur within 24–72 hours depending on documentation.",
          },
          {
            question: "What credit score is required?",
            answer: "Most lenders require 600+, but alternative options exist.",
          },
        ])}
      />
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-16 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-secondary leading-tight" data-testid="page-title">
                Welcome to Your Business Line of Credit Hub!
              </h1>
              <p className="text-lg text-gray-700 leading-relaxed" data-testid="page-description">
                Are you ready to propel your business to new heights? Unlock the potential of your company with an exclusive Business Line of Credit, designed to fuel growth, streamline operations, and secure your financial future.
              </p>
              
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4" data-testid="credit-amount-highlight">
                <h3 className="text-xl font-semibold text-primary mb-2">Access up to 35% of your Annual Sales</h3>
              </div>
            </div>
            
            <div>
              <SeoImage 
                src="" 
                alt="Modern business equipment and office workspace setup" 
                className="rounded-xl shadow-lg w-full h-auto"
                data-testid="hero-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-secondary mb-4" data-testid="why-choose-title">
              Why Choose A Business Line of Credit?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <Card className="text-center border-gray-200" data-testid="benefit-flexibility">
              <CardContent className="p-6">
                <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-secondary mb-2">Flexibility at Your Fingertips</h3>
                <p className="text-gray-700 text-sm">Say goodbye to rigid loan terms. Draw funds whenever you need them for inventory, equipment, or opportunities.</p>
              </CardContent>
            </Card>

            <Card className="text-center border-gray-200" data-testid="benefit-speed">
              <CardContent className="p-6">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-secondary mb-2">Fast & Hassle-Free Application</h3>
                <p className="text-gray-700 text-sm">Time is money. Our streamlined process ensures quick decisions, letting you focus on running your business.</p>
              </CardContent>
            </Card>

            <Card className="text-center border-gray-200" data-testid="benefit-rates">
              <CardContent className="p-6">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-secondary mb-2">Competitive Rates & Terms</h3>
                <p className="text-gray-700 text-sm">We offer competitive rates and flexible terms to suit your unique needs. Your success is our priority.</p>
              </CardContent>
            </Card>

            <Card className="text-center border-gray-200" data-testid="benefit-peace">
              <CardContent className="p-6">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-secondary mb-2">Peace of Mind</h3>
                <p className="text-gray-700 text-sm">Running a business comes with uncertainties, but your finances don't have to be one of them.</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {/* Business line of credit image */}
              <SeoImage 
                src="" 
                alt="Business owner reviewing line of credit documentation in modern office" 
                className="rounded-xl shadow-lg w-full h-auto"
                data-testid="credit-documentation-image"
              />
            </div>

            <div className="space-y-6">
              <Card className="border-gray-200" data-testid="how-it-works-card">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-secondary mb-4">How It Works</h3>
                  <div className="space-y-3">
                    {[
                      "Apply Online - Simple secure application form",
                      "Approval Decision - Fast review by our experts",
                      "Access Funds - Draw when you need them",
                      "Repay with Ease - Pay only what you use"
                    ].map((step, index) => (
                      <div key={index} className="flex items-center space-x-3" data-testid={`how-it-works-step-${index}`}>
                        <div className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold">
                          {index + 1}
                        </div>
                        <span className="text-gray-700">{step}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200" data-testid="eligibility-card">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-secondary mb-4">Eligibility Requirements</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    {[
                      "$150,000 annual sales",
                      "1+ years business activity",
                      "Satisfactory credit scores",
                      "Canadian based business"
                    ].map((requirement, index) => (
                      <div key={index} className="flex items-center space-x-2" data-testid={`eligibility-requirement-${index}`}>
                        <CheckCircle className="w-4 h-4 text-accent" />
                        <span>{requirement}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Who Can Apply Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            <Users className="w-12 h-12 text-primary mx-auto mb-6" />
            <h2 className="text-2xl lg:text-3xl font-bold text-secondary mb-4" data-testid="who-can-apply-title">
              Who Can Apply?
            </h2>
            <p className="text-lg text-gray-700 mb-6" data-testid="who-can-apply-description">
              Business Line of Credit is designed for businesses of all sizes and industries. Our financing solution can be tailored to fit your specific requirements.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-700 mb-8">
              {[
                "$150,000 annual sales",
                "1+ years of business activity",
                "Satisfactory Personal and Corporate Credit Scores",
                "Canadian based Business"
              ].map((criteria, index) => (
                <div key={index} className="flex items-center space-x-2" data-testid={`application-criteria-${index}`}>
                  <CheckCircle className="w-4 h-4 text-accent flex-shrink-0" />
                  <span>{criteria}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6" data-testid="cta-title">
            Get Started Today!
          </h2>
          <p className="text-lg mb-8 text-blue-100 max-w-2xl mx-auto" data-testid="cta-description">
            Don't let financial constraints hold back your business's potential. Take the first step toward success by applying for a Business Line of Credit. We are committed to helping you achieve your goals and build a thriving future for your company.
          </p>
          <div className="space-y-4">
            <Button size="lg" variant="secondary" asChild data-testid="button-apply-now-main">
              <a href={APPLY_URL}>
                Apply Now
              </a>
            </Button>
            <p className="text-sm text-blue-200" data-testid="disclaimer">
              <em>Disclaimer: The terms and conditions of the Business Line of Credit may vary. The rates and eligibility are subject to approval. Please review the full terms before applying.</em>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
