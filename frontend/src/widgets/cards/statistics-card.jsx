import PropTypes from "prop-types";

const tileTone = {
  green: "bg-accent-50 text-accent-600 ring-accent-100",
  teal: "bg-accent-50 text-accent-600 ring-accent-100",
  red: "bg-red-50 text-red-600 ring-red-100",
  orange: "bg-amber-50 text-amber-600 ring-amber-100",
  amber: "bg-amber-50 text-amber-600 ring-amber-100",
  purple: "bg-violet-50 text-violet-600 ring-violet-100",
};

export function StatisticsCard({ color, icon, title, value, footer }) {
  const tone = tileTone[color] || "bg-brand-50 text-brand-600 ring-brand-100";
  return (
    <div className="card flex flex-col">
      <div className="flex items-start justify-between gap-4 p-5">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted">{title}</p>
          <p className="mt-2 font-display text-[28px] font-bold leading-none tracking-tight text-ink">
            {value}
          </p>
        </div>
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset ${tone}`}
        >
          {icon}
        </span>
      </div>
      {footer && (
        <div className="mt-auto border-t border-line px-5 py-3.5 text-sm">
          {footer}
        </div>
      )}
    </div>
  );
}

StatisticsCard.defaultProps = {
  color: "blue",
  footer: null,
};

StatisticsCard.propTypes = {
  color: PropTypes.oneOf([
    "white",
    "blue-gray",
    "gray",
    "brown",
    "deep-orange",
    "orange",
    "amber",
    "yellow",
    "lime",
    "light-green",
    "green",
    "teal",
    "cyan",
    "light-blue",
    "blue",
    "indigo",
    "deep-purple",
    "purple",
    "pink",
    "red",
  ]),
  icon: PropTypes.node.isRequired,
  title: PropTypes.node.isRequired,
  value: PropTypes.node.isRequired,
  footer: PropTypes.node,
};

StatisticsCard.displayName = "/src/widgets/cards/statistics-card.jsx";

export default StatisticsCard;
