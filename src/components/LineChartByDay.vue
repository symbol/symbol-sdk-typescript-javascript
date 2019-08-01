<template>
  <div class="line_chart_container">
    <Spin size="large" class="absolute" fix v-if="spinShow"></Spin>
    <div class="line" id="id" ref="dom"></div>
  </div>

</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import echarts from 'echarts';
    import {formatDate} from '../utils/util.js'
    import axios from 'axios'
    import {localSave, localRead, isRefreshData, addZero} from '@/utils/util'

    @Component
    export default class LineChart extends Vue {
        dom: any = {};
        spinShow = true
        option = {
            legend: {
                data: ['xem', 'btc', 'amount'],
                show: true,
                x: 'right',
                y: '-5px'
            },
            axisPointer: {
                link: {xAxisIndex: 'all'},
                label: {
                    backgroundColor: '#777'
                }
            },
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'white',

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
                    const template = `<div>
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
                //0降雨
                {
                    height: '55%',
                    y: '15%',
                    width: '88%'
                },
                //1水位流量
                {
                    width: '88%',
                    height: '20%',
                    y: '70%'
                }
            ],


            xAxis: [
                {
                    show: false,//隐藏了x轴
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
                            date = (date.getMonth() + 1) + '-' + (date.getDate()) + (date.getHours()) + ':' + (date.getMinutes())
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
                            date = addZero(date.getHours()) + ':' + addZero(date.getMinutes())
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
                            color: 'rgba(238,238,238,1)'
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
                            color: 'rgba(238,238,238,1)'
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
                // show: true,
                xAxisIndex: [0, 1],
                // y: '90%',
                // width:'100%',
            },

            series: [
                // xem
                {
                    xAxisIndex: 0,//对应前面x的索引位置（第二个）
                    yAxisIndex: 0,//对应前面y的索引位置（第一个）
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
                    smooth: true,
                    xAxisIndex: 0,//对应前面x的索引位置（第二个）
                    yAxisIndex: 0,//对应前面y的索引位置（第一个）
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
                // todo
                {
                    xAxisIndex: 1,//对应前面x的索引位置（第二个）
                    yAxisIndex: 1,//对应前面y的索引位置（第一个）
                    name: 'amount',
                    type: 'bar',
                    color: ['#20B5AC'],
                    data: [],
                },
            ],
        };
        xemDataList = []
        btcDataList = []
        xemMin = 0

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
            const min = (low - (open - low) ).toFixed(3)

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

            window.onresize = this.dom.resize
        }

        async getBtcChartData() {
            const that = this
            //btc
            const btcUrl = this.$store.state.app.marketUrl + '/kline/btcusdt/15min/96'
            await axios.get(btcUrl).then(function (response) {
                let dataList = []
                response.data.data.forEach((item, index) => {
                    index % 4 == 0 ? dataList.push(item) : dataList;
                })

                that.btcDataList = dataList
                let marketPriceDataByDayObject = localRead('marketPriceDataByDayObject') ? JSON.parse(localRead('marketPriceDataByDayObject')) : {}
                marketPriceDataByDayObject.btc = {
                    dataList: dataList,
                }
                marketPriceDataByDayObject.timestamp = new Date().getTime()
                localSave('marketPriceDataByDayObject', JSON.stringify(marketPriceDataByDayObject))

            }).catch(function (error) {
                console.log(error);
                that.getBtcChartData()
            });

        }

        async getXemChartData() {
            const that = this
            //60min/168
            const url = this.$store.state.app.marketUrl + '/kline/xemusdt/15min/96'
            await axios.get(url).then(function (response) {
                let dataList = []
                response.data.data.forEach((item, index) => {
                    index % 4 == 0 ? dataList.push(item) : dataList;
                })

                that.xemDataList = dataList


                let marketPriceDataByDayObject = localRead('marketPriceDataByDayObject') ? JSON.parse(localRead('marketPriceDataByDayObject')) : {}
                marketPriceDataByDayObject.xem = {
                    dataList: dataList,
                    timestamp: new Date().getTime()
                }
                marketPriceDataByDayObject.timestamp = new Date().getTime()
                localSave('marketPriceDataByDayObject', JSON.stringify(marketPriceDataByDayObject))

            }).catch(function (error) {
                console.log(error);
                that.getXemChartData()
            });
            this.refresh()
        }

        getChartData() {
            this.getXemChartData()
            this.getBtcChartData()
        }

        async refreshData() {
            if (isRefreshData('marketPriceDataByDayObject', 1000 * 60 * 60, new Date().getMinutes())) {
                await this.getChartData()
            } else {
                this.btcDataList = (JSON.parse(localRead('marketPriceDataByDayObject'))).btc.dataList
                this.xemDataList = (JSON.parse(localRead('marketPriceDataByDayObject'))).xem.dataList
            }
        }

        async created() {
            await this.refreshData()
        }
    }
</script>
<style scoped lang="less">
  .line_chart_container {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .line {
    width: calc(100% - 60px);
    height: 400px;
    position: absolute;
    top: 20px;
    left: 30px;
  }

</style>
