<template>
  <div class="pie_chart_container">
    <div class="pie" id="id" ref="pie"></div>
  </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch, Prop} from 'vue-property-decorator';
    import echarts from 'echarts'

    @Component
    export default class PieChart extends Vue {
        pie: any = {};
        option = {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            color:['#91C7AE','#61a0a8'],
            series: [
                {
                    name: '投票人数',
                    type: 'pie',
                    radius: '50%',
                    center: ['50%', '50%'],
                    data: [
                        {value: 335, name: '是'},
                        {value: 310, name: '否'},
                    ],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };

        @Prop()
        currentVote: any

        mounted() {
            this.pie = echarts.init(this.$refs.pie);
            this.pie.setOption(this.option)

        }

        @Watch('currentVote')
        onCurrentVoteChange() {
            this.option.series[0].data = this.currentVote.selctions
            this.pie = echarts.init(this.$refs.pie);
            this.pie.setOption(this.option)
        }

    }
</script>
<style scoped lang="less">
  .pie_chart_container {
    position: relative;
    width: 100%;
    height: 200px;
  }

  .pie {
    width: 100%;
    height: 300px;
    position: absolute;
    top: 50px;
    left: 0;
  }

</style>

