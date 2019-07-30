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
                formatter: "{a} <br/>{b} : {c} ({d}%)",
            },
            color:['#EC5447','#F1C850'],
            series: [
                {
                    name: 'vote',
                    type: 'pie',
                    // radius: '50%',
                    // center: ['50%', '50%'],
                    data: [
                        {value: 100, name: 'A 335 25%'},
                        {value: 300, name: 'B 300 75%'},
                    ],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        },
                        borderWidth:2,
                        borderColor:'#fff',
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

        created(){
        }
    }
</script>
<style scoped lang="less">
  .pie_chart_container {
    position: relative;
    width: 100%;
    height: 350px;
  }

  .pie {
    width: 100%;
    height: 300px;
    position: absolute;
    top: 30px;
    left: 0;
  }

</style>

