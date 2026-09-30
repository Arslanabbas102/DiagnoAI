import PropTypes from "prop-types";
import Chart from "react-apexcharts";

// eslint-disable-next-line no-unused-vars
export function StatisticsChart({ color, chart, title, description, footer }) {
  return (
    <div className="card flex flex-col">
      <div className="p-5 pb-0">
        <h3 className="text-[16px] font-semibold text-ink">{title}</h3>
        <p className="mt-0.5 text-sm text-muted">{description}</p>
      </div>
      <div className="px-2 pt-2">
        <Chart {...chart} />
      </div>
      {footer && (
        <div className="mt-auto border-t border-line px-5 py-3.5 text-sm">
          {footer}
        </div>
      )}
    </div>
  );
}

StatisticsChart.defaultProps = {
  color: "blue",
  footer: null,
};

StatisticsChart.propTypes = {
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
  chart: PropTypes.object.isRequired,
  title: PropTypes.node.isRequired,
  description: PropTypes.node.isRequired,
  footer: PropTypes.node,
};

StatisticsChart.displayName = "/src/widgets/charts/statistics-chart.jsx";

export default StatisticsChart;
