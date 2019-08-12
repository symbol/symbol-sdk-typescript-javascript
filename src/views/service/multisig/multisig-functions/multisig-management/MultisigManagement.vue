<template>
  <div>
    <div class="multisig_management_container" @click="showSubpublickeyList = false">
      <div class="container_head_title">{{$t('Edit_co_signers_and_signature_thresholds')}}</div>
      <div class="edit_form">
        <div class="form_item">
          <div class="title">{{$t('Public_account')}}</div>
          <Select v-model="formItem.multisigPublickey" class="select" :placeholder="$t('publickey')">
            <Option v-for="item in publickeyList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div>

        <div class="form_item input_cosigner">
          <div class="title">{{$t('cosigner')}}</div>
          <div class="manage_cosigner">
          <span class="input_container">
            <input type="text" v-model="currentPublickey" :placeholder="$t('Wallet_account_address_or_alias')"
                   class="radius">
            <span class="switch_container pointer" @click.stop="showSubpublickeyList = !showSubpublickeyList">
              <Tooltip :content="$t('Choose_a_co_signer')" theme="light">
                <span class="switch_cosigner"></span>
              </Tooltip>
            </span>
            <div class="sub_list radius" v-if="showSubpublickeyList">
              <div @click="currentPublickey = i.value" class="sub_list_item pointer" v-for="i in existsCosignerList">{{i.value}}</div>
            </div>
          </span>
            <span @click="addCosigner(MultisigCosignatoryModificationType.Add)"
                  class="add_button radius pointer">+</span>
            <span @click="addCosigner(MultisigCosignatoryModificationType.Remove)"
                  class="delete_button radius pointer">-</span>
          </div>
          <div class="input_describe">
            {{$t('Add_delete_co_signers_this_action_will_be_displayed_in_the_action_log_click_delete_to_cancel')}}
          </div>
        </div>

        <div class="property_amount">
        <span class="form_item input_min_approval">
          <div class="title">{{$t('min_approval_delta')}} ( {{$t('currrent')}} min approval : {{currentMinApproval }} )</div>
          <div class="manage_cosigner">
            <input type="text" v-model="formItem.minApprovalDelta"
                   :placeholder="$t('Please_set_the_minimum_number_of_signatures_number_of_co_signers')"
                   class="radius">
          </div>
          <div class="input_describe">
            {{$t('The_number_of_signatures_required_to_add_someone_from_a_multi_sign_or_complete_this_multi_tap_transaction')}}
          </div>
        </span>

          <span class="form_item input_min_delete">
          <div class="title">{{$t('min_removal_delta')}} ( {{$t('currrent')}}  min removal : {{currentMinRemoval }} )</div>
          <div class="manage_cosigner">
            <input type="text" v-model="formItem.minRemovalDelta"
                   :placeholder="$t('Please_set_the_minimum_number_of_signatures_number_of_co_signers')"
                   class="radius">
          </div>
          <div class="input_describe">
            {{$t('The_number_of_signatures_required_to_remove_someone_from_multiple_sign_ups')}}
          </div>
        </span>
        </div>


        <div class="form_item input_fee">
          <div class="title">{{$t('inner_fee')}}</div>
          <div class="manage_cosigner">
            <input type="text" v-model="formItem.innerFee" placeholder="50000" class="radius">
            <span class="xem_container">gas</span>
            <span class="xem_amount">{{formItem.innerFee / 1000000}} xem </span>
          </div>
          <div class="input_describe">
            {{$t('the_more_you_set_the_cost_the_higher_the_processing_priority')}}
          </div>
        </div>


        <div v-if="currentMinApproval > 1">
          <div class="form_item input_fee">
            <div class="title">{{$t('bonded_fee')}}</div>
            <div class="manage_cosigner">
              <input type="text" v-model="formItem.bondedFee" placeholder="50000" class="radius">
              <span class="xem_container">gas</span>
              <span class="xem_amount">{{formItem.bondedFee / 1000000}} xem </span>
            </div>
            <div class="input_describe">
              {{$t('the_more_you_set_the_cost_the_higher_the_processing_priority')}}
            </div>
          </div>


          <div class="form_item input_fee">
            <div class="title">{{$t('lock_fee')}}</div>
            <div class="manage_cosigner">
              <input type="text" v-model="formItem.lockFee" placeholder="50000" class="radius">
              <span class="xem_container">gas</span>
              <span class="xem_amount">{{formItem.lockFee / 1000000}} xem </span>
            </div>
            <div class="input_describe">
              {{$t('the_more_you_set_the_cost_the_higher_the_processing_priority')}}
            </div>
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
            <div class="please_add_address" v-if="formItem.cosignerList.length == 0">{{$t('please_add_publickey')}}
            </div>

            <div class="list_item radius" v-for="(i,index) in formItem.cosignerList">
              <span class="address_alias">{{i.publickey}}</span>
              <span class="action">{{i.type == MultisigCosignatoryModificationType.Add ? $t('add'):$t('cut_back')}}</span>
              <img class="delate pointer" @click="removeCosigner(index)"
                   src="@/common/img/service/multisig/multisigDelete.png" alt="">
            </div>
          </div>
        </div>
      </div>

      <div @click="confirmInput" class="send_button pointer" v-if="isShowPanel">
        {{$t('send')}}
      </div>

      <div class=" no_multisign pointer" v-else>
        {{$t('There_are_no_more_accounts_under_this_account')}}
      </div>

      <CheckPWDialog :showCheckPWDialog="showCheckPWDialog" @closeCheckPWDialog="closeCheckPWDialog"
                     @checkEnd="checkEnd"></CheckPWDialog>
    </div>
  </div>

