<template>
  <div class="setting_container scroll radius">
    <div class="top_navigator radius">
      <span class="button_list_item" v-for="(b,index) in buttonList">
        <span :class="['name',b.isSelected?'active':'','pointer']" @click="switchButton(index)">{{$t(b.name)}}</span>
        <span class="line" v-if="index !== (buttonList.length -1) ">|</span>
      </span>
    </div>

    <div class="sub_function_container scroll">
      <MultisigMap v-if="buttonList[0].isSelected"></MultisigMap>
      <MultisigConversion v-if="buttonList[1].isSelected"></MultisigConversion>
      <MultisigManagement v-if="buttonList[2].isSelected"></MultisigManagement>
<!--      <MultisigCosign v-if="buttonList[3].isSelected"></MultisigCosign>-->
    </div>
  </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator'
    import MultisigMap from './multisig-functions/multisig-map/MultisigMap.vue'
    import MultisigCosign from './multisig-functions/multisig-cosign/MultisigCosign.vue'
    import MultisigConversion from './multisig-functions/multisig-conversion/MultisigConversion.vue'
    import MultisigManagement from './multisig-functions/multisig-management/MultisigManagement.vue'

    @Component({
        components: {
            MultisigMap,
            MultisigConversion,
            MultisigManagement,
            MultisigCosign
        }
    })
    export default class Setting extends Vue {

        buttonList = [
            {
                name: 'map',
                isSelected: true
            }, {
                name: 'convert',
                isSelected: false
            }, {
                name: 'manage',
                isSelected: false
            },
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
  @import "Multisig.less";
</style>
