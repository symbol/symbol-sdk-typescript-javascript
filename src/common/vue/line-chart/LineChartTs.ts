import echarts from 'echarts'
import {market} from "@/core/api/logicApi"
import {KlineQuery} from "@/core/query/klineQuery"
import {Component, Vue} from 'vue-property-decorator'
import {localSave, localRead, isRefreshData, formatDate} from '@/core/utils/utils'

@Component
export  class LineChartTs extends Vue {
    xemMin = 0
    dom: any = {}
    spinShow = true
    xemDataList = []
    btcDataList = []
    // TODO put option in configure.ts
    option = {
        legend: [
            {
                data: ['xem', 'btc', 'amount'],
                show: true,
                x: 'right',
                y: '-5px'
            }
        ],
        axisPointer: {
            link: {xAxisIndex: 'all'},
            label: {
                backgroundColor: '#777'
            }
        },
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'white',
            alwaysShowContent: true,
            padding: 0,
            formatter: (params: any) => {
                let currentParam = {}
                params.forEach((item: any) => {
                    if (item.seriesName == 'xem') {
                        currentParam = item
                    }
                })

                params = currentParam
                const {dataIndex, value} = params
                let riseRange: any = 0
                if (dataIndex !== 0) {
                    const preData = this.option.series[0].data[dataIndex - 1]
                    riseRange = ((value - preData) / preData).toFixed(3)
                }
                const date = formatDate(params.name)
                const template = `<div style="box-shadow: 0 0 5px #e0e0e0; padding: 5px">
                                    <div style="color: #999;">${date}</div>
                                    <div style="display: flex;justify-content: center;justify-items: center">
                                      <span style="color: #666666;margin-right: 5px">$${value}</span>
                                      <span style="float:right;color: #20B5AC">${riseRange}%</span>
                                    </div>
                                    </div>`
                return template
            }
        },
        grid: [
            {
                height: '55%',
                y: '10%',
                width: '89%'
            },
            {
                width: '89%',
                height: '20%',
                y: '65%'
            }
        ],


        xAxis: [
            {
                show: false,//hide x axis
                gridIndex: 0,
                type: 'category',
                data: [],
                boundaryGap: false,
                axisLine: {
                    lineStyle: {
                        color: '#ccc'
                    }
                },
                axisLabel: {
                    color: "#999",
                    interval: 6,
                    formatter(timestamp) {
                        let date: any = new Date(Number(timestamp))
                        date = (date.getMonth() + 1) + '-' + (date.getDate())
                        return date
                    }
                },
            }, {
                gridIndex: 1,
                type: 'category',
                data: [],
                boundaryGap: false,
                axisLine: {
                    lineStyle: {
                        color: '#ccc'
                    }
                },
                axisLabel: {
                    color: "#999",
                    interval: 6,
                    formatter(timestamp) {
                        let date: any = new Date(Number(timestamp))
                        date = (date.getMonth() + 1) + '-' + (date.getDate())
                        return date
                    }
                },
            },
        ],

        yAxis: [
            {
                gridIndex: 0,
                type: 'value',
                scale: true,
                axisLine: {
                    lineStyle: {
                        color: '#ccc'
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: 'rgba(238,238,238,.5)'
                    }
                },
                axisLabel: {
                    color: "#999",
                },
                splitNumber: 4,
                min: '0'
            },
            {
                gridIndex: 1,
                type: 'value',
                scale: true,
                axisLine: {
                    lineStyle: {
                        color: '#ccc'
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: 'rgba(238,238,238,.5)'
                    }
                },
                axisLabel: {
                    show: false,
                    color: "#999",
                },
                splitNumber: 4,
                min: '0'
            },
        ],
        dataZoom: {
            type: "inside",
            xAxisIndex: [0, 1],
        },

