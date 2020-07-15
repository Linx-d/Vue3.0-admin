const history = {
  title: {
    text: "告警历史统计",
  },
  tooltip: {
    trigger: "axis",
  },
  legend: {
    data: ["告警总数", "总人数", "位置告警", "温度告警"]
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true,
  },
  toolbox: {
    feature: {
      saveAsImage: {},
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
    },
    {
      name: "总人数",
      type: "line",
      stack: "middle",
      data: [220, 282, 201, 234, 290, 430, 410],
    },
    {
      name: "位置告警",
      type: "line",
      stack: "end",
      data: [450, 432, 401, 454, 590, 530, 510],
    },
    {
      name: "温度告警",
      type: "line",
      stack: "start",
      data: [450, 432, 401, 454, 590, 530, 510],
    },
  ],
};

export default history;
