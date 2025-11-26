"use client";

import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Card, CardContent } from "@/components/ui/card";
import { reviews } from "@/lib/data";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";


export function ReviewCarousel() {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        align: "center",
        skipSnaps: false,
    });
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    const scrollPrev = React.useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = React.useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    const onSelect = React.useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    React.useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on("select", onSelect);
        emblaApi.on("reInit", onSelect);
    }, [emblaApi, onSelect]);

    return (
        <div className="relative">
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex gap-4">
                    {reviews.map((review, index) => {
                        const isActive = index === selectedIndex;
                        const offset = index - selectedIndex;

                        return (
                            <div
                                key={review.id}
                                className={cn(
                                    "flex-[0_0_100%] min-w-0 md:flex-[0_0_85%] lg:flex-[0_0_70%] transition-all duration-500",
                                    "perspective-1000"
                                )}
                                style={{
                                    transform: `
                    scale(${isActive ? 1 : 0.85})
                    translateZ(${isActive ? '0px' : '-100px'})
                    rotateY(${offset * -5}deg)
                  `,
                                    opacity: isActive ? 1 : 0.6,
                                    transformStyle: "preserve-3d",
                                }}
                            >
                                <Card className={cn(
                                    "h-full transition-all duration-500",
                                    isActive && "shadow-2xl border-primary/50"
                                )}>
                                    <CardContent className="p-8">
                                        <div className="flex flex-col space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="font-semibold text-lg">{review.name}</h3>
                                                    <p className="text-sm text-muted-foreground">{review.service}</p>
                                                </div>
                                                <div className="flex">
                                                    {Array.from({ length: review.rating }).map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className="w-5 h-5 fill-primary text-primary"
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-muted-foreground leading-relaxed">
                                                "{review.comment}"
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(review.date).toLocaleDateString('en-US', {
                                                    month: 'long',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="flex justify-center items-center gap-4 mt-8">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={scrollPrev}
                    className="rounded-full"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex gap-2">
                    {reviews.map((_, index) => (
                        <button
                            key={index}
                            className={cn(
                                "w-2 h-2 rounded-full transition-all",
                                index === selectedIndex
                                    ? "w-8 bg-primary"
                                    : "bg-muted-foreground/30"
                            )}
                            onClick={() => emblaApi?.scrollTo(index)}
                        />
                    ))}
                </div>

                <Button
                    variant="outline"
                    size="icon"
                    onClick={scrollNext}
                    className="rounded-full"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}