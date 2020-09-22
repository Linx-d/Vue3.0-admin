const temperature = {
    title: {
        text: '温度统计',
        subtext: '信息',
        left: 'left'
    },
    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    legend: {
        orient: 'vertical',
        left: 'center',
        data: ['温度异常人数', '温度正常人数']
    },
    series: [{
        name: '访问来源',
        type: 'pie',
        radius: '55%',
        center: ['50%', '60%'],
        data: [{
                value: 0,
                name: '温度正常人数'
            },
            {
                value: 0,
                name: '温度异常人数'
            }
        ],
        emphasis: {
            itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
        }
    }]
};

export default temperature;