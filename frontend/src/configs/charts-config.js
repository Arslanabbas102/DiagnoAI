export const chartsConfig = {
  chart: {
    toolbar: {
      show: false,
    },
    fontFamily: "Inter, system-ui, sans-serif",
    foreColor: "#5B6475",
  },
  title: {
    show: "",
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    axisTicks: {
      show: false,
    },
    axisBorder: {
      show: false,
    },
    labels: {
      style: {
        colors: "#5B6475",
        fontSize: "12px",
        fontFamily: "inherit",
        fontWeight: 500,
      },
    },
  },
  yaxis: {
    labels: {
      style: {
        colors: "#5B6475",
        fontSize: "12px",
        fontFamily: "inherit",
        fontWeight: 500,
      },
    },
  },
  grid: {
    show: true,
    borderColor: "#E6E9F0",
    strokeDashArray: 4,
    xaxis: {
      lines: {
        show: false,
      },
    },
    padding: {
      top: 5,
      right: 20,
    },
  },
  fill: {
    opacity: 1,
  },
  colors: ["#2A4BDB"],
  tooltip: {
    theme: "light",
  },
};

export default chartsConfig;
