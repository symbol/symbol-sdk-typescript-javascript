<template>
  <div class="transfer" @click="isShowSubAlias=false">


    <div class="address flex_center">
      <span class="title">{{$t('Public_account')}}</span>
      <span class="value radius flex_center">
              <Select placeholder="" v-model="multisigPublickey" :placeholder="$t('Public_account')" class="asset_type">
            <Option v-for="item in multisigPublickeyList" :value="item.value" :key="item.value">
              {{ item.label }}
            </Option>
           </Select>
            </span>
    </div>


    <div class="address flex_center">
      <span class="title">{{$t('transfer_target')}}</span>
      <span class="value radius flex_center">
              <input type="text" v-model="address" :placeholder="$t('receive_address_or_alias')">
            </span>
    </div>


    <div class="asset flex_center">
      <span class="title">{{$t('asset_type')}}</span>


      <span>
        <span class="type value radius flex_center">
          <Select v-model="mosaic" :placeholder="$t('asset_type')" class="asset_type">
            <Option v-for="item in mosaicList" :value="item.value" :key="item.value">
              {{ item.label }}
            </Option>
           </Select>
        </span>
        <span class="amount value radius flex_center">
           <input v-model="amount" :placeholder="$t('please_enter_the_transfer_amount')" type="text">
         </span>
      </span>


    </div>
    <div class="remark flex_center">
      <span class="title">{{$t('remarks')}}</span>
      <span class=" textarea_container  flex_center value radius ">
              <textarea class="hide_scroll" v-model="remark" :placeholder="$t('please_enter_a_comment')"></textarea>
            </span>
    </div>
    <div class="fee flex_center">
      <span class="title">{{$t('fee')}}</span>
      <span class="value radius flex_center">
              <input v-model="fee" placeholder="0.050000" type="text">
              <span class="uint">XEM</span>
            </span>
    </div>
    <span class="xem_tips">{{$t('the_more_you_set_the_cost_the_higher_the_processing_priority')}}</span>
    <div @click="checkInfo" class="send_button pointer">
      {{$t('send')}}
    </div>


    <CheckPWDialog @closeCheckPWDialog="closeCheckPWDialog" @checkEnd="checkEnd"
                   :showCheckPWDialog="showCheckPWDialog"></CheckPWDialog>
  </div>
</template>

