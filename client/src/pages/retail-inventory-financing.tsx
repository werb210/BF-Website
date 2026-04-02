import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, ShoppingCart, TrendingUp, DollarSign, Clock } from "lucide-react";
import { Seo } from "@/components/SEO";
import { financialServiceJsonLd } from "@/lib/structured-data";
import { SeoImage } from "@/components/SeoImage";
import { APPLY_URL } from "@/config/links";

export default function RetailInventoryFinancing() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Seo title="Retail Inventory Financing | Boreal Financial" description="Retail inventory financing that helps businesses stock products, preserve cash flow, and scale sales." canonical="https://borealfinancial.ca/retail-inventory-financing" jsonLd={financialServiceJsonLd("Retail Inventory Financing", "Finance inventory purchases and seasonal stock planning.", "/retail-inventory-financing")} />
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 to-white py-16 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-secondary leading-tight" data-testid="page-title">
                Retail Inventory Financing Takes Your Business to the Next Level
              </h1>
              <p className="text-lg text-gray-700 leading-relaxed" data-testid="page-description">
                We know how difficult it is for small and medium-sized retailers to access adequate retail inventory financing. The challenges that face your industry have also influenced inventory financing lenders, many of whom have fled to safer ground.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed" data-testid="challenge-description">
                Traditional lenders, such as banks, are often unwilling to provide a loan against retail inventory if the need is less than $10 million. That's where Boreal Financial steps in to fill the gap.
              </p>
            </div>
            
            <div>
              <SeoImage 
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=800" 
                alt="Modern retail store with organized inventory and professional credit card transaction" 
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
              Why Choose Retail Inventory Financing?
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto" data-testid="benefits-description">
              Optimize your inventory levels and maximize sales opportunities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center border-gray-200" data-testid="benefit-seasonal">
              <CardContent className="p-6">
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-secondary mb-2">Seasonal Purchasing</h3>
                <p className="text-gray-700 text-sm">Stock up for peak seasons without depleting your cash reserves</p>
              </CardContent>
            </Card>

            <Card className="text-center border-gray-200" data-testid="benefit-growth">
              <CardContent className="p-6">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-secondary mb-2">Business Growth</h3>
                <p className="text-gray-700 text-sm">Expand your product lines and take advantage of bulk purchasing discounts</p>
              </CardContent>
            </Card>

            <Card className="text-center border-gray-200" data-testid="benefit-cash-flow">
              <CardContent className="p-6">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-secondary mb-2">Preserve Cash Flow</h3>
                <p className="text-gray-700 text-sm">Keep working capital available for operations while financing inventory</p>
              </CardContent>
            </Card>

            <Card className="text-center border-gray-200" data-testid="benefit-opportunities">
              <CardContent className="p-6">
                <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-secondary mb-2">Seize Opportunities</h3>
                <p className="text-gray-700 text-sm">Quick access to funding for time-sensitive purchasing opportunities</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Challenges & Solutions */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <Card className="border-red-200 bg-red-50 h-full" data-testid="challenges-card">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-secondary mb-4">Industry Challenges</h3>
                  <div className="space-y-4 text-gray-700">
                    <p>• Banks require minimum loan amounts of $10+ million</p>
                    <p>• Traditional lenders don't understand retail inventory cycles</p>
                    <p>• Seasonal cash flow fluctuations create financing gaps</p>
                    <p>• Limited working capital restricts growth opportunities</p>
                    <p>• Inventory turnover varies significantly by product category</p>
                    <p>• Economic uncertainty makes lenders risk-averse</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="border-green-200 bg-green-50 h-full" data-testid="solutions-card">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-secondary mb-4">Our Solutions</h3>
                  <div className="space-y-4">
                    {[
                      "Flexible loan amounts from $50K to $5M",
                      "Understanding of retail inventory cycles",
                      "Seasonal payment structures available",
                      "Quick approval process (24-48 hours)",
                      "Asset-based lending on inventory value",
                      "Customized terms for your business model"
                    ].map((solution, index) => (
                      <div key={index} className="flex items-start space-x-3" data-testid={`solution-${index}`}>
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{solution}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-secondary mb-4" data-testid="how-it-works-title">
              How Retail Inventory Financing Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <Card className="text-center border-gray-200" data-testid="step-1">
              <CardContent className="p-6">
                <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  1
                </div>
                <h3 className="text-lg font-semibold text-secondary mb-3">Inventory Assessment</h3>
                <p className="text-gray-700 text-sm">We evaluate your current inventory and purchasing needs</p>
              </CardContent>
            </Card>

            <Card className="text-center border-gray-200" data-testid="step-2">
              <CardContent className="p-6">
                <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  2
                </div>
                <h3 className="text-lg font-semibold text-secondary mb-3">Financing Structure</h3>
                <p className="text-gray-700 text-sm">Custom financing solution based on your inventory turnover</p>
              </CardContent>
            </Card>

            <Card className="text-center border-gray-200" data-testid="step-3">
              <CardContent className="p-6">
                <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  3
                </div>
                <h3 className="text-lg font-semibold text-secondary mb-3">Quick Approval</h3>
                <p className="text-gray-700 text-sm">Fast approval process designed for retail businesses</p>
              </CardContent>
            </Card>

            <Card className="text-center border-gray-200" data-testid="step-4">
              <CardContent className="p-6">
                <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  4
                </div>
                <h3 className="text-lg font-semibold text-secondary mb-3">Purchase & Repay</h3>
                <p className="text-gray-700 text-sm">Purchase inventory and repay as you sell through your stock</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Retail Sectors */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-secondary mb-4" data-testid="sectors-title">
              Retail Sectors We Serve
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto" data-testid="sectors-description">
              We provide inventory financing across diverse retail categories
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              "Fashion & Apparel",
              "Electronics & Tech",
              "Home & Garden",
              "Sporting Goods",
              "Toys & Games",
              "Automotive Parts",
              "Health & Beauty",
              "Furniture",
              "Jewelry & Accessories",
              "Books & Media",
              "Pet Supplies",
              "Specialty Retail"
            ].map((sector, index) => (
              <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 text-center" data-testid={`sector-${index}`}>
                <span className="text-sm font-medium text-gray-700">{sector}</span>
              </div>
            ))}
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
                      "Loan amounts from $50,000 to $5 million",
                      "Terms from 3 months to 3 years",
                      "Revolving credit lines available",
                      "Seasonal payment options",
                      "Advance rates up to 80% of inventory value",
                      "No personal guarantees on larger facilities"
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
                      "Established retail business (1+ years)",
                      "Annual sales of $500,000 or more",
                      "Marketable inventory with good turnover",
                      "Clean inventory aging reports",
                      "Strong business credit profile",
                      "Detailed inventory management system"
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

      {/* CTA Section */}
      <section className="py-16 bg-orange-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6" data-testid="cta-title">
            Stock Up for Success
          </h2>
          <p className="text-lg mb-8 text-orange-100 max-w-2xl mx-auto" data-testid="cta-description">
            Don't let inventory limitations hold back your retail business. Get the financing you need to stock your shelves and maximize sales opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild data-testid="button-apply-now">
              <a href={APPLY_URL}>
                Apply Now
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild data-testid="button-learn-more">
              <a href="mailto:Info@boreal.financial" className="border-white text-white hover:bg-white hover:text-orange-600">
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