</template>

<script lang="ts">
    import {Message} from "@/config/index"
    import {Component, Vue, Watch} from 'vue-property-decorator'
    import {multisigInterface} from '@/interface/sdkMultisig.ts'
    import {transactionInterface} from '@/interface/sdkTransaction'
    import CheckPWDialog from '@/common/vue/check-password-dialog/CheckPasswordDialog.vue'
    import {
        MultisigCosignatoryModificationType,
        MultisigCosignatoryModification,
        PublicAccount,
        Account,
        Listener,
        Address,
        Deadline,
        ModifyMultisigAccountTransaction,
        UInt64
    } from 'nem2-sdk'
    import {multisigAccountInfo} from "@/help/appUtil";
    @Component({
        components: {
            CheckPWDialog
        }
    })
    export default class MultisigManagement extends Vue {
        isShowPanel = true
        currentPublickey = ''
        currentMinRemoval = 0
        hasAddCosigner = false
        currentMinApproval = 0
        existsCosignerList = [{}]
        showCheckPWDialog = false
        currentCosignatoryList = []
        showSubpublickeyList = false
        MultisigCosignatoryModificationType = MultisigCosignatoryModificationType
        publickeyList = [{
            label: 'no data',
            value: 'no data'
        }]

        formItem = {
            minApprovalDelta: 0,
            minRemovalDelta: 0,
            bondedFee: 10000000,
            lockFee: 10000000,
            innerFee: 10000000,
            cosignerList: [],
            multisigPublickey: ''
        }


        addCosigner(flag) {
            this.formItem.cosignerList.push({
                publickey: this.currentPublickey,
                type: flag
            })
            this.currentPublickey = ''
        }

        removeCosigner(index) {
            this.formItem.cosignerList.splice(index, 1)
        }

        closeCheckPWDialog() {
            this.showCheckPWDialog = false
        }

        confirmInput() {
            if (!this.checkForm()) return
            this.showCheckPWDialog = true
        }


        createCompleteModifyTransaction(privatekey) {
            const {multisigPublickey, cosignerList, innerFee, minApprovalDelta, minRemovalDelta} = this.formItem
            const {networkType} = this.$store.state.account.wallet
            const {generationHash, node} = this.$store.state.account
            const account = Account.createFromPrivateKey(privatekey, networkType)
            const multisigCosignatoryModificationList = cosignerList.map(cosigner => new MultisigCosignatoryModification(
                cosigner.type,
                PublicAccount.createFromPublicKey(cosigner.publickey, networkType),
            ))


            const modifyMultisigAccountTx = ModifyMultisigAccountTransaction.create(
                Deadline.create(),
                Number(minApprovalDelta),
                Number(minRemovalDelta),
                multisigCosignatoryModificationList,
                networkType,
                UInt64.fromUint(innerFee)
            );
            multisigInterface.completeMultisigTransaction({
                networkType: networkType,
                fee: innerFee,
                multisigPublickey: multisigPublickey,
                transaction: [modifyMultisigAccountTx],
            }).then((result) => {
                const aggregateTransaction = result.result.aggregateTransaction
                transactionInterface._announce({
                    transaction: aggregateTransaction,
                    account,
                    node,
                    generationHash
                })
            })
        }

        createBondedModifyTransaction(privatekey) {
            const {multisigPublickey, cosignerList, bondedFee, lockFee, innerFee, minApprovalDelta, minRemovalDelta} = this.formItem
            const {networkType} = this.$store.state.account.wallet
            const {generationHash, node} = this.$store.state.account
            const account = Account.createFromPrivateKey(privatekey, networkType)
            const multisigCosignatoryModificationList = cosignerList.map(cosigner => new MultisigCosignatoryModification(
                cosigner.type,
                PublicAccount.createFromPublicKey(cosigner.publickey, networkType),
            ))
            const listener = new Listener(node.replace('http', 'ws'), WebSocket)
            const modifyMultisigAccountTransaction = ModifyMultisigAccountTransaction.create(
                Deadline.create(),
                Number(minApprovalDelta),
                Number(minRemovalDelta),
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


        checkEnd(privatekey) {
            const {hasAddCosigner} = this
            const {cosignerList} = this.formItem
            if (this.currentMinApproval == 0) {
                return
            }
            if (this.currentMinApproval > 1 || hasAddCosigner) {
                console.log('bonded')
                this.createBondedModifyTransaction(privatekey);
                return
            }
            console.log('complete')
            this.createCompleteModifyTransaction(privatekey);
            return

        }


        showErrorMessage(message: string) {
            this.$Notice.destroy()
            this.$Notice.error({
                title: message
            })
        }

        checkForm(): boolean {
            const {multisigPublickey, cosignerList, bondedFee, lockFee, innerFee, minApprovalDelta, minRemovalDelta} = this.formItem
            const {currentMinApproval, currentMinRemoval} = this

            if ((!Number(minRemovalDelta) && Number(minRemovalDelta) !== 0) || Number(minRemovalDelta) + currentMinRemoval < 1) {
                this.showErrorMessage(this.$t(Message.MIN_REMOVAL_LESS_THAN_0_ERROR) + '')
                return false
            }

            if ((!Number(minApprovalDelta) && Number(minApprovalDelta) !== 0) || Number(minApprovalDelta) + currentMinApproval < 1) {
                this.showErrorMessage(this.$t(Message.MIN_APPROVAL_LESS_THAN_0_ERROR) + '')
                return false
            }

            if (Number(minApprovalDelta) + currentMinApproval > 10) {
                this.showErrorMessage(this.$t(Message.MAX_APPROVAL_MORE_THAN_10_ERROR) + '')
                return false
            }

            if (Number(minRemovalDelta) + currentMinRemoval > 10) {
                this.showErrorMessage(this.$t(Message.MAX_REMOVAL_MORE_THAN_10_ERROR) + '')
                return false
            }

            if (multisigPublickey.length !== 64) {
                this.$Notice.error({title: this.$t(Message.ILLEGAL_PUBLICKEY_ERROR) + ''})
                return false;
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

            if (cosignerList.length < 1) {
                return true
            }
            const publickeyFlag = cosignerList.every((item) => {
                if (item.type == MultisigCosignatoryModificationType.Add) {
                    this.hasAddCosigner = true
                }

                if (item.publickey.trim().length !== 64) {
                    this.$Notice.error({title: this.$t(Message.ILLEGAL_PUBLICKEY_ERROR) + ''})
                    return false;
                }
                return true;
            });
            return publickeyFlag
        }

        async getMultisigAccountList() {
            const that = this
            const {address} = this.$store.state.account.wallet
            const {node} = this.$store.state.account
            const multisigInfo =await multisigAccountInfo(address, node)
            if (multisigInfo['multisigAccounts'].length == 0) {
                that.isShowPanel = false
                return
            }
            that.publickeyList = multisigInfo['multisigAccounts'].map((item) => {
                item.value = item.publicKey
                item.label = item.publicKey
                return item
            })
        }

        @Watch('formItem.multisigPublickey')
        async onMultisigPublickeyChange() {
            console.log(this.formItem.multisigPublickey)
            const that = this
            const {multisigPublickey} = this.formItem
            const {networkType} = this.$store.state.account.wallet
            const {node} = this.$store.state.account
            let address = Address.createFromPublicKey(multisigPublickey, networkType)['address']
            const multisigInfo =await multisigAccountInfo(address, node)
            that.existsCosignerList = multisigInfo['cosignatories'].map((item) => {
                item.value = item.publicKey
                item.label = item.publicKey
                return item
            })
            that.currentMinApproval = multisigInfo['minApproval']
            that.currentMinRemoval = multisigInfo['minRemoval']
            that.currentCosignatoryList = multisigInfo['cosignatories']
        }

        created() {
            this.getMultisigAccountList()
        }
    }
</script>
<style scoped lang="less">
  @import "MultisigManagement.less";
</style>
