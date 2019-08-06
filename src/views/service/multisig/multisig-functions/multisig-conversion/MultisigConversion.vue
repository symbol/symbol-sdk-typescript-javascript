<template>
  <div class="multisig_convert_container">
    <div class="multisig_convert_head">{{$t('Convert_to_multi_sign_account')}}</div>
    <div class="convert_form">
      <div class="multisig_add gray_content">
        <div class="title">{{$t('cosigner')}}</div>
        <div class="title_describe">
          {{$t('Add_co_signers_here_will_be_displayed_in_the_action_list_click_delete_to_cancel_the_operation')}}
        </div>
        <div class="input_content">
          <input v-model="currentAddress" type="text" class="radius"
                 :placeholder="$t('Wallet_account_address_or_alias')">
          <span @click="addAddress" class="add_button radius pointer">+</span>
        </div>
      </div>

      <div class="multisig_property_amount">
        <span class="gray_content">
          <div class="title">{{$t('min_approval')}}</div>
          <div class="title_describe">
            {{$t('The_number_of_signatures_required_to_add_someone_from_a_multi_sign_or_complete_this_multi_tap_transaction')}}
          </div>
          <div class="input_content">
            <input type="text" class="radius"
                   v-model="formItem.minApproval"
                   :placeholder="$t('Please_set_the_minimum_number_of_signatures_number_of_co_signers')">
          </div>
        </span>

        <span class="gray_content">
          <div class="title">{{$t('min_removal')}}</div>
          <div class="title_describe">
            {{$t('The_number_of_signatures_required_to_remove_someone_from_multiple_sign_ups')}}
          </div>
          <div class="input_content">
            <input type="text" class="radius"
                   v-model="formItem.minRemoval"
                   :placeholder="$t('Please_set_the_minimum_number_of_signatures_number_of_co_signers')">
          </div>
        </span>
      </div>

      <div class="multisig_property_fee">
        <span class="gray_content">
          <div class="title">{{$t('fee')}}</div>
          <div class="title_describe">
            {{$t('the_more_you_set_the_cost_the_higher_the_processing_priority')}}
          </div>
          <div class="input_content">
            <input type="text" v-model="formItem.fee" class="radius" placeholder="0.050000">
            <span class="XEM_tag">gas</span>
          </div>
        </span>
      </div>

      <div class="cosigner_list">
        <div class="head_title">{{$t('Operation_list')}}</div>
        <div class="list_container radius">
          <div class="list_head">
            <span class="address_alias">{{$t('publickey')}}/{{$t('alias')}}</span>
            <span class="action">{{$t('operating')}}</span>
            <span class="delate">{{$t('delete')}}</span>
          </div>
          <div class="list_body scroll">
            <div class="please_add_address" v-if="formItem.publickeyList.length == 0">{{$t('please_add_publickey')}}
            </div>

            <div class="list_item radius" v-for="(i,index) in formItem.publickeyList">
              <span class="address_alias">{{i}}</span>
              <span class="action">{{$t('add')}}</span>
              <img class="delate pointer" @click="deleteAdress(index)"
                   src="@/assets/images/service/multisig/multisigDelete.png" alt="">
            </div>
          </div>
        </div>
      </div>
    </div>

    <div @click="confirmInput" class="confirm_button pointer">
      {{$t('send')}}
    </div>
    <CheckPWDialog :showCheckPWDialog="showCheckPWDialog" @closeCheckPWDialog="closeCheckPWDialog"
                   @checkEnd="checkEnd"></CheckPWDialog>
  </div>
</template>

<script lang="ts">
    import Message from '@/message/Message.ts'
    import {Component, Vue} from 'vue-property-decorator';
    import {multisigInterface} from '@/interface/sdkMultisig.ts'
    import CheckPWDialog from '@/components/checkPW-dialog/CheckPWDialog.vue'
    import {
        NetworkType, Account, Listener, MultisigCosignatoryModification, MultisigCosignatoryModificationType,
        PublicAccount
    } from 'nem2-sdk';

    @Component({
        components: {
            CheckPWDialog
        }
    })
    export default class MultisigConversion extends Vue {

        currentAddress = ''
        showCheckPWDialog = false
        formItem = {
            publickeyList: [],
            minApproval: 1,
            minRemoval: 1,
            fee: 10000000,
        }


        addAddress() {
            this.formItem.publickeyList.push(this.currentAddress)
            this.currentAddress = ''
        }

        deleteAdress(index) {
            this.formItem.publickeyList.splice(index, 1)
        }

        confirmInput() {
            // check input data
            if (!this.checkForm()) {
                return
            }
            console.log(this.formItem)
            this.showCheckPWDialog = true
        }


        checkForm(): boolean {
            const {publickeyList, minApproval, minRemoval, fee} = this.formItem
            if (publickeyList.length < 1) {
                this.$Notice.error({title: this.$t(Message.CO_SIGNER_NULL_ERROR) + ''})
                return false
            }

            if (!Number(minApproval) || Number(minApproval) < 1) {
                this.$Notice.error({title: this.$t(Message.MIN_APPROVAL_LESS_THAN_0_ERROR) + ''})
                return false
            }

            if (!Number(minRemoval) || Number(minRemoval) < 1) {
                this.$Notice.error({title: this.$t(Message.MIN_REMOVAL_LESS_THAN_0_ERROR) + ''})
                return false
            }

            if (!Number(fee) || Number(fee) < 0) {
                this.$Notice.error({title: this.$t(Message.FEE_LESS_THAN_0_ERROR) + ''})
                return false
            }

            const publickeyFlag = publickeyList.every((item) => {
                if (item.trim().length !== 64) {
                    this.$Notice.error({title: this.$t(Message.ILLEGAL_PUBLICKEY_ERROR) + ''})
                    return false;
                }
                return true;
            });

            return publickeyFlag
        }

        closeCheckPWDialog() {
            this.showCheckPWDialog = false
        }

        checkEnd(privatekey) {
            this.sendMultisignConversionTransaction(privatekey)
        }

        sendMultisignConversionTransaction(privatekey) {
            const {publickeyList, minApproval, minRemoval, fee} = this.formItem
            const {networkType} = this.$store.state.account.wallet
            const {generationHash, node} = this.$store.state.account
            const account = Account.createFromPrivateKey(privatekey, networkType)
            const listener = new Listener(node.replace('http', 'ws'), WebSocket)

            const multisigCosignatoryModificationList = publickeyList.map(cosigner => new MultisigCosignatoryModification(
                MultisigCosignatoryModificationType.Add,
                PublicAccount.createFromPublicKey(cosigner, networkType),
            ))

            multisigInterface.covertToBeMultisig({
                minApprovalDelta: minApproval,
                minRemovalDelta: minRemoval,
                multisigCosignatoryModificationList: multisigCosignatoryModificationList,
                networkType: networkType,
                account: account,
                generationHash: generationHash,
                node: node,
                listener: listener,
                fee: fee
            })
        }
    }
</script>
<style scoped lang="less">
  @import "MultisigConversion.less";
</style>
