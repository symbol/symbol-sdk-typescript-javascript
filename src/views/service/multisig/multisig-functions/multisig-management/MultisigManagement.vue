<template>
  <div class="multisig_management_container">
    <div class="container_head_title">{{$t('Edit_co_signers_and_signature_thresholds')}}</div>
    <div class="edit_form">
      <div class="form_item">
        <div class="title">{{$t('Public_account')}}</div>
        <Select v-model="multisigPublickey" class="select">
          <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>

      <div class="form_item input_cosigner">
        <div class="title">{{$t('cosigner')}}</div>
        <div class="manage_cosigner">
          <span class="input_container">
            <input type="text" v-model="currentAddress" :placeholder="$t('Wallet_account_address_or_alias')"
                   class="radius">
            <span class="switch_container pointer" @click="showSubAddressList = !showSubAddressList">
              <Tooltip :content="$t('Choose_a_co_signer')" theme="light" >
                <span class="switch_cosigner"></span>
              </Tooltip>
            </span>
            <div class="sub_list radius" v-if="showSubAddressList">
              <div class="sub_list_item" v-for="i in 3">wedaweawe-ewaeaweaw-eaweaweaw-eawe</div>

            </div>
          </span>
          <span @click="addAddress(MultisigCosignatoryModificationType.Add)" class="add_button radius pointer">+</span>
          <span @click="addAddress(MultisigCosignatoryModificationType.Remove)"
                class="delete_button radius pointer">-</span>
        </div>
        <div class="input_describe">
          {{$t('Add_delete_co_signers_this_action_will_be_displayed_in_the_action_log_click_delete_to_cancel')}}
        </div>
      </div>

      <div class="property_amount">
        <span class="form_item input_min_approval">
          <div class="title">{{$t('min_approval')}}</div>
          <div class="manage_cosigner">
            <input type="text" :placeholder="$t('Please_set_the_minimum_number_of_signatures_number_of_co_signers')"
                   class="radius">
          </div>
          <div class="input_describe">
            {{$t('The_number_of_signatures_required_to_add_someone_from_a_multi_sign_or_complete_this_multi_tap_transaction')}}
          </div>
        </span>

        <span class="form_item input_min_delete">
          <div class="title">{{$t('min_removal')}}</div>
          <div class="manage_cosigner">
            <input type="text" :placeholder="$t('Please_set_the_minimum_number_of_signatures_number_of_co_signers')"
                   class="radius">
          </div>
          <div class="input_describe">
            {{$t('The_number_of_signatures_required_to_remove_someone_from_multiple_sign_ups')}}
          </div>
        </span>
      </div>


      <div class="form_item input_fee">
        <div class="title">{{$t('fee')}}</div>
        <div class="manage_cosigner">
          <input type="text" placeholder="0.05000" class="radius">
          <span class="xem_container">XEM</span>
        </div>
        <div class="input_describe">
          {{$t('the_more_you_set_the_cost_the_higher_the_processing_priority')}}
        </div>
      </div>
    </div>

    <div class="cosigner_list">
      <div class="head_title">{{$t('Operation_list')}}</div>
      <div class="list_container radius">
        <div class="list_head">
          <span class="address_alias">{{$t('address')}}/{{$t('alias')}}</span>
          <span class="action">{{$t('operating')}}</span>
          <span class="delate">{{$t('delete')}}</span>
        </div>
        <div class="list_body scroll">
          <div class="please_add_address" v-if="addressList.length == 0">{{$t('please_add_publickey')}}</div>

          <div class="list_item radius" v-for="(i,index) in addressList">
            <span class="address_alias">{{i.address}}</span>
            <span class="action">{{i.type == MultisigCosignatoryModificationType.Add ? $t('add'):$t('cut_back')}}</span>
            <img class="delate pointer" @click="deleteAdress(index)"
                 src="../../../../../assets/images/service/multisig/multisigDelete.png" alt="">
          </div>
        </div>
      </div>
    </div>

    <div @click="confirmInput" class="send_button pointer">
      {{$t('send')}}
    </div>

    <CheckPWDialog :showCheckPWDialog="showCheckPWDialog" @closeCheckPWDialog="closeCheckPWDialog"
                   @checkEnd="checkEnd"></CheckPWDialog>
  </div>
</template>

<script lang="ts">
    import {MultisigCosignatoryModificationType} from 'nem2-sdk'
    import {Component, Vue} from 'vue-property-decorator';
    import CheckPWDialog from '@/components/checkPW-dialog/CheckPWDialog.vue'

    @Component({
        components:{
            CheckPWDialog
        }
    })
    export default class MultisigManagement extends Vue {
        MultisigCosignatoryModificationType = MultisigCosignatoryModificationType
        showSubAddressList = false
        showCheckPWDialog = false
        cityList = [
            {
                value: 'TCTEXC-5TGXD7f-OQCHBB-MNU3LS-2GFCB4-2KD75D-5VCN',
                label: 'TCTEXC-5TGXD7-OQCHBB-MNU3LS-2GFCB4-2KD75D-5VCN'
            },
            {
                value: 'TCTEXC-f5TGXD7-OQCHBB-MNU3LS-2GFCB4-2KD75D-5VCN',
                label: 'TCTEXC-5TGXD7-OQCHBB-MNU3LS-2GFCB4-2KD75D-5VCN'
            },
            {
                value: 'TCTEXC-5TGXD7-OQCHBB-fMNU3LS-2GFCB4-2KD75D-5VCN',
                label: 'TCTEXC-5TGXD7-OQCHBB-MNU3LS-2GFCB4-2KD75D-5VCN'
            }
        ]
        multisigPublickey = ''
        addressList = []
        currentAddress = ''

        closeCheckPWDialog(){
            this.showCheckPWDialog = false
        }
        checkEnd(flag){
            console.log(flag)
        }
        confirmInput() {
            this.showCheckPWDialog = true
        }

        addAddress(flag) {
            console.log('.........')
            this.addressList.push({
                address: this.currentAddress,
                type: flag
            })
        }

        deleteAdress(index) {
            this.addressList.splice(index, 1)
        }

    }
</script>
<style scoped lang="less">
  @import "MultisigManagement.less";
</style>
