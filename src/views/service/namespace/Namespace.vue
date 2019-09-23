<template>
  <div class="namespace_container">
    <div class="top_navigator radius">
      <span
        v-for="(b,index) in buttonList"
        :key="index"
        class="button_list_item "
      >
        <span :class="['name',b.isSelected?'active':'','pointer']" @click="switchButton(index)">{{$t(b.name)}}</span>
        <span class="line" v-if="index !== (buttonList.length -1) ">|</span>
      </span>
    </div>

    <div class="sub_function_container scroll radius">

      <div class="right_panel">
        <NamespaceList v-if="buttonList[0].isSelected" />
        <RootNamespace v-if="buttonList[1].isSelected" />
        <SubNamespace v-if="buttonList[2].isSelected" />
      </div>
    </div>


  </div>
</template>

<script lang="ts">
    // @ts-ignore
    import {NamespaceTs} from '@/views/service/namespace/NamespaceTs.ts'

    export default class Namespace extends NamespaceTs {

    }


</script>

<style scoped lang="less">
  @import "Namespace.less";
</style>
