<template>
  <div class="apostille_container">
    <div class="top_navigator radius">
      <span class="button_list_item " v-for="(b,index) in buttonList">
        <span :class="['name',b.isSelected?'active':'','pointer']" @click="switchButton(index)">{{$t(b.name)}}</span>
        <span class="line" v-if="index !== (buttonList.length -1) ">|</span>
      </span>
    </div>

    <div class="sub_function_container scroll radius">

      <div class="right_panel">
        <ApostilleCreate v-if="buttonList[0].isSelected"></ApostilleCreate>
        <ApostilleAudit v-if="buttonList[1].isSelected"></ApostilleAudit>
        <ApostilleHistory v-if="buttonList[2].isSelected"></ApostilleHistory>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
    import {ApostilleTs} from './ApostilleTs'

    export default class Apostille extends ApostilleTs {

    }
</script>
<style scoped lang="less">
  @import "Apostille.less";
</style>
