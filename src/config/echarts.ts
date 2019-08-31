export const echartsConfigure = {
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
    }
}
