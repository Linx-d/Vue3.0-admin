const device = {
  title: {
      text: '围栏人数',
      subtext: '统计'
  },
  tooltip: {
      trigger: 'axis',
      axisPointer: {
          type: 'shadow'
      }
  },
  legend: {
      data: ['总人数', '温度异常人数']
  },
  grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
  },
  xAxis: {
      type: 'value',
      boundaryGap: [0, 0.01]
  },
  yAxis: {
      type: 'category',
      data: ["围栏1", "围栏2", "围栏3", "围栏4", "围栏5"]
  },
  series: [
      {
          name: '总人数',
          type: 'bar',
          data: [13, 219, 234, 100, 134]
      },
      {
          name: '温度异常人数',
          type: 'bar',
          data: [9, 210, 135, 55, 88]
      }
  ]
};

export default device;