<script lang="ts">
    import {
        Account,
        Mosaic,
        MosaicId,
        NetworkType,
        UInt64,
        TransferTransaction,
        PlainMessage,
        Address,
        Deadline,
        NamespaceId,
        Id,
        NamespaceMosaicIdGenerator,
        MultisigCosignatoryModification,
        PublicAccount,
        Deadline,
        Listener,
    } from 'nem2-sdk'
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import {accountInterface} from '@/interface/sdkAccount'
    import {mosaicInterface} from '@/interface/sdkMosaic'
    import {transactionInterface} from '@/interface/sdkTransaction'
    import {blockchainInterface} from '@/interface/sdkBlockchain'
    import CheckPWDialog from '@/components/checkPW-dialog/CheckPWDialog.vue'
    import Message from "@/message/Message";
    import {multisigInterface} from '@/interface/sdkMultisig'


    @Component({
        components: {
            CheckPWDialog
        }
    })
    export default class TransferTransactionCompoent extends Vue {
        showCheckPWDialog = false

        currentCosignatoryList = []
        multisigPublickeyList = []
        multisigPublickey = ''
        accountPublicKey = ''
        accountAddress = ''
        node = ''
        currentXem = ''
        address = 'SCSXIT-R36DCY-JRVSNE-NY5BUA-HXSL7I-E6ULEY-UYRC'
        mosaic: any = ''
        amount: any = '0'
        remark = ''
        fee: any = '10000000'
        generationHash = ''
        isShowSubAlias = false
        mosaicList = []
        currentMinApproval = 0

        get getWallet() {
            return this.$store.state.account.wallet
        }

        initForm() {
            this.fee = '10000000'
            this.remark = ''
            this.address = ''
            this.mosaic = ''
            this.amount = '0'
        }

        checkInfo() {
            if (!this.checkForm()) {
                return
            }
            this.showCheckPWDialog = true
        }

        sendTransaction(privatekey) {
            const that = this
            const {networkType} = this.$store.state.account.wallet
            const {generationHash, node} = this.$store.state.account
            const account = Account.createFromPrivateKey(privatekey, networkType)
            let {address, fee, mosaic, amount, remark,multisigPublickey} = this
            const listener = new Listener(node.replace('http', 'ws'), WebSocket)

            const transaction = TransferTransaction.create(
                Deadline.create(),
                Address.createFromRawAddress(address),
                [new Mosaic(new MosaicId(mosaic), UInt64.fromUint(amount))],
                PlainMessage.create(remark),
                networkType,
                UInt64.fromUint(fee)
            )

            multisigInterface.completeTransaction({
                networkType: networkType,
                account: account,
                generationHash: generationHash,
                node: node,
                fee: fee,
                multisigPublickey: multisigPublickey,
                transaction: transaction,
                listener: listener
            })

            // transactionInterface.transferTransaction({
            //     network: this.getWallet.networkType,
            //     MaxFee: fee,
            //     receive: address,
            //     MessageType: 0,
            //     mosaics: [new Mosaic(new MosaicId(mosaic), UInt64.fromUint(amount))],
            //     message: remark
            // }).then((transactionResult) => {
            //     // sign tx
            //     const transaction = transactionResult.result.transferTransaction
            //     // const transaction = tx
            //     console.log(transaction)
            //     const signature = account.sign(transaction, generationHash)
            //     // send tx
            //     transactionInterface.announce({signature, node}).then((announceResult) => {
            //         // get announce status
            //         announceResult.result.announceStatus.subscribe((announceInfo: any) => {
            //             console.log(signature)
            //             that.$Notice.success({
            //                 title: this.$t(Message.SUCCESS) + ''
            //             })
            //             that.initForm()
            //         })
            //     })
            //
            // })
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
                that.multisigPublickeyList = result.result.multisigInfo.multisigAccounts.map((item) => {
                    item.value = item.publicKey
                    item.label = item.publicKey
                    return item
                })
            })
        }

        @Watch('multisigPublickey')
        async onMultisigPublickeyChange() {
            const that = this
            const {multisigPublickey} = this
            const {networkType} = this.$store.state.account.wallet
            const {node} = this.$store.state.account
            let address = Address.createFromPublicKey(multisigPublickey, networkType).address
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
            const {address, mosaic, amount, remark, fee} = this
            if (address.length < 40) {
                this.showErrorMessage(this.$t(Message.ADDRESS_FORMAT_ERROR))
                return false
            }
            if (mosaic == '' || mosaic.trim() == '') {
                this.showErrorMessage(this.$t(Message.INPUT_EMPTY_ERROR))
                return false
            }
            if (!Number(amount) || Number(amount) < 0) {
                this.showErrorMessage(this.$t(Message.AMOUNT_LESS_THAN_0_ERROR))
                return false
            }
            if (fee < 0) {
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

        async getMosaicList() {
            const that = this
            let {accountPublicKey, currentXem, accountAddress, node, address, mosaic, amount, remark, fee} = this
            const {currentXEM1, currentXEM2} = this.$store.state.account
            let mosaicIdList = []
            await accountInterface.getAccountInfo({
                node,
                address: accountAddress
            }).then(async accountInfoResult => {
                await accountInfoResult.result.accountInfo.subscribe((accountInfo) => {
                    let mosaicList = []
                    mosaicIdList = accountInfo.mosaics.map(item => item.id)
                    // set mosaicList
                    mosaicList = mosaicIdList.map((item) => {
                        item.value = item.toHex()
                        if (item.value == currentXEM1 || item.value == currentXEM2) {
                            item.label = 'nem.xem'
                        } else {
                            item.label = item.toHex()
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

        getNamespace(currentXem, mosaicIdList, currentXEM1, currentXEM2, mosaicList) {
            let currentXEMHex = ''
            const that = this
            mosaicInterface.getMosaicByNamespace({
                namespace: currentXem
            }).then((result: any) => {
                let isCrrentXEMExists = true
                let spliceIndex = -1
                isCrrentXEMExists = mosaicIdList.every((item, index) => {
                    if (item.value == currentXEM1 || item.value == currentXEM2) {
                        spliceIndex = index
                        return false
                    }
                    return true
                })
                that.mosaicList = mosaicList
                that.mosaic = currentXEMHex
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
            } else {
                this.$Notice.error({
                    title: this.$t(Message.WRONG_PASSWORD_ERROR) + ''
                })
            }
        }


        @Watch('getWallet')
        onGetWalletChange() {
            this.initData()
            this.getMosaicList()
        }

        created() {
            // this.initForm()
            this.initData()
            this.getMosaicList()
            this.getMultisigAccountList()
        }

    }
</script>
<style scoped lang="less">
  @import "MultisigTransferTransaction.less";
</style>
