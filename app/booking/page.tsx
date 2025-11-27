import type { Metadata } from "next";
import { BookingForm } from "@/components/forms/bookingForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, MapPin, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Book Now | One Detail At A Time - San Antonio Auto Detailing",
  description: "Schedule your auto detailing appointment in San Antonio, TX. Mobile service available throughout San Antonio. Book online or call (726) 207-1007.",
};

export default function BookingPage() {
  return (
    <div className="flex flex-col">
      <section className="py-12 lg:py-20 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container">
          <div className="flex flex-col items-center text-center space-y-4 mb-12">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Book Your Service
            </h1>
            <p className="max-w-[700px] text-lg text-muted-foreground">
              Schedule your appointment online. We'll confirm your booking within 2 hours.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Schedule an Appointment</CardTitle>
                  <CardDescription>
                    Fill out the form below to book your auto detailing service
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <BookingForm />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>What to Expect</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium">Confirmation</p>
                      <p className="text-sm text-muted-foreground">
                        We'll confirm your booking within 2 hours
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium">Detailing Service</p>
                      <p className="text-sm text-muted-foreground">
                        You will drop your vehicle at our designated location in San Antonio, TX
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium">Professional Work</p>
                      <p className="text-sm text-muted-foreground">
                        IDA certified detailers with quality products
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium">Satisfaction Guaranteed</p>
                      <p className="text-sm text-muted-foreground">
                        100% satisfaction or we'll make it right
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Service Areas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="text-sm">Stone Oak</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="text-sm">Alamo Heights</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="text-sm">North Side</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="text-sm">Medical Center</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="text-sm">All San Antonio Areas</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-primary text-primary-foreground">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Phone className="h-6 w-6" />
                    <div>
                      <p className="font-semibold">Prefer to call?</p>
                      <p className="text-sm text-primary-foreground/90">
                        We're here to help
                      </p>
                    </div>
                  </div>
                  <a 
                    href="tel:7262071007"
                    className="text-lg font-bold hover:underline"
                  >
                    (726) 207-1007
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}