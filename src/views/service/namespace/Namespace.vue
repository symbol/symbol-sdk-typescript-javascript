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
        <NamespaceTransaction v-if="buttonList[0].isSelected"></NamespaceTransaction>
        <NaNamespaceListmespaceTransaction v-if="buttonList[1].isSelected"></NaNamespaceListmespaceTransaction>
      </div>
    </div>


  </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import NamespaceTransaction from './namespace-function/namespace-transacrion/NamespaceTransaction.vue'
    import NaNamespaceListmespaceTransaction from './namespace-function/namespace-list/NamespaceList.vue'

    @Component({
        components: {
            NamespaceTransaction,
            NaNamespaceListmespaceTransaction,
        }
    })
    export default class Namespace extends Vue {
        buttonList = [
            {
                name: 'Create_namespace',
                isSelected: true
            }, {
                name: 'Namespace_list',
                isSelected: false
            }
        ]

        switchButton(index) {
            let list = this.buttonList
            list = list.map((item) => {
                item.isSelected = false
                return item
            })
            list[index].isSelected = true
            this.buttonList = list
        }


    }
</script>

<style scoped lang="less">
  @import "Namespace.less";
</style>
