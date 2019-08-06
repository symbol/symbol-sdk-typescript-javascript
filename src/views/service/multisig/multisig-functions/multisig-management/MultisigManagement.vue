<template>
  <div class="multisig_management_container">
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
            <input type="text" v-model="currentAddress" :placeholder="$t('Wallet_account_address_or_alias')"
                   class="radius">
            <span class="switch_container pointer" @click="showSubpublickeyList = !showSubpublickeyList">
              <Tooltip :content="$t('Choose_a_co_signer')" theme="light">
                <span class="switch_cosigner"></span>
              </Tooltip>
            </span>
            <div class="sub_list radius" v-if="showSubpublickeyList">
              <div class="sub_list_item" v-for="i in 1"> no data</div>

            </div>
          </span>
          <span @click="addCosigner(MultisigCosignatoryModificationType.Add)" class="add_button radius pointer">+</span>
          <span @click="addCosigner(MultisigCosignatoryModificationType.Remove)"
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
            <input type="text" v-model="formItem.minApproval"
                   :placeholder="$t('Please_set_the_minimum_number_of_signatures_number_of_co_signers')"
                   class="radius">
          </div>
          <div class="input_describe">
            {{$t('The_number_of_signatures_required_to_add_someone_from_a_multi_sign_or_complete_this_multi_tap_transaction')}}
          </div>
        </span>

        <span class="form_item input_min_delete">
          <div class="title">{{$t('min_removal')}}</div>
          <div class="manage_cosigner">
            <input type="text" v-model="formItem.minRemoval"
                   :placeholder="$t('Please_set_the_minimum_number_of_signatures_number_of_co_signers')"
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
          <input type="text" v-model="formItem.fee" placeholder="50000" class="radius">
          <span class="xem_container">gas</span>
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
          <div class="please_add_address" v-if="formItem.cosignerList.length == 0">{{$t('please_add_publickey')}}</div>

          <div class="list_item radius" v-for="(i,index) in formItem.cosignerList">
            <span class="address_alias">{{i.publickey}}</span>
            <span class="action">{{i.type == MultisigCosignatoryModificationType.Add ? $t('add'):$t('cut_back')}}</span>
            <img class="delate pointer" @click="removeCosigner(index)"
                 src="@/assets/images/service/multisig/multisigDelete.png" alt="">
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
    import Message from '@/message/Message.ts'
    import {Component, Vue, Watch} from 'vue-property-decorator'
    import {
        MultisigCosignatoryModificationType,
        MultisigCosignatoryModification,
        PublicAccount,
        Account,
        Listener,
        Address
    } from 'nem2-sdk'
    import {multisigInterface} from '@/interface/sdkMultisig.ts'
    import CheckPWDialog from '@/components/checkPW-dialog/CheckPWDialog.vue'

    @Component({
        components: {
            CheckPWDialog
        }
    })
    export default class MultisigManagement extends Vue {
        MultisigCosignatoryModificationType = MultisigCosignatoryModificationType
        showSubpublickeyList = false
        showCheckPWDialog = false
        currentAddress = ''
        currentMinApproval = 0
        currentCosignatoryList = []
        publickeyList = [
            {
                value: '',
                label: 'no data'
            }
        ]

        formItem = {
            minApproval: 0,
            minRemoval: 0,
            fee: 10000000,
            cosignerList: [],
            multisigPublickey: ''
        }


        addCosigner(flag) {
            this.formItem.cosignerList.push({
                publickey: this.currentAddress,
                type: flag
            })
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
            const {multisigPublickey, cosignerList, fee, minApproval, minRemoval} = this.formItem
            const {networkType} = this.$store.state.account.wallet
            const {generationHash, node} = this.$store.state.account
            const account = Account.createFromPrivateKey(privatekey, networkType)
            multisigInterface.completeCosignatoryModification({
                minApprovalDelta: minApproval,
                minRemovalDelta: minRemoval,
                networkType: networkType,
                account: account,
                generationHash: generationHash,
                node: node,
                fee: fee,
                multisigPublickey: multisigPublickey
            })

        }

        createBondedModifyTransaction(privatekey) {
            const {multisigPublickey, cosignerList, fee, minApproval, minRemoval} = this.formItem
            const {networkType} = this.$store.state.account.wallet
            const {generationHash, node} = this.$store.state.account
            const account = Account.createFromPrivateKey(privatekey, networkType)
            const multisigCosignatoryModificationList = cosignerList.map(cosigner => new MultisigCosignatoryModification(
                cosigner.type,
                PublicAccount.createFromPublicKey(cosigner.publickey, networkType),
            ))
            const listener = new Listener(node.replace('http', 'ws'), WebSocket)

            multisigInterface.multisetCosignatoryModification({
                minApprovalDelta: minApproval,
                minRemovalDelta: minRemoval,
                multisigCosignatoryModificationList: multisigCosignatoryModificationList,
                networkType: networkType,
                account: account,
                generationHash: generationHash,
                node: node,
                listener: listener,
                fee: fee,
                multisigPublickey: multisigPublickey
            })
        }


        checkEnd(privatekey) {
            if (this.currentMinApproval == 0) {
                return
            }
            if (this.currentMinApproval > 1 || this.currentCosignatoryList.length > 0) {
                this.createBondedModifyTransaction(privatekey);
                return
            }
            this.createCompleteModifyTransaction(privatekey);

        }

        checkForm(): boolean {
            const {multisigPublickey, cosignerList, fee, minApproval, minRemoval} = this.formItem

            if (!Number(minApproval) && minApproval !== 0) {
                this.$Notice.error({title: this.$t(Message.ILLEGAL_MIN_APPROVAL_ERROR) + ''})
                return false
            }

            if (!Number(minRemoval) && Number(minRemoval) !== 0) {
                this.$Notice.error({title: this.$t(Message.ILLEGAL_MIN_REMOVAL_ERROR) + ''})
                return false
            }

            if ((!Number(fee) || Number(fee) < 0) && fee !== 0) {
                this.$Notice.error({title: this.$t(Message.FEE_LESS_THAN_0_ERROR) + ''})
                return false
            }
            if (cosignerList.length < 1) {
                return true
            }

            const publickeyFlag = cosignerList.every((item) => {
                if (item.publickey.trim().length !== 64) {
                    this.$Notice.error({title: this.$t(Message.ILLEGAL_PUBLICKEY_ERROR) + ''})
                    return false;
                }
                return true;
            });
            return publickeyFlag
        }

        getMultisigAccountList() {
            const that = this
            const {address} = this.$store.state.account.wallet
            const {node} = this.$store.state.account

            multisigInterface.getMultisigAccountInfo({
                address,
                node
            }).then((result) => {
                console.log(result.result.multisigInfo)
                that.publickeyList = result.result.multisigInfo.multisigAccounts.map((item) => {
                    item.value = item.publicKey
                    item.label = item.publicKey
                    return item
                })
            })
        }

        @Watch('formItem.multisigPublickey')
        async onMultisigPublickeyChange() {
            console.log(this.formItem.multisigPublickey)
            const that = this
            const {multisigPublickey} = this.formItem
            const {networkType} = this.$store.state.account.wallet
            const {node} = this.$store.state.account
            let address = Address.createFromPublicKey(multisigPublickey, networkType).address
            multisigInterface.getMultisigAccountInfo({
                address,
                node
            }).then((result) => {
                const currentMultisigAccount = result.result.multisigInfo
                console.log(currentMultisigAccount.minApproval)
                that.currentMinApproval = currentMultisigAccount.minApproval
                that.currentCosignatoryList = currentMultisigAccount.cosignatories
            })

        }

        created() {
            this.getMultisigAccountList()
        }
    }
</script>
<style scoped lang="less">
  @import "MultisigManagement.less";
</style>
