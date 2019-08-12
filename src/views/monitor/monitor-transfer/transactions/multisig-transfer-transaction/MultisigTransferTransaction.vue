<template>
  <div class="transfer" @click="isShowSubAlias=false">

    <div class="address flex_center">
      <span class="title">{{$t('Public_account')}}</span>
      <span class="value radius flex_center">
        <Select placeholder="" v-model="formItem.multisigPublickey" :placeholder="$t('Public_account')"
                class="asset_type">
         <Option v-for="item in multisigPublickeyList" :value="item.value" :key="item.value">{{ item.label }}</Option>
       </Select>
      </span>
    </div>


    <div class="address flex_center">
      <span class="title">{{$t('transfer_target')}}</span>
      <span class="value radius flex_center">
        <input type="text" v-model="formItem.address" :placeholder="$t('receive_address_or_alias')">
      </span>
    </div>


    <div class="asset flex_center">
      <span class="title">{{$t('asset_type')}}</span>
      <span>
        <span class="type value radius flex_center">
          <Select v-model="formItem.mosaic" :placeholder="$t('asset_type')" class="asset_type">
            <Option v-for="item in mosaicList" :value="item.value" :key="item.value">
              {{ item.label }}
            </Option>
           </Select>
        </span>
        <span class="amount value radius flex_center">
           <input v-model="formItem.amount" :placeholder="$t('please_enter_the_transfer_amount')" type="text">
         </span>
      </span>
    </div>

    <div class="remark flex_center">
      <span class="title">{{$t('remarks')}}</span>
      <span class=" textarea_container  flex_center value radius ">
              <textarea class="hide_scroll" v-model="formItem.remark"
                        :placeholder="$t('please_enter_a_comment')"></textarea>
            </span>
    </div>
    <div class="fee flex_center">
      <span class="title">{{$t('inner_fee')}}</span>
      <span class="value radius flex_center">
              <input v-model="formItem.aggregateFee" placeholder="50000" type="text">
              <span class="uint">gas</span>
            </span>

    </div>
    <span class="xem_tips">{{$t('the_more_you_set_the_cost_the_higher_the_processing_priority')}}</span>
    <span class="xem_tips">{{formItem.aggregateFee / 1000000}} xem </span>
    <div class="fee flex_center">
      <span class="title">{{$t('bonded_fee')}}</span>
      <span class="value radius flex_center">
              <input v-model="formItem.bondedFee" placeholder="50000" type="text">
              <span class="uint">gas</span>
            </span>

    </div>
    <span class="xem_tips">{{$t('the_more_you_set_the_cost_the_higher_the_processing_priority')}}</span>
    <span class="xem_tips">{{formItem.bondedFee / 1000000}} xem </span>

    <div v-if="currentMinApproval > 1">
      <div class="fee flex_center">
        <span class="title">{{$t('lock_fee')}}</span>
        <span class="value radius flex_center">
              <input v-model="formItem.lockFee" placeholder="50000" type="text">
              <span class="uint">gas</span>
            </span>
      </div>
      <span class="xem_tips">{{$t('the_more_you_set_the_cost_the_higher_the_processing_priority')}}</span>
      <span class="xem_tips">{{formItem.lockFee / 1000000}} xem </span>

    </div>


    <div @click="checkInfo" v-if="isShowPanel" class="send_button pointer">
      {{$t('send')}}
    </div>
    <div class=" no_multisign pointer" v-else>
      {{$t('There_are_no_more_accounts_under_this_account')}}
    </div>

    <CheckPWDialog :transactionDetail='transactionDetail' @closeCheckPWDialog="closeCheckPWDialog" @checkEnd="checkEnd"
                   :showCheckPWDialog="showCheckPWDialog"></CheckPWDialog>
  </div>
</template>

