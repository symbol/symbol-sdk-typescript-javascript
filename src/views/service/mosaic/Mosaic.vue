<template>
  <div class="mosaicWrap">
    <div class="top_navigator radius">
      <span class="button_list_item " v-for="(b,index) in buttonList">
        <span :class="['name',b.isSelected?'active':'','pointer']" @click="switchButton(index)">{{$t(b.name)}}</span>
        <span class="line" v-if="index !== (buttonList.length -1) ">|</span>
      </span>
    </div>

    <div class="sub_function_container scroll radius">

      <div class="right_panel">
        <MosaicTransaction v-if="buttonList[0].isSelected"></MosaicTransaction>
        <MosaicList v-if="buttonList[1].isSelected"></MosaicList>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
    import "./Mosaic.less";
    import {MosaicTs} from './MosaicTs'

    export default class Mosaic extends MosaicTs {

    }
</script>

<style lang="less">

</style>
