<template>
  <span>
    <span>{{integer}}</span>
    <span class="lighter-color">{{decimals}}</span>
  </span>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator'


  @Component
  export default class NumberFormatting extends Vue {

    @Prop({default: '0'})
    numberOfFormatting: string | number

    get pointIndex() {
      const pointFlag = this.numberOfFormatting.toString().indexOf('.')
      return pointFlag == -1 ? this.numberOfFormatting.toString().length : pointFlag
    }

    get integer() {
      return this.numberOfFormatting.toString().substring(0, this.pointIndex)
    }

    get decimals() {
      return this.numberOfFormatting.toString().substring(this.pointIndex)
    }

  }
</script>
<style scoped lang="less">
  .lighter-color {
    opacity: .4;
  }
</style>
