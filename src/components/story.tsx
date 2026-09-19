import Image from "next/image";

export default function Story() {
  return (
    <section className="bg-paper-alt px-5 py-10 md:py-16" id="story">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-10 items-start">
        <div className="w-full md:w-[200px] flex items-center justify-center flex-shrink-0 rounded-sm ">
          <Image alt="" src={"/flower.png"} width={200} height={200} />
        </div>
        <div className="max-w-[520px]">
          <h2 className="font-display font-medium text-ink text-[22px] md:text-[26px]">
            Every pack, ground by hand
          </h2>
          <p className="font-body text-ink-soft text-[15px] leading-relaxed mt-3">
            &ldquo;I dry the shikakai pods myself, grind them on a stone mill,
            and sieve every batch twice before it&apos;s packed. It takes days,
            not minutes — which is exactly why I only make a small batch at a
            time, and let you know the moment a new one opens.&rdquo;
          </p>
          <p className="font-body text-gold font-medium text-sm mt-3">
            — Sai Madhu
          </p>
        </div>
      </div>
    </section>
  );
}
