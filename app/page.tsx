import Link from "next/link";
import { Button } from "@/components/ui/button";
import { services } from "@/lib/data";
import { ArrowRight, CheckCircle, Phone, Star } from "lucide-react";
import { cn } from "@/lib/utils";



/**
 * HomePage component
 *
 * Primary entry point of the application
 *
 * Contains hero, services, reviews, and cta sections
 */
export default function HomePage() {
  const primaryServices = services.filter(s => s.category === 'primary').slice(0, 6);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
        <div className="container relative z-10">
          <div className="flex flex-col items-center text-center space-y-8">
            <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm">
              <Star className="w-4 h-4 fill-primary text-primary mr-2" />
              <span>IDA Certified • Licensed & Insured</span>
            </div>

            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Premium Auto Detailing
              <span className="block text-primary mt-2">in San Antonio, TX</span>
            </h1>

                          <p className="max-w-[700px] text-lg text-muted-foreground sm:text-xl">
                          Expert detailing services at our studio for Stone Oak, Alamo Heights, North Side, and all San Antonio areas.
                          Transform your vehicle with IDA certified professionals.
                        </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="text-lg">
                <Link href="/booking">
                  Book Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg">
                <Link href="tel:7262071007">
                  <Phone className="mr-2 h-5 w-5" />
                  (726) 207-1007
                </Link>
              </Button>
            </div>

            <div className="flex items-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span>Valet Service</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span>Same-Day Available</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span>Free Quotes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <div className="flex flex-col items-center text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Our Services
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-lg">
              Professional auto detailing services tailored to your vehicle's needs
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {primaryServices.map((service) => (
              <Card key={service.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{service.name}</CardTitle>
                  <CardDescription>Starting at {service.price}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-4">
                    {service.features.slice(0, 3).map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/services/${service.slug}`}>
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-center mt-12">
            <Button asChild size="lg">
              <Link href="/services">
                View All Services
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-20">
        <div className="container">
          <div className="flex flex-col items-center text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              What Our Customers Say
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-lg">
              Real reviews from satisfied San Antonio customers
            </p>
          </div>
          <ReviewCarousel />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container">
          <div className="flex flex-col items-center text-center space-y-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Ready to Transform Your Vehicle?
            </h2>
            <p className="max-w-[700px] text-lg text-primary-foreground/90">
              Get a free quote today and experience the difference of IDA certified detailing
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/booking">
                  Schedule Service
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-primary bg-primary-foreground" asChild>
                <Link href="/contact">
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/**
 * A component that renders a carousel of customer reviews.
 *
 * @returns {JSX.Element} A JSX element containing a carousel of customer reviews.
 */
function ReviewCarousel() {
  const reviews = [
    {
      name: "John D.",
      rating: 5,
      content: "The interior detailing service was amazing! My car looks brand new again. Highly recommend!",
      date: "May 15, 2023"
    },
    {
      name: "Sarah M.",
      rating: 5,
      content: "The ceramic coating service exceeded my expectations. My car has never looked better!",
      date: "April 28, 2023"
    },
    {
      name: "Michael T.",
      rating: 5,
      content: "The paint correction service was perfect. My car looks like it just rolled off the lot!",
      date: "March 10, 2023"
    }
  ];

  return (
    <div className="relative">
      <Carousel className="w-full max-w-3xl mx-auto">
        <CarouselContent>
          {reviews.map((review, index) => (
            <CarouselItem key={index}>
              <Card className="h-full">
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-5 w-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <p className="text-lg italic mb-4">"{review.content}"</p>
                  <p className="font-semibold">{review.name}</p>
                  <p className="text-sm text-gray-500">{review.date}</p>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}

/**
 * Card component
 *
 * A rounded card component with a border and shadow
 *
 * @param {React.ComponentProps<"div">} props - Props to pass to the component
 * @returns {JSX.Element} - The card component
 */
function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)} {...props} />
  );
}

/**
 * A card header component
 *
 * A card header component that displays a heading and possible other elements
/**
 * A card title component
 *
 * A card title component that displays a heading in a card.
 * It is a h3 element with font size of 2xl, font weight of
 * semi-bold, leading of none, and letter spacing of normal.
 *
 * @param {React.ComponentProps<"div">} props - Props to pass to the component
 * @returns {JSX.Element} - The card title component


 * in a card. It is a flex container with column direction, and has
 * space between elements.
 *
 * @param {React.ComponentProps<"div">} props - Props to pass to the component
 * @returns {JSX.Element} - The card header component
 */

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <h3 className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
  );
}
function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)} {...props} />
  );
}
function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("p-6 pt-0", className)} {...props} />
  );
}
function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex items-center p-6 pt-0", className)} {...props} />
  );
}
function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex items-center p-6 pt-0", className)} {...props} />
  );
}
function Carousel({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("relative", className)} {...props} />
  );
}
function CarouselContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("overflow-hidden", className)} {...props} />
  );
}
function CarouselItem({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex-[0_0_100%] min-w-0", className)} {...props} />
  );
}
function CarouselPrevious({ className, ...props }: React.ComponentProps<"button">) {
  return (
    <button className={cn("absolute left-0 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-md", className)} {...props}>
      <ArrowRight className="h-5 w-5 rotate-180" />
    </button>
  );
}
function CarouselNext({ className, ...props }: React.ComponentProps<"button">) {
  return (
    <button className={cn("absolute right-0 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-md", className)} {...props}>
      <ArrowRight className="h-5 w-5" />
    </button>
  );
}
