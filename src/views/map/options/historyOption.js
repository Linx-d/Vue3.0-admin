const history = {
  title: {
    text: "告警总数",
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: 'cross',
      label: {
          backgroundColor: '#6a7985'
      }
  }
  },
  legend: {
    data: ["告警总数"]
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true,
  },
  toolbox: {
    feature: {
      // saveAsImage: {},
    },
  },
  xAxis: {
    type: "category",
    boundaryGap: false,
    data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      name: "告警总数",
      type: "line",
      stack: "start",
      data: [120, 132, 101, 134, 90, 230, 210],
    }
  ],
};

export default history;
