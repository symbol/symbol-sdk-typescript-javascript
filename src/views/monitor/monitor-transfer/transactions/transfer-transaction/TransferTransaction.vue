<template>
  <div class="transfer" @click="isShowSubAlias=false">
    <Alert v-if="showAlert" type="success" show-icon closable>
      success
    </Alert>

    <div class="address flex_center">
      <span class="title">{{$t('transfer_target')}}</span>
      <span class="value radius flex_center">
              <input type="text" v-model="address" :placeholder="$t('receive_address_or_alias')">
        <!--              <span class="pointer" @click.stop="isShowSubAlias =!isShowSubAlias">@</span>-->
        <!--               <div v-if="isShowSubAlias" class="selections">-->
        <!--            </div>-->
            </span>
    </div>
    <div class="asset flex_center">
      <span class="title">{{$t('asset_type')}}</span>


      <span>
        <span class="type value radius flex_center">
          <Select placeholder="XEM" v-model="mosaic" class="asset_type">
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
        NamespaceMosaicIdGenerator
    } from 'nem2-sdk'
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import {accountInterface} from '@/interface/sdkAccount'
    import {mosaicInterface} from '@/interface/sdkMosaic'
    import {transactionInterface} from '@/interface/sdkTransaction'
    import {blockchainInterface} from '@/interface/sdkBlockchain'
    import CheckPWDialog from '@/components/checkPW-dialog/CheckPWDialog.vue'
    import Message from "@/message/Message";


    @Component({
        components: {
            CheckPWDialog
        }
    })
    export default class TransferTransactionCompoent extends Vue {
        showCheckPWDialog = false
        showAlert = false

        accountPublicKey = ''
        accountAddress = ''
        node = ''
        currentXem = ''

        address = 'SCSXIT-R36DCY-JRVSNE-NY5BUA-HXSL7I-E6ULEY-UYRC'
        mosaic: any = ''
        amount: any = '0'
        remark = ''
        fee: any = '0'
        generationHash = ''

        isShowSubAlias = false
        mosaicList = []

        get getWallet () {
            return this.$store.state.account.wallet
        }

        initForm() {
            this.fee = '0'
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

        sendTransaction(key) {
            const that = this
            let { accountPublicKey, accountAddress, node, address, mosaic, amount, remark, fee, generationHash} = this

            //test data--
            const account = Account.createFromPrivateKey(key, NetworkType.MIJIN_TEST)
            //--test data
            // create tx
            const mosaics = mosaic ? [new Mosaic(new MosaicId(mosaic), UInt64.fromUint(amount))] : []
            const transferTransaction = transactionInterface.transferTransaction({
                network: NetworkType.MIJIN_TEST,
                MaxFee: fee,
                receive: address,
                MessageType: 0,
                mosaics: [new Mosaic(new MosaicId(mosaic), UInt64.fromUint(amount))],
                message: remark
            }).then((transactionResult) => {
                // sign tx
                const transaction = transactionResult.result.transferTransaction
                // const transaction = tx
                const signature = account.sign(transaction, generationHash)
                // send tx
                transactionInterface.announce({signature, node}).then((announceResult) => {
                    // get announce status
                    announceResult.result.announceStatus.subscribe((announceInfo: any) => {
                        console.log(signature)
                        that.$Message.success(Message.SUCCESS)
                        that.manageAlert(Message.SUCCESS)
                        that.initForm()
                    })
                })

            })
        }

        checkForm() {
            const {address, mosaic, amount, remark, fee} = this
            if (address.length < 40) {
                this.showErrorMessage(Message.ADDRESS_FORMAT_ERROR)
                return false
            }
            if (amount < 0) {
                this.showErrorMessage(Message.AMOUNT_LESS_THAN_0_ERROR)
                return false
            }
            if (fee < 0) {
                this.showErrorMessage(Message.FEE_LESS_THAN_0_ERROR)
                return false
            }
            return true
        }

        showErrorMessage(message) {
            this.$Message.destroy()
            this.$Message.error(message)
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
                        item.label = item.toHex()
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
                            label:'nem.xem'
                        })
                    }
                    // get namespace
                    // mosaicInterface.getMosaicsNames({
                    //     node,
                    //     mosaicIds: m
                    // }).then((mosaicsNamesResult: any) => {
                    //     mosaicsNamesResult.result.mosaicsNamesInfos.subscribe((mosaicsNamesInfo) => {
                    //         mosaicsNamesInfo.forEach(item => {
                    //             item.value = item.mosaicId.toHex()
                    //             // no namespace
                    //             if (item.names.length == 0) {
                    //                 item.label = item.value
                    //                 mosaicList.push(item)
                    //             } else {
                    //                 // 1 or more namespace
                    //                 item.names.forEach(nameItem => {
                    //                     item.label = nameItem.name
                    //                     mosaicList.push(item)
                    //                 })
                    //             }
                    //         })
                    //         that.mosaicList = mosaicList
                    //     })
                    // }).catch(()=>{
                    //     console.log('no alias in namespace')
                    // })


                    // get nem.xem
                    this.getNamespace (currentXem, mosaicIdList , currentXEM1, currentXEM2, mosaicList)


                    // get cuurent xem   cat.currency
                    // let currentXEMHex = ''
                    // cat.currecy error
                    // mosaicInterface.getcurrentXEM({node}).then((result: any) => {
                    //     let id = result.result.currentXEM.id.id
                    //     const uintArray = [id.lower, id.higher]
                    //     currentXEMHex = new Id(uintArray).toHex()
                    //     let isCrrentXEMExists = true
                    //     isCrrentXEMExists = mosaicIdList.every((item) => {
                    //         if (item.value == currentXEMHex) {
                    //             return false
                    //         }
                    //         return true
                    //     })
                    //     if (isCrrentXEMExists) {
                    //         mosaicIdList.push({
                    //             label: result.result.currentXEM.id.fullName,
                    //             value: currentXEMHex
                    //         })
                    //     }
                    //     that.mosaicList = mosaicIdList
                    // })


                },()=>{
                    let mosaicIdList = [this.currentXem]
                    let mosaicList = [{value:this.currentXem,label:this.currentXem}]
                    this.getNamespace (currentXem, mosaicIdList , currentXEM1, currentXEM2, mosaicList)
                })
            })
        }

        getNamespace (currentXem, mosaicIdList , currentXEM1, currentXEM2, mosaicList) {
            let currentXEMHex = ''
            const that = this
            mosaicInterface.getMosaicByNamespace({
                namespace: currentXem
            }).then((result: any) => {
                currentXEMHex = result.result.mosaicId.toHex()
                let isCrrentXEMExists = true
                let spliceIndex = -1
                isCrrentXEMExists = mosaicIdList.every((item, index) => {

                    if (item.value == currentXEM1) {
                        spliceIndex = index
                        return false
                    }
                    if (item.value == currentXEM2) {
                        spliceIndex = index
                        return false
                    }
                    return true
                })
                if (!isCrrentXEMExists) {
                    mosaicList.splice(spliceIndex, 1)
                    mosaicList.push({
                        label: currentXem,
                        value: currentXEMHex
                    })
                }
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
                this.$Message.error(Message.WRONG_PASSWORD_ERROR)
            }
        }

        manageAlert(status) {
            this.showAlert = true
            const that = this
            setInterval(() => {
                that.showAlert = false
            }, 3000)
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
        }

    }
</script>
<style scoped lang="less">
  @import "TransferTransaction.less";
</style>
