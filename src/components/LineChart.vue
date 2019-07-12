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

    @Component
    export default class LineChart extends Vue {
        dom: any = {};
        spinShow = true
        option = {
            tooltip: {
                backgroundColor: 'white',
                formatter: (params: any) => {
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
                                      <span style="color: #666666;margin-right: 5px">￥${value}</span>
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
                areaStyle: {},
                itemStyle: {
                    normal: {
                        color: 'transparent',
                        lineStyle: {
                            color: '#20B5AC'
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
                x2: 10,
                y2: 20
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
                return a.high > b.high ? 1 : -1
            })
            const low = dataList[0].high
            const high = dataList[dataList.length - 1].high
            const min = (low - (high - low) / 2).toFixed(3)
            console.log(low, high)

            dataList.sort((a, b) => {
                return a.id > b.id ? 1 : -1
            })

            dataList = dataList.map(item => {
                let i: any = {}
                xAxisData.push(item.id * 1000)
                return item.high
            })
            this.option.series[0].data = dataList
            this.option.xAxis[0].data = xAxisData
            this.option.yAxis[0].min = min
            this.dom.setOption(this.option)
            window.onresize = this.dom.resize
        }

        async getChartData() {
            const that = this
            const url = this.$store.state.app.apiUrl + '/market/kline/xemusdt/4hour/42'
            console.log(url);
            await axios.get(url).then(function (response) {
                that.dataList = response.data.data
                that.$set(that, 'dataList', response.data.data)
                that.refresh()
            }).catch(function (error) {
                console.log(error);
            });
        }

        async created() {
            await this.getChartData()
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
        width: 854px;
        height: 360px;
        position: absolute;
        top: 50px;
        left: 30px;
    }

</style>
