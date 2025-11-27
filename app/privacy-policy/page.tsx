import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Shield, Eye, Lock, UserCheck } from "lucide-react";

export const metadata: Metadata = {
    title: "Privacy Policy | One Detail At A Time - Auto Detailing San Antonio",
    description: "Privacy Policy for One Detail At A Time auto detailing services in San Antonio, TX. Learn how we collect, use, and protect your personal information.",
    openGraph: {
        title: "Privacy Policy | One Detail At A Time",
        description: "Learn how we protect your privacy and personal information",
        type: "website",
        url: "https://1detailatatime.com/privacy-policy",
    },
    alternates: {
        canonical: "https://1detailatatime.com/privacy-policy",
    },
};

export default function PrivacyPolicyPage() {
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
                        <h1 className="text-lg font-semibold">Privacy Policy</h1>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container py-12 max-w-4xl mx-auto">
                <div className="space-y-8">
                    {/* Introduction */}
                    <section className="text-center space-y-4">
                        <Shield className="h-12 w-12 text-primary mx-auto" />
                        <h2 className="text-3xl font-bold tracking-tighter">
                            Privacy Policy
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            At One Detail At A Time, we respect your privacy and are committed to protecting your personal information. 
                            This policy explains how we collect, use, and safeguard your data.
                        </p>
                        <p className="text-sm text-muted-foreground">
                            <strong>Last Updated:</strong> November 27, 2025
                        </p>
                    </section>

                    {/* Privacy Features */}
                    <section className="grid gap-6 md:grid-cols-3">
                        <div className="text-center space-y-3 p-6 rounded-lg border bg-card">
                            <Lock className="h-8 w-8 text-primary mx-auto" />
                            <h3 className="font-semibold">Data Protection</h3>
                            <p className="text-sm text-muted-foreground">
                                We use industry-standard security measures to protect your personal information.
                            </p>
                        </div>
                        <div className="text-center space-y-3 p-6 rounded-lg border bg-card">
                            <Eye className="h-8 w-8 text-primary mx-auto" />
                            <h3 className="font-semibold">Transparency</h3>
                            <p className="text-sm text-muted-foreground">
                                Clear information about what data we collect and how we use it.
                            </p>
                        </div>
                        <div className="text-center space-y-3 p-6 rounded-lg border bg-card">
                            <UserCheck className="h-8 w-8 text-primary mx-auto" />
                            <h3 className="font-semibold">Your Rights</h3>
                            <p className="text-sm text-muted-foreground">
                                You have control over your personal information and how it's used.
                            </p>
                        </div>
                    </section>

                    {/* Privacy Policy Content */}
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold tracking-tight">1. Information We Collect</h2>
                            
                            <h3 className="text-xl font-semibold">Personal Information</h3>
                            <p>
                                We collect personal information that you voluntarily provide to us, including:
                            </p>
                            <ul>
                                <li><strong>Contact Information:</strong> Name, email address, phone number</li>
                                <li><strong>Service Information:</strong> Vehicle details, service preferences, scheduling preferences</li>
                                <li><strong>Communication Records:</strong> Messages, emails, and call logs related to our services</li>
                                <li><strong>Payment Information:</strong> Payment method details (processed securely by third-party payment processors)</li>
                            </ul>

                            <h3 className="text-xl font-semibold">Automatically Collected Information</h3>
                            <p>
                                When you visit our website, we may automatically collect certain information:
                            </p>
                            <ul>
                                <li><strong>Device Information:</strong> Browser type, operating system, device identifiers</li>
                                <li><strong>Usage Data:</strong> Pages visited, time spent on site, referring websites</li>
                                <li><strong>Location Data:</strong> General geographic location based on IP address</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold tracking-tight">2. How We Use Your Information</h2>
                            
                            <p>We use your personal information for the following purposes:</p>
                            
                            <h3 className="text-xl font-semibold">Service Delivery</h3>
                            <ul>
                                <li>Scheduling and providing auto detailing services</li>
                                <li>Communicating about appointments and service details</li>
                                <li>Processing payments and managing billing</li>
                                <li>Providing customer support and follow-up services</li>
                            </ul>

                            <h3 className="text-xl font-semibold">Website Improvement</h3>
                            <ul>
                                <li>Analyzing website usage and improving user experience</li>
                                <li>Optimizing our services based on customer feedback</li>
                                <li>Maintaining website security and preventing fraud</li>
                            </ul>

                            <h3 className="text-xl font-semibold">Marketing Communications</h3>
                            <ul>
                                <li>Sending promotional offers and service announcements (with your consent)</li>
                                <li>Sharing local San Antonio auto detailing tips and news</li>
                                <li>Following up on completed services to ensure satisfaction</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold tracking-tight">3. Information Sharing and Disclosure</h2>
                            
                            <p>
                                We do not sell, trade, or rent your personal information to third parties. 
                                We may share your information only in the following circumstances:
                            </p>

                            <h3 className="text-xl font-semibold">Service Providers</h3>
                            <p>
                                We work with trusted third-party service providers who assist us in:
                            </p>
                            <ul>
                                <li>Payment processing (secure payment gateways)</li>
                                <li>Website hosting and maintenance</li>
                                <li>Email and communication services</li>
                                <li>Analytics and website optimization</li>
                            </ul>

                            <h3 className="text-xl font-semibold">Legal Requirements</h3>
                            <p>
                                We may disclose your information when required by law or to:
                            </p>
                            <ul>
                                <li>Comply with legal processes or government requests</li>
                                <li>Protect our rights, property, or safety</li>
                                <li>Prevent fraud or unauthorized use of our services</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold tracking-tight">4. Data Security</h2>
                            
                            <p>
                                We implement appropriate technical and organizational security measures to protect your personal information:
                            </p>
                            
                            <ul>
                                <li><strong>Encryption:</strong> Data transmission is protected using SSL/TLS encryption</li>
                                <li><strong>Access Controls:</strong> Limited access to personal information on a need-to-know basis</li>
                                <li><strong>Regular Updates:</strong> Security systems are regularly updated and monitored</li>
                                <li><strong>Secure Storage:</strong> Data is stored securely with reputable cloud service providers</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold tracking-tight">5. Your Rights and Choices</h2>
                            
                            <p>You have the following rights regarding your personal information:</p>

                            <h3 className="text-xl font-semibold">Access and Correction</h3>
                            <p>
                                You may request access to or correction of your personal information by contacting us at 
                                <strong> (726) 207-1007</strong> or <strong> rromerojr1@gmail.com</strong>.
                            </p>

                            <h3 className="text-xl font-semibold">Data Deletion</h3>
                            <p>
                                You may request deletion of your personal information, subject to legal and business retention requirements.
                            </p>

                            <h3 className="text-xl font-semibold">Marketing Communications</h3>
                            <p>
                                You may opt out of marketing communications at any time by:
                            </p>
                            <ul>
                                <li>Following unsubscribe instructions in our emails</li>
                                <li>Contacting us directly to request removal from marketing lists</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold tracking-tight">6. Cookies and Tracking Technologies</h2>
                            
                            <p>
                                Our website uses cookies and similar tracking technologies to enhance your browsing experience:
                            </p>
                            
                            <ul>
                                <li><strong>Essential Cookies:</strong> Required for basic website functionality</li>
                                <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our website</li>
                                <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                            </ul>

                            <p>
                                You can control cookie preferences through your browser settings. However, 
                                disabling certain cookies may affect website functionality.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold tracking-tight">7. Contact Information</h2>
                            
                            <p>
                                If you have questions about this privacy policy or our privacy practices, please contact us:
                            </p>
                            
                            <div className="bg-muted p-6 rounded-lg">
                                <h3 className="font-semibold mb-2">One Detail At A Time</h3>
                                <p>
                                    <strong>Address:</strong> 11692 Bricken Circle, San Antonio, TX 78233<br />
                                    <strong>Phone:</strong> (726) 207-1007<br />
                                    <strong>Email:</strong> rromerojr1@gmail.com
                                </p>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold tracking-tight">8. Updates to This Policy</h2>
                            
                            <p>
                                We may update this privacy policy from time to time to reflect changes in our practices 
                                or for legal compliance. We will notify you of any material changes by:
                            </p>
                            <ul>
                                <li>Posting the updated policy on our website</li>
                                <li>Updating the "Last Updated" date at the top of this policy</li>
                                <li>Providing notice through our communication channels when appropriate</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold tracking-tight">9. Compliance with Local Laws</h2>
                            
                            <p>
                                This privacy policy complies with applicable privacy laws, including:
                            </p>
                            <ul>
                                <li><strong>California Consumer Privacy Act (CCPA)</strong> - For California residents</li>
                                <li><strong>General Data Protection Regulation (GDPR)</strong> - For EU residents</li>
                                <li><strong>Texas state privacy laws</strong> - For residents of Texas</li>
                            </ul>
                        </section>
                    </div>

                    {/* Call to Action */}
                    <section className="text-center space-y-4 pt-8 border-t">
                        <h3 className="text-xl font-semibold">Questions About Your Privacy?</h3>
                        <p className="text-muted-foreground">
                            We're here to help. Contact us anytime with privacy questions or concerns.
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