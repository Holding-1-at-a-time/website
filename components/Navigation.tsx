"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, Phone, X } from "lucide-react";

const routes = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
  { name: "Book Now", href: "/booking", highlight: true },
];

export function Navigation() {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-primary">One Detail</span>
          <span className="hidden text-xl font-semibold sm:inline-block">
            At A Time
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {routes.map((route) => (
            route.highlight ? (
              <Button key={route.href} asChild>
                <Link href={route.href}>{route.name}</Link>
              </Button>
            ) : (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === route.href
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {route.name}
              </Link>
            )
          ))}
          <Button variant="outline" size="sm" asChild>
            <Link href="tel:7262071007">
              <Phone className="mr-2 h-4 w-4" />
              Call
            </Link>
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t">
          <nav className="container py-4 flex flex-col space-y-4">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  route.highlight && "text-primary font-semibold",
                  pathname === route.href
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {route.name}
              </Link>
            ))}
            <Button variant="outline" size="sm" asChild className="w-fit">
              <Link href="tel:7262071007">
                <Phone className="mr-2 h-4 w-4" />
                (726) 207-1007
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}