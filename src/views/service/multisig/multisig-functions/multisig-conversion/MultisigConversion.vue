<template>
  <div>
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
          <div class="title">{{$t('inner_fee')}}</div>
          <div class="title_describe">
            {{$t('the_more_you_set_the_cost_the_higher_the_processing_priority')}}
          </div>
          <div class="input_content">
            <input type="text" v-model="formItem.innerFee" class="radius" placeholder="0.050000">
            <span class="XEM_tag">gas </span>
            <span class="xem_amount">{{formItem.innerFee / 1000000}} xem </span>
          </div>
        </span>
        </div>

        <div class="multisig_property_fee">
        <span class="gray_content">
          <div class="title">{{$t('bonded_fee')}}</div>
          <div class="title_describe">
            {{$t('the_more_you_set_the_cost_the_higher_the_processing_priority')}}
          </div>
          <div class="input_content">
            <input type="text" v-model="formItem.bondedFee" class="radius" placeholder="0.050000">
            <span class="XEM_tag">gas </span>
            <span class="xem_amount">{{formItem.bondedFee / 1000000}} xem </span>
          </div>
        </span>
        </div>


        <div class="multisig_property_fee">
        <span class="gray_content">
          <div class="title">{{$t('lock_fee')}}</div>
          <div class="title_describe">
            {{$t('the_more_you_set_the_cost_the_higher_the_processing_priority')}}
          </div>
          <div class="input_content">
            <input type="text" v-model="formItem.lockFee" class="radius" placeholder="0.050000">
            <span class="XEM_tag">gas </span>
            <span class="xem_amount">{{formItem.lockFee / 1000000}} xem </span>
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
                     src="@/common/img/service/multisig/multisigDelete.png" alt="">
              </div>
            </div>
          </div>
        </div>
      </div>

      <div @click="confirmInput" class="confirm_button pointer" v-if="!isMultisig">
        {{$t('send')}}
      </div>
      <div class=" is_multisign pointer" v-else>
        {{$t('This_account_is_already_a_multi_sign_account')}}
      </div>

      <CheckPWDialog :showCheckPWDialog="showCheckPWDialog" @closeCheckPWDialog="closeCheckPWDialog"
                     @checkEnd="checkEnd"></CheckPWDialog>
    </div>

  </div>

</template>

<script lang="ts">
    import {Message} from "@/config/index"
    import {Component, Vue} from 'vue-property-decorator'
    import {multisigInterface} from '@/interface/sdkMultisig.ts'
    import {transactionInterface} from '@/interface/sdkTransaction.ts'
    import CheckPWDialog from '@/common/vue/check-password-dialog/CheckPasswordDialog.vue'
    import {
        Account,
        Listener,
        MultisigCosignatoryModification,
        MultisigCosignatoryModificationType,
        PublicAccount,
        ModifyMultisigAccountTransaction, Deadline, UInt64
    } from 'nem2-sdk';

    @Component({
        components: {
            CheckPWDialog
        }
    })
    export default class MultisigConversion extends Vue {

        currentAddress = ''
        showCheckPWDialog = false
        isMultisig = false
        formItem = {
            publickeyList: [],
            minApproval: 1,
            minRemoval: 1,
            bondedFee: 10000000,
            lockFee: 10000000,
            innerFee: 10000000
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

        showErrorMessage(message: string) {
            this.$Notice.destroy()
            this.$Notice.error({
                title: message
            })
        }

        checkForm(): boolean {
            const {publickeyList, minApproval, minRemoval, bondedFee, lockFee, innerFee} = this.formItem

            if (publickeyList.length < 1) {
                this.showErrorMessage(this.$t(Message.CO_SIGNER_NULL_ERROR) + '')
                return false
            }

            if ((!Number(minApproval) && Number(minApproval) !== 0) || Number(minApproval) < 1) {
                this.showErrorMessage(this.$t(Message.MIN_APPROVAL_LESS_THAN_0_ERROR) + '')
                return false
            }

            if ((!Number(minRemoval) && Number(minRemoval) !== 0) || Number(minRemoval) < 1) {
                this.showErrorMessage(this.$t(Message.MIN_REMOVAL_LESS_THAN_0_ERROR) + '')
                return false
            }

            if (Number(minApproval) > 10) {
                this.showErrorMessage(this.$t(Message.MAX_APPROVAL_MORE_THAN_10_ERROR) + '')
                return false
            }

            if (Number(minRemoval) > 10) {
                this.showErrorMessage(this.$t(Message.MAX_REMOVAL_MORE_THAN_10_ERROR) + '')
                return false
            }
            if ((!Number(innerFee) && Number(innerFee) !== 0) || Number(innerFee) < 0) {
                this.showErrorMessage(this.$t(Message.FEE_LESS_THAN_0_ERROR) + '')
                return false
            }

            if ((!Number(bondedFee) && Number(bondedFee) !== 0) || Number(bondedFee) < 0) {
                this.showErrorMessage(this.$t(Message.FEE_LESS_THAN_0_ERROR) + '')
                return false
            }

            if ((!Number(lockFee) && Number(lockFee) !== 0) || Number(lockFee) < 0) {
                this.showErrorMessage(this.$t(Message.FEE_LESS_THAN_0_ERROR) + '')
                return false
            }

            const publickeyFlag = publickeyList.every((item) => {
                if (item.trim().length !== 64) {
                    this.showErrorMessage(this.$t(Message.ILLEGAL_PUBLICKEY_ERROR) + '')
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

        getMultisigAccountList() {
            const that = this
            const {address} = this.$store.state.account.wallet
            const {node} = this.$store.state.account

            multisigInterface.getMultisigAccountInfo({
                address,
                node
            }).then((result) => {
                if (result.result.multisigInfo.cosignatories.length !== 0) {
                    that.isMultisig = true
                }
            }).catch(e=>console.log(e))
        }

        sendMultisignConversionTransaction(privatekey) {
            const {publickeyList, minApproval, minRemoval, lockFee, bondedFee, innerFee} = this.formItem
            const {networkType} = this.$store.state.account.wallet
            const {generationHash, node} = this.$store.state.account
            const account = Account.createFromPrivateKey(privatekey, networkType)
            const listener = new Listener(node.replace('http', 'ws'), WebSocket)
            const multisigCosignatoryModificationList = publickeyList.map(cosigner => new MultisigCosignatoryModification(
                MultisigCosignatoryModificationType.Add,
                PublicAccount.createFromPublicKey(cosigner, networkType),
            ))

            const modifyMultisigAccountTransaction = ModifyMultisigAccountTransaction.create(
                Deadline.create(),
                minApproval,
                minRemoval,
                multisigCosignatoryModificationList,
                networkType,
                UInt64.fromUint(innerFee)
            );
            multisigInterface.bondedMultisigTransaction({
                networkType: networkType,
                account: account,
                fee: bondedFee,
                multisigPublickey: account.publicKey,
                transaction: [modifyMultisigAccountTransaction],
            }).then((result) => {
                const aggregateTransaction = result.result.aggregateTransaction
                transactionInterface.announceBondedWithLock({
                    aggregateTransaction,
                    account,
                    listener,
                    node,
                    generationHash,
                    networkType,
                    fee: lockFee
                })
            })
        }


        created() {
            this.getMultisigAccountList()
        }
    }
</script>
<style scoped lang="less">
  @import "MultisigConversion.less";
</style>
