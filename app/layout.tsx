import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "One Detail At A Time | IDA Certified Auto Detailing San Antonio, TX",
    template: "%s | One Detail At A Time"
  },
  description: "IDA certified auto detailing in San Antonio, TX. Expert car care, paint protection, interior cleaning, and mobile detailing services. Serving Stone Oak, Alamo Heights, North Side and all SA areas.",
  keywords: ["auto detailing", "carwash", "car detailing", "San Antonio", "IDA certified", "mobile detailing", "paint correction", "ceramic coating", "interior detailing", "Stone Oak", "Alamo Heights"],
  authors: [{ name: "One Detail At A Time LLC" }],
  creator: "One Detail At A Time",
  publisher: "One Detail At A Time",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "One Detail At A Time | IDA Certified Auto Detailing San Antonio",
    description: "Premium auto detailing services in San Antonio, TX. Expert car care with mobile service throughout all SA areas.",
    url: "https://1detailatatime.com",
    siteName: "One Detail At A Time",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "verification_token",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <Navigation />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}