<script lang="ts">
    import {Message} from "@/config/index"
    import {accountInterface} from '@/interface/sdkAccount'
    import {multisigInterface} from '@/interface/sdkMultisig'
    import {Component, Vue, Watch} from 'vue-property-decorator'
    import {transactionInterface} from '@/interface/sdkTransaction'
    import CheckPWDialog from '@/common/vue/check-password-dialog/CheckPasswordDialog.vue'
    import {
        Account,
        Mosaic,
        MosaicId,
        UInt64,
        TransferTransaction,
        PlainMessage,
        Address,
        Deadline,
        Listener,
    } from 'nem2-sdk'

    @Component({
        components: {
            CheckPWDialog
        }
    })
    export default class TransferTransactionCompoent extends Vue {
        node = ''
        currentXem = ''
        isShowPanel = true
        accountAddress = ''
        generationHash = ''
        accountPublicKey = ''
        transactionDetail = {}
        currentMinApproval = 0
        isShowSubAlias = false
        showCheckPWDialog = false
        currentCosignatoryList = []
        mosaicList = [{
            label: 'no data',
            value: 'no data'
        }]
        multisigPublickeyList = [{
            label: 'no data',
            value: 'no data'
        }]
        formItem = {
            address: 'SCSXIT-R36DCY-JRVSNE-NY5BUA-HXSL7I-E6ULEY-UYRC',
            mosaic: '',
            amount: 0,
            remark: '',
            multisigPublickey: '',
            bondedFee: 10000000,
            lockFee: 10000000,
            aggregateFee: 10000000,
        }

        get getWallet() {
            return this.$store.state.account.wallet
        }

        initForm() {
            this.formItem = {
                address: '',
                mosaic: '',
                amount: 0,
                remark: '',
                multisigPublickey: '',
                bondedFee: 10000000,
                lockFee: 10000000,
                aggregateFee: 10000000,
            }
        }

        checkInfo() {
            if (!this.checkForm()) {
                return
            }
            this.showDialog()

        }

        showDialog() {
            const {address, mosaic, amount, remark, bondedFee, lockFee, aggregateFee, multisigPublickey} = this.formItem
            this.transactionDetail = {
                "transaction_type": 'Multisign_transfer',
                "Public_account": multisigPublickey,
                "transfer_target": address,
                "asset_type": mosaic,
                "quantity": amount,
                "fee": bondedFee + lockFee + aggregateFee + 'gas',
                "remarks": remark
            }
            this.showCheckPWDialog = true
        }

        sendTransaction(privatekey) {
            if (this.currentMinApproval == 0) {
                return
            }
            const that = this
            const {networkType} = this.$store.state.account.wallet
            const {generationHash, node} = this.$store.state.account
            const account = Account.createFromPrivateKey(privatekey, networkType)
            let {address, bondedFee, lockFee, aggregateFee, mosaic, amount, remark, multisigPublickey} = this.formItem
            const listener = new Listener(node.replace('http', 'ws'), WebSocket)
            const transaction = TransferTransaction.create(
                Deadline.create(),
                Address.createFromRawAddress(address),
                [new Mosaic(new MosaicId(mosaic), UInt64.fromUint(amount))],
                PlainMessage.create(remark),
                networkType,
                UInt64.fromUint(aggregateFee)
            )

            if (this.currentMinApproval > 1) {
                multisigInterface.bondedMultisigTransaction({
                    networkType: networkType,
                    account: account,
                    fee: bondedFee,
                    multisigPublickey: multisigPublickey,
                    transaction: [transaction],
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
                return
            }
            multisigInterface.completeMultisigTransaction({
                networkType: networkType,
                fee: aggregateFee,
                multisigPublickey: multisigPublickey,
                transaction: [transaction],
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

        getMultisigAccountList() {
            const that = this
            const {address} = this.$store.state.account.wallet
            const {node} = this.$store.state.account

            multisigInterface.getMultisigAccountInfo({
                address,
                node
            }).then((result) => {
                if (result.result.multisigInfo.multisigAccounts.length == 0) {
                    that.isShowPanel = false
                    return
                }
                that.multisigPublickeyList = result.result.multisigInfo.multisigAccounts.map((item) => {
                    item.value = item.publicKey
                    item.label = item.publicKey
                    return item
                })
            })
        }

        @Watch('formItem.multisigPublickey')
        async onMultisigPublickeyChange() {
            const that = this
            const {multisigPublickey} = this.formItem
            const {node} = this.$store.state.account
            const {networkType} = this.$store.state.account.wallet
            let address = Address.createFromPublicKey(multisigPublickey, networkType)['address']
            await this.getMosaicList(address)

            multisigInterface.getMultisigAccountInfo({
                address,
                node
            }).then((result) => {
                const currentMultisigAccount = result.result.multisigInfo
                that.currentMinApproval = currentMultisigAccount.minApproval
                that.currentCosignatoryList = currentMultisigAccount.cosignatories
            })
        }


        checkForm() {
            const {address, mosaic, amount, remark, bondedFee, lockFee, aggregateFee, multisigPublickey} = this.formItem

            // multisig check
            if (multisigPublickey.length !== 64) {
                this.showErrorMessage(this.$t(Message.ILLEGAL_PUBLICKEY_ERROR))
                return false
            }
            if (address.length < 40) {
                this.showErrorMessage(this.$t(Message.ADDRESS_FORMAT_ERROR))
                return false
            }
            if (mosaic == '' || mosaic.trim() == '') {
                this.showErrorMessage(this.$t(Message.INPUT_EMPTY_ERROR))
                return false
            }
            if ((!Number(amount) && Number(amount) !== 0) || Number(amount) < 0) {
                this.showErrorMessage(this.$t(Message.AMOUNT_LESS_THAN_0_ERROR))
                return false
            }

            if ((!Number(aggregateFee) && Number(aggregateFee) !== 0) || Number(aggregateFee) < 0) {
                this.showErrorMessage(this.$t(Message.FEE_LESS_THAN_0_ERROR))
                return false
            }

            if ((!Number(bondedFee) && Number(bondedFee) !== 0) || Number(bondedFee) < 0) {
                this.showErrorMessage(this.$t(Message.FEE_LESS_THAN_0_ERROR))
                return false
            }
            if ((!Number(lockFee) && Number(lockFee) !== 0) || Number(lockFee) < 0) {
                this.showErrorMessage(this.$t(Message.FEE_LESS_THAN_0_ERROR))
                return false
            }
            return true
        }

        showErrorMessage(message) {
            this.$Notice.destroy()
            this.$Notice.error({
                title: message
            })
        }

        async getMosaicList(accountAddress) {
            const that = this
            const {node, currentXem} = this
            const {currentXEM1, currentXEM2} = this.$store.state.account
            let mosaicIdList = []
            await accountInterface.getAccountInfo({
                node,
                address: accountAddress
            }).then(async accountInfoResult => {
                await accountInfoResult.result.accountInfo.subscribe((accountInfo) => {
                    let mosaicList = []
                    // set mosaicList
                    mosaicList = accountInfo.mosaics.map((item) => {
                        item._amount = item.amount.compact()
                        item.value = item.id.toHex()
                        if (item.value == currentXEM1 || item.value == currentXEM2) {
                            item.label = 'nem.xem' + ' (' + item._amount + ')'
                        } else {
                            item.label = item.id.toHex() + ' (' + item._amount + ')'
                        }
                        return item
                    })
                    let isCrrentXEMExists = mosaicList.every((item) => {
                        if (item.value == currentXEM1 || item.value == currentXEM2) {
                            return false
                        }
                        return true
                    })
                    if (isCrrentXEMExists) {
                        mosaicList.unshift({
                            value: currentXEM1,
                            label: 'nem.xem'
                        })
                    }
                    that.mosaicList = mosaicList
                }, () => {
                    let mosaicList = []
                    mosaicList.unshift({
                        value: currentXEM1,
                        label: 'nem.xem'
                    })
                    that.mosaicList = mosaicList
                })
            })
        }

        initData() {
            this.accountPublicKey = this.getWallet.publicKey
            this.accountAddress = this.getWallet.address
            this.node = this.$store.state.account.node
            this.currentXem = this.$store.state.account.currentXem
            this.generationHash = this.$store.state.account.generationHash
        }

        closeCheckPWDialog() {
            this.showCheckPWDialog = false
        }

        checkEnd(key) {
            if (key) {
                this.sendTransaction(key)
                return
            }
            this.showErrorMessage(this.$t(Message.WRONG_PASSWORD_ERROR) + '')
        }


        @Watch('getWallet')
        onGetWalletChange() {
            this.initData()
        }

        created() {
            this.initData()
            this.getMultisigAccountList()
        }

    }
</script>
<style scoped lang="less">
  @import "MultisigTransferTransaction.less";
</style>
