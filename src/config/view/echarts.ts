export const echarts = {
    multisigMapOption: {
        tooltip: {
            alwaysShowContent: true,
            padding: 0,
            position: 'right',
            formatter: (params: any, copyIcon) => {
                if (params.dataType == 'edge') {
                    return
                }
                const template = `<div class="tooltip" >
                                        <div>${params.data.address.address}</div>
                                    </div>`
                return template
            }
        },
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        series: [
            {
                left: 60,
                type: 'graph',
                layout: 'none',
                symbolSize: 70,
                roam: false,
                label: {
                    normal: {
                        show: true
                    }
                },
                edgeSymbol: ['none', 'arrow'],
                edgeSymbolSize: [4, 10],
                edgeLabel: {
                    normal: {
                        textStyle: {
                            fontSize: 20
                        }
                    }
                },
                data: [],
                links: [],
                lineStyle: {
                    normal: {
                        width: 2,
                        curveness: 0,
                        color: '#4DC2BF',
                        type: 'dotted'
                    }
                }
            }
        ]
    },

    votePieOption: {
        font: {},
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        color: ['#EC5447', '#F1C850'],
        series: [
            {
                name: 'vote',
                type: 'pie',
                data: [
                    { value: 100, name: 'A 335 25%' },
                    { value: 300, name: 'B 300 75%' },
                ],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    },
                    borderWidth: 2,
                    borderColor: '#fff',
                }
            }
        ]
    }
}
