import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Package, TrendingUp, Clock, Target } from "lucide-react";
import { Seo } from "@/components/SEO";
import { financialServiceJsonLd } from "@/lib/structured-data";
import { SeoImage } from "@/components/SeoImage";
import { APPLY_URL } from "@/config/links";

export default function POFinancing() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Seo title="PO Financing | Boreal Financial" description="Purchase order financing options to fund supplier deposits and satisfy high-volume customer demand." canonical="https://borealfinancial.ca/po-financing" jsonLd={financialServiceJsonLd("PO Financing", "Support supplier payments tied to purchase orders.", "/po-financing")} />
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 to-white py-16 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-secondary leading-tight" data-testid="page-title">
                Purchase Order Financing
              </h1>
              <p className="text-lg text-gray-700 leading-relaxed" data-testid="page-description">
                Big orders can be a big opportunity—but only if you have the capital to fulfill them. Purchase Order (PO) Financing helps you seize those opportunities without tying up your cash flow.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed" data-testid="value-proposition">
                It's a smart way to bridge the gap between receiving large customer orders and paying your suppliers, allowing you to grow your business without the constraints of limited working capital.
              </p>
            </div>
            
            <div>
              <SeoImage 
                src="" 
                alt="Business professionals reviewing purchase orders and contracts during handshake meeting" 
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
              Why Choose Purchase Order Financing?
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto" data-testid="benefits-description">
              Fulfill large orders without depleting your working capital
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center border-gray-200" data-testid="benefit-growth">
              <CardContent className="p-6">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-secondary mb-2">Accelerated Growth</h3>
                <p className="text-gray-700 text-sm">Accept larger orders and grow your business beyond current capital limits</p>
              </CardContent>
            </Card>

            <Card className="text-center border-gray-200" data-testid="benefit-cash-flow">
              <CardContent className="p-6">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-secondary mb-2">Preserve Cash Flow</h3>
                <p className="text-gray-700 text-sm">Keep your working capital for operations while we fund your suppliers</p>
              </CardContent>
            </Card>

            <Card className="text-center border-gray-200" data-testid="benefit-opportunities">
              <CardContent className="p-6">
                <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-secondary mb-2">Seize Opportunities</h3>
                <p className="text-gray-700 text-sm">Never miss a big order due to insufficient capital</p>
              </CardContent>
            </Card>

            <Card className="text-center border-gray-200" data-testid="benefit-supplier">
              <CardContent className="p-6">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-secondary mb-2">Supplier Relations</h3>
                <p className="text-gray-700 text-sm">Pay suppliers promptly and potentially negotiate better terms</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How PO Financing Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-secondary mb-4" data-testid="how-it-works-title">
              How Purchase Order Financing Works
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto" data-testid="how-it-works-description">
              A straightforward process to fund your large orders
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <Card className="text-center border-gray-200" data-testid="step-1">
              <CardContent className="p-4">
                <div className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold">
                  1
                </div>
                <h3 className="text-base font-semibold text-secondary mb-2">Receive Large Order</h3>
                <p className="text-gray-700 text-xs">Customer places a substantial purchase order with you</p>
              </CardContent>
            </Card>

            <Card className="text-center border-gray-200" data-testid="step-2">
              <CardContent className="p-4">
                <div className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold">
                  2
                </div>
                <h3 className="text-base font-semibold text-secondary mb-2">Apply for PO Financing</h3>
                <p className="text-gray-700 text-xs">Submit the purchase order and customer information to us</p>
              </CardContent>
            </Card>

            <Card className="text-center border-gray-200" data-testid="step-3">
              <CardContent className="p-4">
                <div className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold">
                  3
                </div>
                <h3 className="text-base font-semibold text-secondary mb-2">We Fund Suppliers</h3>
                <p className="text-gray-700 text-xs">We pay your suppliers directly for the goods/services needed</p>
              </CardContent>
            </Card>

            <Card className="text-center border-gray-200" data-testid="step-4">
              <CardContent className="p-4">
                <div className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold">
                  4
                </div>
                <h3 className="text-base font-semibold text-secondary mb-2">Deliver to Customer</h3>
                <p className="text-gray-700 text-xs">Complete the order and deliver goods/services to your customer</p>
              </CardContent>
            </Card>

            <Card className="text-center border-gray-200" data-testid="step-5">
              <CardContent className="p-4">
                <div className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold">
                  5
                </div>
                <h3 className="text-base font-semibold text-secondary mb-2">Customer Pays</h3>
                <p className="text-gray-700 text-xs">Customer pays, we collect our advance plus fees, you keep the profit</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Ideal Scenarios */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-secondary mb-4" data-testid="scenarios-title">
              Ideal Scenarios for PO Financing
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-gray-200" data-testid="scenario-large-orders">
              <CardContent className="p-6">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-secondary mb-3">Large Single Orders</h3>
                <p className="text-gray-700 text-sm">Orders that exceed your current working capital capacity</p>
              </CardContent>
            </Card>

            <Card className="border-gray-200" data-testid="scenario-new-customers">
              <CardContent className="p-6">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-secondary mb-3">New Large Customers</h3>
                <p className="text-gray-700 text-sm">Orders from creditworthy customers you want to do business with</p>
              </CardContent>
            </Card>

            <Card className="border-gray-200" data-testid="scenario-government">
              <CardContent className="p-6">
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-secondary mb-3">Government Contracts</h3>
                <p className="text-gray-700 text-sm">Large government or municipal purchase orders</p>
              </CardContent>
            </Card>

            <Card className="border-gray-200" data-testid="scenario-seasonal">
              <CardContent className="p-6">
                <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-secondary mb-3">Seasonal Orders</h3>
                <p className="text-gray-700 text-sm">Large seasonal orders that require upfront inventory investment</p>
              </CardContent>
            </Card>

            <Card className="border-gray-200" data-testid="scenario-distributor">
              <CardContent className="p-6">
                <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-secondary mb-3">Distributor Orders</h3>
                <p className="text-gray-700 text-sm">Large wholesale or distributor purchase orders</p>
              </CardContent>
            </Card>

            <Card className="border-gray-200" data-testid="scenario-export">
              <CardContent className="p-6">
                <div className="bg-teal-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-secondary mb-3">Export Orders</h3>
                <p className="text-gray-700 text-sm">International orders requiring upfront supplier payments</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features & Requirements */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <Card className="border-gray-200 h-full" data-testid="financing-features">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-secondary mb-6">PO Financing Features</h3>
                  <div className="space-y-4">
                    {[
                      "Finance 80-100% of purchase order value",
                      "Terms typically 30-180 days",
                      "Minimum order sizes usually $50,000+",
                      "Direct payment to your suppliers",
                      "Can be combined with factoring",
                      "No monthly payments until order completion"
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
                  <h3 className="text-xl font-semibold text-secondary mb-6">Requirements</h3>
                  <div className="space-y-4">
                    {[
                      "Creditworthy end customer with good payment history",
                      "Established relationship with reliable suppliers",
                      "Clear purchase order with defined terms",
                      "Gross profit margin of 20% or higher",
                      "Ability to fulfill the order completely",
                      "No pre-existing liens on the purchase order"
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
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-secondary mb-4" data-testid="industries-title">
              Industries We Serve
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto" data-testid="industries-description">
              PO financing works across many industries and business models
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              "Manufacturing",
              "Wholesale Distribution",
              "Import/Export",
              "Government Contractors",
              "Technology Resellers",
              "Apparel & Fashion",
              "Consumer Products",
              "Industrial Equipment",
              "Electronics",
              "Food & Beverage",
              "Construction Supplies",
              "And Many More"
            ].map((industry, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 text-center border border-gray-200" data-testid={`industry-${index}`}>
                <span className="text-sm font-medium text-gray-700">{industry}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6" data-testid="cta-title">
            Turn Big Orders Into Big Opportunities
          </h2>
          <p className="text-lg mb-8 text-purple-100 max-w-2xl mx-auto" data-testid="cta-description">
            Don't let large orders slip away due to cash flow constraints. Get the financing you need to fulfill big orders and grow your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild data-testid="button-apply-now">
              <a href={APPLY_URL}>
                Apply Now
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild data-testid="button-discuss-order">
              <a href="mailto:Info@boreal.financial" className="border-white text-white hover:bg-white hover:text-purple-600">
                Discuss Your Order
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
