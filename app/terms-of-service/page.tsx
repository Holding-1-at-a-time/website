import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, FileText, Shield, CheckCircle, AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
    title: "Terms of Service | One Detail At A Time - Auto Detailing San Antonio",
    description: "Terms of Service for One Detail At A Time auto detailing services in San Antonio, TX. Review our service terms and conditions.",
    openGraph: {
        title: "Terms of Service | One Detail At A Time",
        description: "Review our terms and conditions for auto detailing services",
        type: "website",
        url: "https://1detailatatime.com/terms-of-service",
    },
    alternates: {
        canonical: "https://1detailatatime.com/terms-of-service",
    },
};

export default function TermsOfServicePage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b bg-muted/50">
                <div className="container py-4">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" asChild>
                            <Link href="/">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Home
                            </Link>
                        </Button>
                        <div className="h-4 w-px bg-border" />
                        <h1 className="text-lg font-semibold">Terms of Service</h1>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container py-12 max-w-4xl mx-auto">
                <div className="space-y-8">
                    {/* Introduction */}
                    <section className="text-center space-y-4">
                        <FileText className="h-12 w-12 text-primary mx-auto" />
                        <h2 className="text-3xl font-bold tracking-tighter">
                            Terms of Service
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            These terms and conditions govern your use of our auto detailing services and website. 
                            Please read them carefully before using our services.
                        </p>
                        <p className="text-sm text-muted-foreground">
                            <strong>Last Updated:</strong> November 27, 2025
                        </p>
                    </section>

                    {/* Service Features */}
                    <section className="grid gap-6 md:grid-cols-2">
                        <div className="text-center space-y-3 p-6 rounded-lg border bg-card">
                            <Shield className="h-8 w-8 text-primary mx-auto" />
                            <h3 className="font-semibold">Professional Service</h3>
                            <p className="text-sm text-muted-foreground">
                                IDA certified professionals with comprehensive insurance coverage.
                            </p>
                        </div>
                        <div className="text-center space-y-3 p-6 rounded-lg border bg-card">
                            <CheckCircle className="h-8 w-8 text-primary mx-auto" />
                            <h3 className="font-semibold">Quality Guarantee</h3>
                            <p className="text-sm text-muted-foreground">
                                100% satisfaction guarantee on all our auto detailing services.
                            </p>
                        </div>
                    </section>

                    {/* Terms Content */}
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold tracking-tight">1. Acceptance of Terms</h2>
                            <p>
                                By accessing and using One Detail At A Time's services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold tracking-tight">2. Service Description</h2>
                            
                            <h3 className="text-xl font-semibold">Auto Detailing Services</h3>
                            <p>
                                One Detail At A Time provides professional auto detailing services including, but not limited to:
                            </p>
                            <ul>
                                <li>Full interior and exterior detailing</li>
                                <li>Paint correction and ceramic coating</li>
                                <li>Engine detailing</li>
                                <li>Headlight restoration</li>
                                <li>Steam cleaning services</li>
                                <li>Wheel and tire detailing</li>
                            </ul>

                            <h3 className="text-xl font-semibold">Service Areas</h3>
                            <p>
                                We serve San Antonio, TX and surrounding areas including Stone Oak, Alamo Heights, North Side, Medical Center, Downtown, Terrell Hills, Encino Park, Castle Hills, Hollywood Park, Windcrest, and Live Oak.
                            </p>

                            <h3 className="text-xl font-semibold">Valet Service</h3>
                            <p>
                                We offer optional valet service for an additional $50 fee. This includes pickup and delivery of your vehicle at any location specified by you.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold tracking-tight">3. Booking and Payment Terms</h2>
                            
                            <h3 className="text-xl font-semibold">Booking Process</h3>
                            <ul>
                                <li>Appointments can be scheduled through our website, phone, or email</li>
                                <li>Same-day service available when slots are open</li>
                                <li>24-hour advance booking recommended for full detailing services</li>
                                <li>Confirmation required before service begins</li>
                            </ul>

                            <h3 className="text-xl font-semibold">Payment Terms</h3>
                            <ul>
                                <li>Payment due upon completion of service</li>
                                <li>Accepted payment methods: Cash, Credit Cards, Debit Cards</li>
                                <li>Valet service fee ($50) due at pickup</li>
                                <li>All prices subject to change without notice</li>
                                <li>Quotes valid for 30 days from date of estimate</li>
                            </ul>

                            <h3 className="text-xl font-semibold">Cancellation Policy</h3>
                            <ul>
                                <li>24-hour cancellation notice required</li>
                                <li>Late cancellations may be subject to scheduling fees</li>
                                <li>Emergency cancellations considered on case-by-case basis</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold tracking-tight">4. Service Standards and Guarantees</h2>
                            
                            <h3 className="text-xl font-semibold">Professional Standards</h3>
                            <ul>
                                <li>IDA (International Detailing Association) certified technicians</li>
                                <li>Licensed and insured for your protection</li>
                                <li>Professional-grade products and equipment</li>
                                <li>Quality control checks before service completion</li>
                            </ul>

                            <h3 className="text-xl font-semibold">Satisfaction Guarantee</h3>
                            <ul>
                                <li>100% satisfaction guarantee on all services</li>
                                <li>Free re-service within 7 days if not satisfied (terms apply)</li>
                                <li>Quality assurance inspection before final delivery</li>
                            </ul>

                            <h3 className="text-xl font-semibold">Damage Policy</h3>
                            <ul>
                                <li>Full insurance coverage for all vehicles in our care</li>
                                <li>Immediate reporting required for any concerns</li>
                                <li>Proper documentation and resolution process</li>
                                <li>Professional repair or compensation for damages caused by our negligence</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold tracking-tight">5. Customer Responsibilities</h2>
                            
                            <h3 className="text-xl font-semibold">Vehicle Condition</h3>
                            <ul>
                                <li>Inform us of any special conditions or concerns</li>
                                <li>Remove personal belongings from vehicle</li>
                                <li>Ensure vehicles are operable for valet service</li>
                                <li>Disclose any existing damage or defects</li>
                            </ul>

                            <h3 className="text-xl font-semibold">Service Access</h3>
                            <ul>
                                <li>Provide access to vehicle at scheduled time</li>
                                <li>Ensure authorized representative for pickup/delivery</li>
                                <li>Provide keys and any necessary access information</li>
                                <li>Sign-off on service completion before departure</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold tracking-tight">6. Limitation of Liability</h2>
                            
                            <div className="bg-muted p-6 rounded-lg">
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className="h-6 w-6 text-amber-500 flex-shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-semibold mb-2">Important Disclaimer</h4>
                                        <p className="text-sm">
                                            One Detail At A Time's liability is limited to the cost of our services. 
                                            We are not responsible for pre-existing conditions, normal wear and tear, 
                                            or issues unrelated to our detailing services.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <h3 className="text-xl font-semibold">Exclusions</h3>
                            <p>We are not liable for:</p>
                            <ul>
                                <li>Pre-existing damage or deterioration</li>
                                <li>Damage from natural causes (hail, sun, acid rain, etc.)</li>
                                <li>Electronic components affected by moisture</li>
                                <li>Issues arising from modifications made by third parties</li>
                                <li>Acts of God or force majeure events</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold tracking-tight">7. Website Usage Terms</h2>
                            
                            <h3 className="text-xl font-semibold">Permitted Use</h3>
                            <ul>
                                <li>Personal, non-commercial use of our website</li>
                                <li>Booking appointments and requesting quotes</li>
                                <li>Accessing service information and business details</li>
                                <li>Contacting us for customer service purposes</li>
                            </ul>

                            <h3 className="text-xl font-semibold">Prohibited Use</h3>
                            <ul>
                                <li>Automated scraping or data extraction</li>
                                <li>Attempts to breach website security</li>
                                <li>Use of website for illegal activities</li>
                                <li>Interference with website functionality</li>
                                <li>Copying or reproducing website content without permission</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold tracking-tight">8. Privacy and Data Protection</h2>
                            
                            <p>
                                Your privacy is important to us. Please review our{' '}
                                <Link href="/privacy-policy" className="text-primary hover:underline">
                                    Privacy Policy
                                </Link>{' '}
                                for detailed information about how we collect, use, and protect your personal information.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold tracking-tight">9. Business Hours and Availability</h2>
                            
                            <div className="bg-card p-6 rounded-lg border">
                                <h3 className="font-semibold mb-4">Operating Hours</h3>
                                <ul className="space-y-1">
                                    <li><strong>Monday:</strong> Closed</li>
                                    <li><strong>Tuesday - Sunday:</strong> 7:00 AM - 10:00 PM</li>
                                </ul>
                                <p className="text-sm text-muted-foreground mt-4">
                                    Same-day service available during operating hours. 
                                    Emergency or after-hours service available by appointment with additional fees.
                                </p>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold tracking-tight">10. Dispute Resolution</h2>
                            
                            <h3 className="text-xl font-semibold">Customer Service Resolution</h3>
                            <p>
                                We encourage you to contact us directly with any concerns:
                            </p>
                            <ul>
                                <li><strong>Phone:</strong> (726) 207-1007</li>
                                <li><strong>Email:</strong> rromerojr1@gmail.com</li>
                                <li><strong>Response Time:</strong> Within 24 hours during business days</li>
                            </ul>

                            <h3 className="text-xl font-semibold">Formal Disputes</h3>
                            <p>
                                Any disputes arising from these terms or our services will be resolved through 
                                good faith negotiation before pursuing legal action.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold tracking-tight">11. Modifications to Terms</h2>
                            
                            <p>
                                We reserve the right to modify these terms at any time. Changes will be effective 
                                immediately upon posting on our website. Continued use of our services after 
                                modifications constitutes acceptance of the updated terms.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold tracking-tight">12. Contact Information</h2>
                            
                            <div className="bg-muted p-6 rounded-lg">
                                <h3 className="font-semibold mb-2">One Detail At A Time LLC</h3>
                                <p>
                                    <strong>Business Address:</strong> 11692 Bricken Circle, San Antonio, TX 78233<br />
                                    <strong>Phone:</strong> (726) 207-1007<br />
                                    <strong>Email:</strong> rromerojr1@gmail.com<br />
                                    <strong>Service Areas:</strong> San Antonio, TX and surrounding areas
                                </p>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold tracking-tight">13. Governing Law</h2>
                            
                            <p>
                                These terms are governed by the laws of the State of Texas. 
                                Any legal proceedings will be conducted in San Antonio, Texas.
                            </p>
                        </section>
                    </div>

                    {/* Call to Action */}
                    <section className="text-center space-y-4 pt-8 border-t">
                        <h3 className="text-xl font-semibold">Questions About Our Terms?</h3>
                        <p className="text-muted-foreground">
                            Contact us if you have any questions about these terms or our services.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button asChild>
                                <Link href="/contact">Contact Us</Link>
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href="tel:7262071007">
                                    Call (726) 207-1007
                                </Link>
                            </Button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}