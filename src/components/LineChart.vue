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
    import {localSave, localRead, isRefreshData} from '@/utils/util'

    @Component
    export default class LineChart extends Vue {
        dom: any = {};
        spinShow = true
        option = {
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'white',
                formatter: (params: any) => {
                    params = params[0]
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
            xAxis: [{
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
            }],
            yAxis: [{
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
            }],
            series: [{
                data: [],
                type: 'line',
                symbol: 'circle',
                symbolSize: function (parmas) {
                    return 7;
                },
                showSymbol: false,
                areaStyle: {
                    normal:{
                        color:{
                            type: 'linear',
                            x: 0,
                            y: 1,
                            x2: 0,
                            y2: 0,
                            colorStops: [{
                                offset: 0, color: '#fff' // 0% 处的颜色
                            }, {
                                offset: 0.2, color: '#fff' // 20% 处的颜色
                            }, {
                                offset: 0.8, color: '#fce8e1' // 80% 处的颜色
                            }, {
                                offset: 1, color: '#fce8e1' // 100% 处的颜色
                            }],
                        }
                    }
                },
                itemStyle: {
                    normal: {
                        // color: 'transparent',
                        color: '#ED8359',
                        lineStyle: {
                            color: '#ED8359',
                            width: 2
                        },
                        areaStyle: {
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [{
                                    offset: 0, color: 'rgba(32,181,172,0.5)'
                                }, {
                                    offset: 0.5, color: 'rgba(32,181,172,0.3)'
                                }, {
                                    offset: 1, color: 'rgba(32,181,172,0.1)'
                                }],
                                global: false
                            }
                        }
                    }
                },
                markPoint: {
                    normal: {
                        color: 'black',
                    },
                    data: []
                }
            }],
            grid: {
                x: 40,
                y: 10,
                x2: 0,
                y2: 20,
                right:0
            }
        };
        dataList = []

        mounted() {
            this.refresh()
        }

        refresh() {
            this.dom = echarts.init(this.$refs.dom);
            let {dataList} = this
            let xAxisData = []

            if (dataList.length == 0) {
                return
            }
            this.spinShow = false
            dataList.sort((a, b) => {
                return a.open > b.open ? 1 : -1
            })
            const low = dataList[0].open
            const open = dataList[dataList.length - 1].open
            const min = (low - (open - low) / 2).toFixed(3)

            dataList.sort((a, b) => {
                return a.id > b.id ? 1 : -1
            })

            dataList = dataList.map(item => {
                let i: any = {}
                xAxisData.push(item.id * 1000)
                return item.open
            })
            this.option.series[0].data = dataList
            this.option.xAxis[0].data = xAxisData
            this.option.yAxis[0].min = min
            this.dom.setOption(this.option)
            window.onresize = this.dom.resize
        }

        async getChartData() {


            const that = this
            //60min/168
            const url = this.$store.state.app.marketUrl + '/kline/xemusdt/60min/168'
            await axios.get(url).then(function (response) {
                let dataList = []
                response.data.data.forEach((item, index) => {
                    index % 4 == 0 ? dataList.push(item) : dataList;
                })

                that.dataList = dataList
                let marketPriceDataObject = {
                    dataList: dataList,
                    timestamp: new Date().getTime()
                }
                localSave('marketPriceDataList', JSON.stringify(marketPriceDataObject))
            }).catch(function (error) {
                console.log(error);
                that.getChartData()
            });
            this.refresh()
        }

        async refreshData() {
            if (isRefreshData('marketPriceDataList', 1000 * 60 * 60, new Date().getMinutes())) {
                await this.getChartData()
            }else {
                this.dataList = (JSON.parse(localRead('marketPriceDataList'))).dataList
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
    height: 360px;
    position: absolute;
    top: 50px;
    left: 30px;
  }

</style>
