"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const testimonials = [
  {
    quote:
      "Hello. Received the parcel. Used it today. It's an awesome product... Thank you so much.",
    name: "Priya R.",
    location: "Chennai",
  },
  {
    quote: "Tq mam product was so..good💝",
    name: "Meena K.",
    location: "Bengaluru",
  },
  {
    quote:
      "I really appreciate the small-batch approach. The product feels thoughtfully made rather than mass produced.",
    name: "Arun S.",
    location: "Coimbatore",
  },
  {
    quote:
      "Very simple to use and it fits perfectly into my weekly hair-care routine. I'll definitely be ordering another jar.",
    name: "Divya M.",
    location: "Madurai",
  },
];

export default function Testimonials() {
  const [active, setActive] = useState(0);

  const next = () => {
    setActive((current) => (current + 1) % testimonials.length);
  };

  const previous = () => {
    setActive(
      (current) => (current - 1 + testimonials.length) % testimonials.length,
    );
  };

  const testimonial = testimonials[active];

  return (
    <section className="bg-paper-alt px-5 py-14 md:py-20">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-9 md:mb-11">
          <p
            className="font-semibold tracking-[0.16em] uppercase  mb-3
          font-body text-ink-soft text-xs mt-0.5"
          >
            From the people who tried it
          </p>
          <h2 className="font-display font-medium text-ink text-[22px] md:text-[26px]">
            Kind words, naturally.
          </h2>
        </div>

        {/* Testimonial */}
        <div className="relative border border-line rounded-lg bg-paper px-7 py-9 md:px-12 md:py-12">
          {/* Quote mark */}
          <div
            aria-hidden="true"
            className="font-display text-forest text-5xl md:text-6xl leading-none mb-3 opacity-70"
          >
            “
          </div>

          <blockquote className="font-display text-ink text-[23px] md:text-[30px] leading-[1.35] max-w-2xl">
            {testimonial.quote}
          </blockquote>
          <div
            aria-hidden="true"
            className="font-display text-forest text-5xl md:text-6xl text-right leading-none mt-3 opacity-70"
          >
            ”
          </div>
          <div className="mt-7 flex items-center justify-between gap-5">
            <div>
              <p className="font-body font-semibold text-sm text-ink">
                {testimonial.name}
              </p>

              <p className="font-body text-xs text-ink-soft mt-1">
                {testimonial.location}
              </p>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={previous}
                aria-label="Previous testimonial"
                className="w-9 h-9 rounded-full border border-line flex items-center justify-center text-ink hover:bg-paper-alt transition-colors"
              >
                <ChevronLeft />
              </button>

              <button
                type="button"
                onClick={next}
                aria-label="Next testimonial"
                className="w-9 h-9 rounded-full border border-line flex items-center justify-center text-ink hover:bg-paper-alt transition-colors"
              >
                <ChevronRight />
              </button>
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 mt-6">
          {testimonials.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Go to testimonial ${index + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === active ? "w-7 bg-forest" : "w-1.5 bg-line"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
