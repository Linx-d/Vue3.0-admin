const online = {
  title: {
      text: '统计',
      subtext: '信息',
      left: 'center'
  },
  tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)'
  },
  legend: {
      orient: 'vertical',
      left: 'left',
      data: ['体温异常', '总人数', '在线人数', '低电量人数']//['手环脱落', '总人数', '设备故障', '体温异常', '在线人数']
  },
  series: [
      {
          name: '访问来源',
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data: [
            //   {value: 335, name: '手环脱落'},
              {value: 310, name: '体温异常'},
            //   {value: 234, name: '设备故障'},
              {value: 135, name: '总人数'},
              {value: 1548, name: '在线人数'},
              {value: 1548, name: '低电量人数'}
          ],
          emphasis: {
              itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
          }
      }
  ]
};

export default online;