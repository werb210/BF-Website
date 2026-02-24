import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, TrendingUp, Clock, Shield } from "lucide-react";
import { Seo } from "@/components/SEO";
import { financialServiceJsonLd } from "@/lib/structured-data";
import { SeoImage } from "@/components/SeoImage";
import { APPLY_URL } from "@/config/site";

export default function AccountReceivableFinancing() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Seo title="Accounts Receivable Financing | Boreal Financial" description="Turn unpaid invoices into immediate working capital with Boreal Financial accounts receivable financing." canonical="https://borealfinancial.ca/account-receivable-financing" jsonLd={financialServiceJsonLd("Accounts Receivable Financing", "Convert receivables into fast working capital.", "/account-receivable-financing")} />
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-white py-16 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-secondary leading-tight" data-testid="page-title">
                Account Receivable Financing
              </h1>
              <p className="text-lg text-gray-700 leading-relaxed" data-testid="page-description">
                Accounts receivable are usually the first asset a company seeks to monetize through financing. Accounts receivable financing through asset-based lending is a viable alternative to bank financing for companies looking for maximum flexibility.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed" data-testid="value-proposition">
                Accounts receivable loans and other financing methods can unlock the value of the accounts receivable you have earned but have not yet collected.
              </p>
            </div>
            
            <div>
              <SeoImage 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=800" 
                alt="Financial analytics dashboard showing accounts receivable data" 
                className="rounded-xl shadow-lg w-full h-auto"
                data-testid="hero-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-secondary mb-4" data-testid="benefits-title">
              Why Choose Account Receivable Financing?
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto" data-testid="benefits-description">
              Turn your outstanding invoices into immediate working capital
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center border-gray-200" data-testid="benefit-cash-flow">
              <CardContent className="p-6">
                <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-secondary mb-2">Improved Cash Flow</h3>
                <p className="text-gray-700 text-sm">Convert your receivables into immediate cash to maintain steady cash flow</p>
              </CardContent>
            </Card>

            <Card className="text-center border-gray-200" data-testid="benefit-flexibility">
              <CardContent className="p-6">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-secondary mb-2">Maximum Flexibility</h3>
                <p className="text-gray-700 text-sm">Asset-based lending offers more flexibility than traditional bank financing</p>
              </CardContent>
            </Card>

            <Card className="text-center border-gray-200" data-testid="benefit-speed">
              <CardContent className="p-6">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-secondary mb-2">Quick Access</h3>
                <p className="text-gray-700 text-sm">Get funds quickly without waiting 30-90 days for customer payments</p>
              </CardContent>
            </Card>

            <Card className="text-center border-gray-200" data-testid="benefit-growth">
              <CardContent className="p-6">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-secondary mb-2">Business Growth</h3>
                <p className="text-gray-700 text-sm">Use immediate capital to take on new opportunities and grow your business</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-secondary mb-4" data-testid="how-it-works-title">
              How Account Receivable Financing Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center border-gray-200" data-testid="step-1">
              <CardContent className="p-6">
                <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  1
                </div>
                <h3 className="text-lg font-semibold text-secondary mb-3">Submit Your Invoices</h3>
                <p className="text-gray-700">Provide us with your outstanding accounts receivable and customer information</p>
              </CardContent>
            </Card>

            <Card className="text-center border-gray-200" data-testid="step-2">
              <CardContent className="p-6">
                <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  2
                </div>
                <h3 className="text-lg font-semibold text-secondary mb-3">Quick Evaluation</h3>
                <p className="text-gray-700">We evaluate your receivables and provide you with a financing offer</p>
              </CardContent>
            </Card>

            <Card className="text-center border-gray-200" data-testid="step-3">
              <CardContent className="p-6">
                <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  3
                </div>
                <h3 className="text-lg font-semibold text-secondary mb-3">Receive Funds</h3>
                <p className="text-gray-700">Get immediate cash advance on your receivables, typically 75-90% of face value</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features & Requirements */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <Card className="border-gray-200 h-full" data-testid="financing-features">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-secondary mb-6">Financing Features</h3>
                  <div className="space-y-4">
                    {[
                      "Advance rates of 75-90% of invoice value",
                      "No long-term contracts required",
                      "Credit decisions based on your customers' creditworthiness",
                      "Ongoing financing as your business grows",
                      "Professional collections management",
                      "Detailed reporting and account management"
                    ].map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3" data-testid={`financing-feature-${index}`}>
                        <CheckCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="border-gray-200 h-full" data-testid="eligibility-requirements">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-secondary mb-6">Typical Requirements</h3>
                  <div className="space-y-4">
                    {[
                      "Monthly sales of $100,000 or more",
                      "B2B invoices with net 30-90 day terms",
                      "Creditworthy commercial customers",
                      "Clean accounts receivable aging",
                      "Established business with operating history",
                      "No significant liens on receivables"
                    ].map((requirement, index) => (
                      <div key={index} className="flex items-start space-x-3" data-testid={`eligibility-requirement-${index}`}>
                        <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{requirement}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Industries Served */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-secondary mb-4" data-testid="industries-title">
              Industries We Serve
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto" data-testid="industries-description">
              Account receivable financing is suitable for businesses across many industries
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6 text-center">
            {[
              "Manufacturing",
              "Distribution",
              "Staffing Services",
              "Transportation",
              "Professional Services",
              "Technology",
              "Healthcare",
              "Construction",
              "Wholesale Trade",
              "Government Contractors",
              "Import/Export",
              "And Many More"
            ].map((industry, index) => (
              <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200" data-testid={`industry-${index}`}>
                <span className="text-sm font-medium text-gray-700">{industry}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-accent text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6" data-testid="cta-title">
            Unlock the Value of Your Receivables
          </h2>
          <p className="text-lg mb-8 text-green-100 max-w-2xl mx-auto" data-testid="cta-description">
            Don't wait 30-90 days for payment. Convert your outstanding invoices into immediate working capital today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild data-testid="button-apply-now">
              <a href={APPLY_URL}>
                Apply Now
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild data-testid="button-learn-more">
              <a href="mailto:Info@boreal.financial" className="border-white text-white hover:bg-white hover:text-accent">
                Learn More
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