        series: [
            // xem
            {
                xAxisIndex: 0,
                yAxisIndex: 0,
                name: 'xem',
                data: [],
                type: 'line',
                symbol: 'circle',
                smooth: true,
                symbolSize: function (parmas) {
                    return 7;
                },
                showSymbol: false,
                itemStyle: {
                    normal: {
                        color: '#20B5AC',
                        lineStyle: {
                            color: '#20B5AC',
                            width: 2
                        },
                    }
                },
                markPoint: {
                    normal: {
                        color: 'black',
                    },
                    data: []
                }
            },
            // btc
            {
                animation: true,
                animationEasing: 'linear',
                smooth: true,
                xAxisIndex: 0,
                yAxisIndex: 0,
                name: 'btc',
                data: [],
                type: 'line',
                symbol: 'circle',
                // smooth: true,
                symbolSize: function (parmas) {
                    return 7;
                },
                showSymbol: false,
                itemStyle: {
                    normal: {
                        // color: 'transparent',
                        color: '#f7a800',
                        lineStyle: {
                            color: '#f7a800',
                            width: 2
                        },
                    }
                },
                markPoint: {
                    normal: {
                        color: 'black',
                    },
                    data: []
                }
            },
            {
                xAxisIndex: 1,
                yAxisIndex: 1,
                name: 'amount',
                type: 'bar',
                color: ['#20B5AC'],
                data: [],
            },
        ],
    };


    mounted() {
        this.refresh()
    }


    refresh() {
        this.refreshXem()
        this.refreshBtc()
    }

    refreshXem() {
        this.dom = echarts.init(this.$refs.dom);
        let {xemDataList, btcDataList} = this
        let xAxisData = []

        if (xemDataList.length == 0) {
            return
        }
        this.spinShow = false
        xemDataList.sort((a, b) => {
            return a.open > b.open ? 1 : -1
        })
        const low = xemDataList[0].open
        const open = xemDataList[xemDataList.length - 1].open
        const min = (low - (open - low) / 10).toFixed(3)

        xemDataList.sort((a, b) => {
            return a.id > b.id ? 1 : -1
        })

        let amountList = []
        xemDataList = xemDataList.map(item => {
            let i: any = {}
            xAxisData.push(item.id * 1000)
            amountList.push(item.amount)
            return item.open
        })

        this.xemMin = low
        this.option.series[0].data = xemDataList
        this.option.xAxis[0].data = xAxisData
        this.option.yAxis[0].min = min
        this.option.series[2].data = amountList
        this.option.xAxis[1].data = xAxisData
        this.dom.setOption(this.option)
        window.onresize = this.dom.resize
    }

    refreshBtc() {
        this.dom = echarts.init(this.$refs.dom);
        let {xemDataList, btcDataList, xemMin} = this
        let xAxisData = []

        if (btcDataList.length == 0) {
            return
        }
        this.spinShow = false
        btcDataList.sort((a, b) => {
            return a.open > b.open ? 1 : -1
        })
        const low = btcDataList[0].open
        const open = btcDataList[btcDataList.length - 1].open

        btcDataList.sort((a, b) => {
            return a.id > b.id ? 1 : -1
        })

        const rate: any = xemMin > low ? xemMin / low : low / xemMin
        btcDataList = btcDataList.map(item => {
            let i: any = {}
            xAxisData.push(item.id * 1000)
            // console.log(item.open)
            item.open = item.open / rate.toFixed(0)
            return item.open
        })
        this.option.series[1].data = btcDataList


        this.dom.setOption(this.option)
        this.dom.dispatchAction({
            type: 'showTip',
            seriesIndex: 0,
            dataIndex: btcDataList.length - 1,

        })
        window.onresize = this.dom.resize
    }

    async setCharData(coin: string, period: string, size: string) {
        const that = this
        const rstStr = await market.kline({period: period, symbol: coin + "usdt", size: size});
        const rstQuery: KlineQuery = JSON.parse(rstStr.rst);
        let dataList = []
        rstQuery.data.forEach((item, index) => {
            index % 4 == 0 ? dataList.push(item) : dataList;
        })
        let marketPriceDataObject = localRead('marketPriceDataObject') ? JSON.parse(localRead('marketPriceDataObject')) : {}
        marketPriceDataObject.timestamp = new Date().getTime()
        if (coin == 'xem') {
            that.xemDataList = dataList
            marketPriceDataObject.xem = {
                dataList: dataList
            }
        }
        if (coin == 'btc') {
            that.btcDataList = dataList
            marketPriceDataObject.btc = {
                dataList: dataList
            }
        }

        marketPriceDataObject.timestamp = new Date().getTime()
        localSave('marketPriceDataObject', JSON.stringify(marketPriceDataObject))
        this.refresh()
    }


    async getChartData() {
        await this.setCharData("xem", "60min", "168");
        await this.setCharData("btc", "60min", "168");
        this.refresh()
    }

    async refreshData() {
        try {
            if (isRefreshData('marketPriceDataObject', 1000 * 60 * 15, new Date().getMinutes())) {
                await this.getChartData()
                return
            }
            this.btcDataList = (JSON.parse(localRead('marketPriceDataObject'))).btc.dataList
            this.xemDataList = (JSON.parse(localRead('marketPriceDataObject'))).xem.dataList
        } catch (e) {
            console.log('refresh')
            await this.getChartData()
        }
    }

    mouseoutLine() {
        this.dom.dispatchAction({
            type: 'showTip',
            seriesIndex: 0,
            dataIndex: this.option.series[1].data.length - 1,
        })
    }

    async created() {
        await this.refreshData()
    }
}
