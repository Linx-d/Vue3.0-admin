const system = {
  title: {
      text: '疫情统计',
      subtext: '统计'
  },
  tooltip: {
      trigger: 'axis'
  },
  legend: {
      data: ['隔离用户', '解除隔离']
  },
  toolbox: {
      show: true,
      feature: {
      }
  },
  calculable: true,
  xAxis: [
      {
          type: 'category',
          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
      }
  ],
  yAxis: [
      {
          type: 'value'
      }
  ],
  series: [
      {
          name: '隔离用户',
          type: 'bar',
          data: [20, 49, 70, 232, 256, 767, 1356, 1622, 326, 200, 64, 33],
          markPoint: {
              data: [
                  {type: 'max', name: '最大值'},
                  {type: 'min', name: '最小值'}
              ]
          },
          markLine: {
              data: [
                  {type: 'average', name: '平均值'}
              ]
          }
      },
      {
          name: '解除隔离',
          type: 'bar',
          data: [26, 59, 90, 264, 287, 707, 1756, 1822, 487, 188, 60, 23],
          markPoint: {
              data: [
                  {name: '年最高', value: 1822, xAxis: 7, yAxis: 183},
                  {name: '年最低', value: 23, xAxis: 11, yAxis: 3}
              ]
          },
          markLine: {
              data: [
                  {type: 'average', name: '平均值'}
              ]
          }
      }
  ]
};
export default system;