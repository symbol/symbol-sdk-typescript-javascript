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
    import {Component, Vue} from 'vue-property-decorator'
    import ApostilleAudit from './apostille-function/apostille-audit/ApostilleAudit.vue'
    import ApostilleCreate from './apostille-function/apostille-create/ApostilleCreate.vue'
    import ApostilleHistory from './apostille-function/apostille-history/ApostilleHistory.vue'

    @Component({
        components:{
            ApostilleCreate,
            ApostilleAudit,
            ApostilleHistory
        }
    })
    export default class Apostille extends Vue {
        buttonList = [
            {
                name: 'create_apostille',
                isSelected: true
            }, {
                name: 'audit_apostille',
                isSelected: false
            }, {
                name: 'apostille_history',
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
  @import "Apostille.less";
</style>
