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
    import {Component, Vue} from 'vue-property-decorator'
    import MosaicTransaction from './mosaic-function/mosaic-transaction/MosaicTransaction.vue'
    import MosaicList from './mosaic-function/mosaic-list/MosaicList.vue'

    @Component({
        components: {
            MosaicTransaction,
            MosaicList
        }
    })
    export default class Mosaic extends Vue {
        buttonList = [
            {
                name: 'create_mosaic',
                isSelected: true
            }, {
                name: 'mosaic_list',
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

<style lang="less">

</style>
