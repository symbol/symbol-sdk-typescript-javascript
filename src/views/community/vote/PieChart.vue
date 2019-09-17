<template>
  <div class="pie_chart_container">
    <div class="pie" id="id" ref="pie"></div>
  </div>
</template>

<script lang="ts">
    import echarts from 'echarts'
    import {Component, Vue, Watch, Prop} from 'vue-property-decorator'
    import {echarts as echartsConfigure} from '@/config/echarts.ts'

    @Component
    export default class PieChart extends Vue {
        pie: any = {}
        option = echartsConfigure.votePieOption

        @Prop()
        selections: Array<any>

        mounted() {
            this.pie = echarts.init(this.$refs.pie)
            if (this.$refs.pie) return
            this.pie.setOption(this.option)
            window.onresize = this.pie.resize
        }

        @Watch('selections', {deep: true})
        onCurrentVoteChange() {
            if (!this.selections) {
                return
            }
            this.option.series[0].data = this.selections
            this.pie = echarts.init(this.$refs.pie)
            this.pie.setOption(this.option)
            window.onresize = this.pie.resize
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

