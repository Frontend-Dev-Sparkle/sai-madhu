export default function Hero() {
  return (
    <section className="flex flex-col md:flex-row items-center gap-8 px-5 py-10 md:py-16">
      <div className="flex-1 order-2 md:order-1">
        <h1 className="font-display font-medium text-ink text-[32px] md:text-[46px] leading-[1.12] max-w-[480px]">
          Shikakai, made the slow way.
        </h1>
        <p className="font-body text-ink-soft text-base leading-relaxed max-w-[420px] mt-4">
          One woman, one recipe, small batches ground by hand in Puducherry. No
          fillers, no chemicals — just what your grandmother would have used.
        </p>
        <a
          href="#order"
          className="inline-block mt-7 px-6 py-3 rounded-sm bg-forest text-paper font-body font-medium text-sm transition-transform active:scale-95"
        >
          Reserve your jar
        </a>
      </div>
      <div className="order-1 md:order-2 flex justify-center flex-1">
        {/* Swap for a real product photo once you have one */}
        <div className="w-[180px] h-[220px] md:w-[220px] md:h-[260px] rounded-md bg-forest/90 flex items-center justify-center">
          <span className="font-display text-paper text-sm">Sai Madhu</span>
        </div>
      </div>
    </section>
  );
}
