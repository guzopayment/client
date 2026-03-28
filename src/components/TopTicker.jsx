import "./TopTicker.css";

export default function TopTicker({
  items = [],
  bgClass = "bg-purple-600",
  textClass = "text-white",
}) {
  const safeItems = Array.isArray(items) ? items.flat().filter(Boolean) : [];
  const tickerText = safeItems.length ? safeItems.join("   •   ") : "Welcome";

  return (
    <div className={`top-ticker-sticky w-full max-w-full overflow-hidden ${bgClass} ${textClass} shadow-sm border-b border-white/10`}>
      <div className="top-ticker-viewport">
        <div className="top-ticker-track">
          <span className="top-ticker-text">{tickerText}</span>
          <span className="top-ticker-text" aria-hidden="true">{tickerText}</span>
        </div>
      </div>
    </div>
  );
}
