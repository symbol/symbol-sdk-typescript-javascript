<template>
  <div class="setting_container scroll radius">
    <div class="top_navigator radius">
      <span class="button_list_item" v-for="(b,index) in buttonList">
        <span :class="['name',b.isSelected?'active':'','pointer']" @click="switchButton(index)">{{$t(b.name)}}</span>
        <span class="line" v-if="index !== (buttonList.length -1) ">|</span>
      </span>
    </div>

    <div class="sub_function_container scroll">
      <MultisigConversion v-if="buttonList[0].isSelected"></MultisigConversion>
      <MultisigManagement v-if="buttonList[1].isSelected"></MultisigManagement>
      <MultisigMap v-if="buttonList[2].isSelected"></MultisigMap>
      <!--      <MultisigCosign v-if="buttonList[3].isSelected"></MultisigCosign>-->
    </div>
  </div>
</template>

<script lang="ts">
    import {MultisigTs} from './MultisigTs'

    export default class Multisig extends MultisigTs {

    }
</script>
<style scoped lang="less">
  @import "Multisig.less";
</style>
