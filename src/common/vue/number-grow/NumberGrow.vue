<template>
  <div class="number-grow-warp">
    <span v-if="isAdd" ref="numberGrow" :data-time="time" class="number-grow" :data-value="value?value:0"></span>
    <span v-else="isAdd">{{numValue}}</span>
  </div>
</template>

<script>
  export default {
    props: {
      time: {
        type: Number,
        default: 2
      },
      value: {
        default: 0
      }
    },
    data: function () {
      return {
        numValue: 0,
        isAdd: true
      }
    },
    methods: {
      numberGrow (ele) {
        let _this = this
        let step = (_this.value * 10) / (_this.time * 1000)
        let current = 0
        let start = 0
        let t = setInterval(function () {
          start += step
          if (start > _this.value) {
            clearInterval(t)
            start = _this.value
            t = null
          }
          if (current === start) {
            return
          }
          current = start.toFixed(0)
          ele.innerHTML = current.toString().replace(/(\d)(?=(?:\d{3}[+]?)+$)/g, '$1,')
        }, 10)
      }
    },
    mounted() {
      if(this.value == 0){
        this.isAdd = false
        return
      }
      if (this.isAdd) {
        this.numberGrow(this.$refs.numberGrow)
      }
    },
    watch: {
      value() {
        this.numValue = this.value
        this.isAdd  =false
      }
    },
  }
</script>

<style>
@import "NumberGrow.less";
</style>
