export default function Header() {
  return (
    <header className="flex items-center justify-between px-5 py-4 border-b border-line">
      <span className="font-display font-semibold text-lg md:text-xl text-ink">
        Sai Madhu
      </span>

      {/* Desktop nav */}
      <nav className="flex items-center gap-6 font-body text-sm text-ink-soft">
        <a href="#story" className="hover:text-ink transition-colors">
          Story
        </a>
        <a href="#ingredients" className="hover:text-ink transition-colors">
          Ingredients
        </a>
        {/* <a href="#order" className="hover:text-ink transition-colors">
          Order
        </a>
        <a
          href="/track"
          className="text-forest font-medium hover:text-forest-deep transition-colors"
        >
          Track your order
        </a> */}
      </nav>

      {/* Mobile: just the track link, everything else lives on the page itself */}
      {/* <a
        href="/track"
        className="md:hidden font-body text-sm text-forest font-medium"
      >
        Track order
      </a> */}
    </header>
  );
}
