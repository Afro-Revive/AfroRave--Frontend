import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { getRoutePath } from "@/config/get-route-path";
import { AnimatePresence, motion } from "motion/react";
import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface AfroCarouselProps {
  items: {
    id: string;
    image: string;
    alt: string;
  }[];
  buttonText?: string;
  buttonLink?: string;
}

export function AfroCarousel({
  items,
  buttonText = "Find Tickets",
  buttonLink = getRoutePath('events'),
}: AfroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  // Auto-advance every 5 seconds
  useEffect(() => {
    const interval = setInterval(goToNext, 5000);
    return () => clearInterval(interval);
  }, [goToNext]);

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Crossfade images */}
      <AnimatePresence mode="sync">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <img
            src={items[currentIndex].image}
            alt={items[currentIndex].alt}
            className="w-full h-full object-cover object-center"
          />
        </motion.div>
      </AnimatePresence>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-dark-gray via-dark-gray/50 to-transparent" />

      {/* Prev arrow */}
      <button
        onClick={goToPrev}
        className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 z-20 text-white opacity-20 hover:opacity-80 transition-opacity"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>

      {/* Next arrow */}
      <button
        onClick={goToNext}
        className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 z-20 text-white opacity-20 hover:opacity-80 transition-opacity"
      >
        <ChevronRight className="w-8 h-8" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-38 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
        {items.map((item, index) => (
          <button
            key={item.id}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              "rounded-full transition-all duration-300",
              index === currentIndex
                ? "outline outline-2 outline-white size-5"
                : "bg-soft-gray size-2"
            )}
          />
        ))}
      </div>

      {/* CTA Button */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-24 z-[9999]">
        <Button
          asChild
          className="w-[196px] h-8 bg-light-silver text-black text-sm font-input-mono hover:bg-white"
        >
          <Link to={buttonLink}>{buttonText}</Link>
        </Button>
      </div>
    </section>
  );
}
