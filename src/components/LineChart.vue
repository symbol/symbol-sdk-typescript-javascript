<template>
  <div class="line_chart_container">
    <span>XEM行情走势（近7天）</span>
    <span class="right">总市值（CNY）836,341,288.11</span>
    <div class="line" id="id" ref="dom"></div>
  </div>

</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import echarts from 'echarts'

    @Component
    export default class LineChart extends Vue {
        dom: any = {};
        screenWidth: document.body.clientWidth
        option = {
            tooltip: {
                formatter: function (params, ticket, callback) {
                    return 'wwww';
                }
            },
            xAxis: [{
                type: 'category',
                boundaryGap: false,
                axisLine: {
                    lineStyle: {
                        color: '#ccc'
                    }
                },
                axisLabel: {
                    color: "gray" //刻度线标签颜色
                }
            }],
            yAxis: {
                type: 'value',
                axisLine: {
                    lineStyle: {
                        color: '#ccc'
                    }
                },
                axisLabel: {
                    color: "gray" //刻度线标签颜色
                }
            },
            series: [{
                data: [820, 932, 901, 934, 1290, 1330, 1320, 820, 932, 901, 934, 1290, 1330, 1320, 820, 932, 901, 934, 1290, 1330, 1320, 820, 932, 901, 934, 1290, 1330, 1320, 820, 932, 901, 934, 1290, 1330, 1320],
                type: 'line',
                symbol: 'circle',
                symbolSize: function (parmas) {
                    return 2;
                },
                areaStyle: {},
                itemStyle: {
                    normal: {
                        // color: 'transparent',
                        color: '#20B5AC',
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
                                    offset: 0, color: 'rgba(32,181,172,0.5)' // 0% 处的颜色
                                }, {
                                    offset: 0.5, color: 'rgba(32,181,172,0.3)' // 100% 处的颜色
                                }, {
                                    offset: 1, color: 'rgba(32,181,172,0.1)' // 100% 处的颜色
                                }],
                                global: false
                            }
                        }
                    }
                },
                markPoint: {
                    normal: {
                        color: 'black',

                    }
                }
            }],
            grid: {
                x: 40,
                y: 10,
                x2: 10,
                y2: 20
            }
        };
        timer = false

        mounted() {
            this.dom = echarts.init(this.$refs.dom);
            this.dom.setOption(this.option)
            const that = this;
        }
    }
</script>
<style scoped lang="less">
  .line_chart_container {
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
