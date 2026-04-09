import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Lightbulb, Film, CheckCircle } from "lucide-react";
import { Seo } from "@/components/SEO";
import { financialServiceJsonLd } from "@/lib/structured-data";
import { SeoImage } from "@/components/SeoImage";
import { APPLY_URL } from "@/config/links";

export default function MediaFinancing() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Seo title="Media Financing | Boreal Financial" description="Media financing solutions designed for production timelines, receivables cycles, and project-based expenses." canonical="https://borealfinancial.ca/media-financing" jsonLd={financialServiceJsonLd("Media Financing", "Funding for media production, campaigns, and content operations.", "/media-financing")} />
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 to-white py-16 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <SeoImage 
              src="" 
              alt="Professional film production studio with cameras, lighting, and crew working" 
              className="mb-8 h-[500px] w-full rounded-xl object-cover object-center shadow-lg"
              data-testid="hero-image"
            />
            
            <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-4" data-testid="page-title">
              Media Financing
            </h1>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed" data-testid="page-subtitle">
              Founded for producers by producers, we've been on the front line of film production. Unlike a bank or traditional financier, we have the knowledge and expertise to structure flexible financing to solve any problem.
            </p>
          </div>

          <div className="text-center">
            <p className="text-lg text-gray-700 mb-8 max-w-4xl mx-auto" data-testid="company-description">
              Boreal Financial secures financing partner for projects, producers and media companies alike. We focus on senior-secured financing opportunities, collateralized with firm assets, such as pre-sales/receivables contracts, tax credits, minimum guarantees, and negative pick-ups. Our flexible financing options include bridge loans, film union deposits, working capital, and gap loans.
            </p>
            <p className="text-lg text-primary font-semibold" data-testid="value-proposition">
              If you are looking for speed, responsiveness and accountability, combined with deep experience in production, we can help build your dreams.
            </p>
          </div>
        </div>
      </section>

      {/* Challenge and Solution */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <Card className="border-red-200 bg-red-50" data-testid="challenge-card">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <AlertTriangle className="w-6 h-6 text-red-500 mr-3" />
                    <h3 className="text-xl font-semibold text-secondary">The Challenge</h3>
                  </div>
                  <h4 className="font-semibold text-secondary mb-3" data-testid="challenge-subtitle">
                    Your success or failure can hinge on obtaining fast financing.
                  </h4>
                  <p className="text-gray-700 leading-relaxed mb-4" data-testid="challenge-description">
                    The media finance landscape is historically fragmented, unreliable and difficult to access. In a rapidly changing media landscape, streamlined access to capital for projects, producers and companies can be extremely challenging. Many producers have created a patchwork of sources to cover their budget. Oftentimes, financiers don't fully understand the unique nature of the business, extending the time it will take to receive funds.
                  </p>
                  <p className="text-gray-700 leading-relaxed" data-testid="challenge-consequences">
                    And when a project doesn't reach completion, costs go even higher when the producer is forced to take it elsewhere. Too many times, a project won't be produced at all because as the costs due to delays grow, the project budget grows to a level that no longer makes the film a marketable project. Being knowledgeable about how you wish to use financing, having an experienced financing partner, and being buttoned up from the very beginning can make or break your project.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-green-200 bg-green-50" data-testid="solution-card">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Lightbulb className="w-6 h-6 text-green-500 mr-3" />
                    <h3 className="text-xl font-semibold text-secondary">The Solution</h3>
                  </div>
                  <h4 className="font-semibold text-secondary mb-3" data-testid="solution-subtitle">
                    We provide capital solutions to content creators, enabling artists to produce quality content on a timely basis.
                  </h4>
                  <p className="text-gray-700 leading-relaxed mb-4" data-testid="solution-description">
                    We secure senior-secured media lenders providing credit financing to film, television and new media projects. With credit financing for the film, television and new media projects, we provide loans, or an "advance", which is secured by defined and unencumbered collateral, such as pre-sales agreements (i.e. Minimum Guarantees), tax credits and tax rebates, negative pick-ups, etc.
                  </p>
                  <p className="text-gray-700 leading-relaxed" data-testid="solution-details">
                    We also provide bridge loans, corporate loans, and cash flow solutions to media projects, producers and companies alike. If you are in the development phase, we can assist with the structuring and guidance of the finance plan.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {/* Media production studio image */}
              <SeoImage 
                src="" 
                alt="TV production studio control room with multiple monitors and professional broadcasting equipment" 
                className="rounded-xl shadow-lg w-full h-auto"
                data-testid="studio-image-1"
              />

              <Card className="border-gray-200" data-testid="financing-solutions-card">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Film className="w-6 h-6 text-primary mr-3" />
                    <h3 className="text-lg font-semibold text-secondary">Our Media Financing Solutions</h3>
                  </div>
                  <div className="space-y-3">
                    {[
                      "Bridge loans for production",
                      "Film union deposits",
                      "Working capital financing",
                      "Gap loans for completion"
                    ].map((solution, index) => (
                      <div key={index} className="flex items-center space-x-3" data-testid={`financing-solution-${index}`}>
                        <Film className="w-4 h-4 text-primary" />
                        <span className="text-gray-700">{solution}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-blue-50 border-blue-200" data-testid="collateral-card">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-secondary mb-4">Collateral We Accept</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    {[
                      "Pre-sales agreements",
                      "Tax credits & rebates",
                      "Minimum guarantees",
                      "Negative pick-ups"
                    ].map((collateral, index) => (
                      <div key={index} className="flex items-center space-x-2" data-testid={`collateral-type-${index}`}>
                        <CheckCircle className="w-4 h-4 text-accent" />
                        <span>{collateral}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Details */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-lg text-gray-700 mb-6 max-w-4xl mx-auto" data-testid="capital-provision-info">
              When it comes to providing capital, we do so for projects that are in pre-production, production, post-production or completed, as long as there is sufficient unencumbered collateral available. Our end-to-end tech-enabled systems support every step of your experience while maintaining our personalized approach.
            </p>
            <p className="text-lg text-gray-700 mb-8 max-w-4xl mx-auto" data-testid="collateral-requirement">
              If your project financing opportunity has a significant element of unencumbered collateral (i.e. an asset without any lien or "charge"), Boreal Financial would be pleased to consider financing your project.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center border-gray-200" data-testid="feature-expertise">
              <CardContent className="p-6">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-secondary mb-2">Industry Expertise</h3>
                <p className="text-gray-700 text-sm">Founded by producers who understand the unique challenges of media financing</p>
              </CardContent>
            </Card>

            <Card className="text-center border-gray-200" data-testid="feature-flexibility">
              <CardContent className="p-6">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-secondary mb-2">Flexible Solutions</h3>
                <p className="text-gray-700 text-sm">Customizable financing structures to meet your specific project needs</p>
              </CardContent>
            </Card>

            <Card className="text-center border-gray-200" data-testid="feature-speed">
              <CardContent className="p-6">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-secondary mb-2">Speed & Reliability</h3>
                <p className="text-gray-700 text-sm">Fast decisions and reliable funding when your project needs it most</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-secondary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6" data-testid="cta-title">
            Let's Make Your Project Awesome
          </h2>
          <p className="text-lg mb-8 text-gray-300 max-w-2xl mx-auto" data-testid="cta-description">
            Ready to bring your vision to life? Apply for media financing and get the capital you need to make your project a success.
          </p>
          <Button size="lg" asChild data-testid="button-apply-media-financing">
            <a href={APPLY_URL}>
              Apply Now
            </a>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
