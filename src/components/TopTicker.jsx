import "./TopTicker.css";

export default function TopTicker({
  items = [],
  bgClass = "bg-purple-600",
  textClass = "text-white",
}) {
  const safeItems = Array.isArray(items) ? items.filter(Boolean) : [];
  const tickerText = safeItems.length ? safeItems.join("   •   ") : "Welcome";

  return (
    <div
      className={`w-full overflow-hidden ${bgClass} ${textClass} shadow-sm border-b border-white/10`}
    >
      <div className="top-ticker-track flex whitespace-nowrap min-w-max">
        <span className="inline-block px-6 py-2 text-xs md:text-sm font-semibold">
          {tickerText}
        </span>
        <span
          className="inline-block px-6 py-2 text-xs md:text-sm font-semibold"
          aria-hidden="true"
        >
          {tickerText}
        </span>
      </div>
    </div>
  );
}
