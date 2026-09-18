import { Leaf } from "lucide-react";

const INGREDIENTS = [
  {
    name: "Shikakai pods",
    note: "sun-dried, stone-ground — the base of every batch",
  },
  { name: "Amla", note: "adds shine, slows premature greying" },
  { name: "Reetha", note: "gentle, natural cleansing agent" },
  { name: "Hibiscus leaf", note: "strengthens from root to tip" },
  { name: "Curry leaf", note: "traditional scalp tonic" },
];

export default function Ingredients() {
  return (
    <section className="px-5 py-10 md:py-16">
      <div className="max-w-2xl mx-auto">
        <h2 className="font-display font-medium text-ink text-[22px] md:text-[26px]">
          What&apos;s inside
        </h2>
        <div className="mt-6">
          {INGREDIENTS.map((item, i) => (
            <div
              key={item.name}
              className={`flex items-start gap-3 py-4 border-b border-line ${i === 0 ? "border-t" : ""}`}
            >
              <Leaf size={18} className="text-forest mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-body font-medium text-ink text-[15px]">
                  {item.name}
                </div>
                <div className="font-body text-ink-soft text-sm mt-0.5">
                  {item.note}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
