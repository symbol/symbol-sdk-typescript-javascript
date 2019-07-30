<template>
  <div class="namespace_transaction_container">
    <div class="left_switch_type">
      <div class="type_list_item " v-for="(b,index) in typeList">
        <span :class="['name',b.isSelected?'active':'','pointer']" @click="switchType(index)">{{$t(b.name)}}</span>
      </div>
    </div>

    <div class="right_panel">
      <div class="namespace_transaction">
        <div class="form_item">
          <span class="key">{{$t('account')}}</span>
          <span class="value" v-if="typeList[0].isSelected">TCTEXC-5TGXD7-OQCHBB-MNU3LS-2GFCB4-2KD75D-5VCN</span>
          <Select v-if="typeList[1].isSelected" :placeholder="$t('publickey')" v-model="multisigPublickey"
                  class="select">
            <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div>


        <div class="form_item">
          <span class="key">{{$t('parent_namespace')}}</span>
          <span class="value">
        <Select :placeholder="$t('New_root_space')" v-model="multisigPublickey" class="select">
          <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </span>
        </div>

        <div class="form_item">
          <span class="key">{{$t('Subspace')}}</span>
          <span class="value">
      <input type="text" :placeholder="$t('Input_space_name')">
      </span>
          <div class="tips">
            <div>
              {{$t('namespace_tips_key_1')}}
              <span class="red">{{$t('namespace_tips_value_1')}}</span>
            </div>
            <div>
              {{$t('namespace_tips_key_2')}}
              <span class="red">{{$t('namespace_tips_value_2')}}</span>
            </div>
            <div>
              {{$t('namespace_tips_key_3')}}
            </div>
          </div>
        </div>

        <div class="form_item duration_item">
          <span class="key">{{$t('duration')}}</span>
          <span class="value">
             <input v-model="duration" type="text" :placeholder="$t('undefined')">
            <span class="end_label">{{$t('duration')}}:{{durationIntoDate}}</span>
         </span>
          <div class="tips">
            {{$t('namespace_duration_tip_1')}}
          </div>
        </div>

        <div class="form_item XEM_rent_fee">
          <span class="key">{{$t('rent')}}</span>
          <span class="value">{{Number(duration)}}XEM</span>
        </div>

        <div class="form_item">
          <span class="key">{{$t('fee')}}</span>
          <span class="value">
              <input type="text" :placeholder="$t('undefined')">
            <span class="end_label">XEM</span>
          </span>
          <div class="tips">
            {{$t('the_more_you_set_the_cost_the_higher_the_processing_priority')}}
          </div>
        </div>

        <div class="create_button" @click="createTransaction">
          {{$t('create')}}
        </div>
      </div>
    </div>
    <CheckPWDialog :showCheckPWDialog="showCheckPWDialog" @closeCheckPWDialog="closeCheckPWDialog"></CheckPWDialog>

  </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import {formatSeconds} from '@/utils/util.js'
    import Message from "@/message/Message";
    import CheckPWDialog from '@/components/checkPW-dialog/CheckPWDialog.vue'

    @Component({
        components:{
            CheckPWDialog
        }
    })
    export default class NamespaceTransaction extends Vue {
        showCheckPWDialog = false
        duration = 0
        durationIntoDate = 0
        multisigPublickey = ''
        cityList = [
            {
                value: 'TCTEXC-235TGXD7-OQCHBB-MNU3LS-2GFCB4-2KD75D-5VCN',
                label: 'TCTEXC-5TGXD7-OQCHBB-MNU3LS-2GFCB4-2KD75D-5VCN'
            },
            {
                value: 'TCTEXC-325TGXD7-OQCHBB-MNU3LS-2GFCB4-2KD75D-5VCN',
                label: 'TCTEXC-5TGXD7-OQCHBB-MNU3LS-2GFCB4-2KD75D-5VCN'
            },
            {
                value: 'TCTEXC-23325TGXD7-OQCHBB-MNU3LS-2GFCB4-2KD75D-5VCN',
                label: 'TCTEXC-5TGXD7-OQCHBB-MNU3LS-2GFCB4-2KD75D-5VCN'
            }
        ]

        typeList = [
            {
                name: 'ordinary_account',
                isSelected: true
            }, {
                name: 'multi_sign_account',
                isSelected: false
            }
        ]

        switchType(index) {
            let list = this.typeList
            list = list.map((item) => {
                item.isSelected = false
                return item
            })
            list[index].isSelected = true
            this.typeList = list
        }

        checkEnd(flag){
            console.log(flag)
        }
        closeCheckPWDialog () {
            this.showCheckPWDialog = false
        }
        createTransaction(){
            this.showCheckPWDialog = true
        }

        @Watch('duration')
        onDurationChange() {
            const duration = Number(this.duration)
            if (Number.isNaN(duration)) {
                this.duration = 0
                this.durationIntoDate = 0
                return
            }
            if (duration * 12 >= 60 * 60 * 24 * 365) {
                this.$Message.error(Message.DURATION_MORE_THAN_1_YEARS_ERROR)
                this.duration = 0
            }
            this.durationIntoDate = formatSeconds(duration * 12)

        }

    }
</script>
<style scoped lang="less">
  @import "NamespaceTransaction.less";
</style>
