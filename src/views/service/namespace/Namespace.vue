<template>
  <div class="namespace_container">
    <div class="top_navigator radius">
      <span class="button_list_item " v-for="(b,index) in buttonList">
        <span :class="['name',b.isSelected?'active':'','pointer']" @click="switchButton(index)">{{$t(b.name)}}</span>
        <span class="line" v-if="index !== (buttonList.length -1) ">|</span>
      </span>
    </div>

    <div class="sub_function_container scroll radius">

      <div class="right_panel">
        <RootNamespace v-if="buttonList[0].isSelected" @createdNamespace="getMyNamespaces"></RootNamespace>
        <SubNamespace v-if="buttonList[1].isSelected" @createdNamespace="getMyNamespaces"></SubNamespace>
        <NamespaceList v-if="buttonList[2].isSelected"></NamespaceList>
      </div>
    </div>


  </div>
</template>

<script lang="ts">
    import {NamespaceTs} from './NamespaceTs'

    export default class Namespace extends NamespaceTs {

    }


</script>

<style scoped lang="less">
  @import "Namespace.less";
</style>
