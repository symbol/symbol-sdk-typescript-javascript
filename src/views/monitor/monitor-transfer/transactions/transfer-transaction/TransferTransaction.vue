<template>
  <div class="transfer" @click="isShowSubAlias=false">
    <div class="address flex_center">
      <span class="title">{{$t('transfer_target')}}</span>
      <span class="value radius flex_center">
              <input type="text" v-model="address" :placeholder="$t('receive_address_or_alias')">
              <span class="pointer" @click.stop="isShowSubAlias =!isShowSubAlias">@</span>
               <div v-if="isShowSubAlias" class="selections">
              <div class="pointer">@q.w.e</div>
              <div>@qq.ww.ee</div>
              <div>@qqqqw.eeeer.ttt</div>
            </div>
            </span>
    </div>

    <div class="asset flex_center">
      <span class="title">{{$t('asset_type')}}</span>
      <span class="value radius flex_center">
        <Select placeholder="XEM" v-model="mosaic" class="asset_type">
          <Option v-for="item in mosaicList" :value="item.value" :key="item.value">
            {{ item.label }}
          </Option>
         </Select>
      </span>
    </div>
    <div class="amount flex_center">
      <span class="title">{{$t('transfer_amount')}}</span>
      <span class="value radius flex_center">
              <input v-model="amount" :placeholder="$t('please_enter_the_transfer_amount')" type="text">
            </span>
    </div>
    <div class="remark flex_center">
      <span class="title">{{$t('remarks')}}</span>
      <span class=" textarea_container flex_center value radius ">
              <textarea v-model="remark" :placeholder="$t('please_enter_a_comment')"></textarea>
            </span>
    </div>
    <div class="fee flex_center">
      <span class="title">{{$t('fee')}}</span>
      <span class="value radius flex_center">
              <input v-model="fee" placeholder="0.050000" type="text">
              <span class="uint">XEM</span>
            </span>
    </div>
    <span class="xem_tips">{{$t('the_default_is')}}：0.05000XEM，{{$t('the_more_you_set_the_cost_the_higher_the_processing_priority')}}</span>
    <div @click="sendTransaction" class="send_button pointer">
      {{$t('send')}}
    </div>
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
    import {accountInterface} from '@/interface/sdkAccount'
    import {mosaicInterface} from '@/interface/sdkMosaic'
    import {aliasInterface} from '@/interface/sdkNamespace'
    import {transactionInterface} from '@/interface/sdkTransaction'
    import {blockchainInterface} from '@/interface/sdkBlockchain'
    import {Component, Vue} from 'vue-property-decorator';

    @Component
    export default class TransferTransactionCompoent extends Vue {
        accountPrivateKey = ''
        accountPublicKey = ''
        accountAddress = ''
        node = ''
        currentXem = ''

        address = 'SCSXIT-R36DCY-JRVSNE-NY5BUA-HXSL7I-E6ULEY-UYRC'
        mosaic: any = ''
        amount: any = '0'
        remark = ''
        fee: any = '0.050000'
        generationHash = ''

        isShowSubAlias = false
        mosaicList = []

        sendTransaction() {
            let {accountPrivateKey, accountPublicKey, accountAddress, node, address, mosaic, amount, remark, fee, generationHash} = this

            //test data--
            const account = Account.createFromPrivateKey(accountPrivateKey, NetworkType.MIJIN_TEST)
            //--test data
            // create tx
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
                    })
                })

            })
        }


        async getMosaicList() {
            const that = this
            let {accountPrivateKey, accountPublicKey, currentXem, accountAddress, node, address, mosaic, amount, remark, fee} = this
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
                    let currentXEMHex = ''
                    mosaicInterface.getMosaicByNamespace({
                        currentXem
                    }).then((result: any) => {
                        currentXEMHex = result.result.mosaicId.toHex()
                        let isCrrentXEMExists = true
                        isCrrentXEMExists = mosaicIdList.every((item) => {
                            console.log(item.value, currentXEMHex)
                            if (item.value == currentXEMHex) {
                                return false
                            }
                            return true
                        })
                        if (isCrrentXEMExists) {
                            mosaicList.push({
                                label: currentXem,
                                value: currentXEMHex
                            })
                        }
                        that.mosaicList = mosaicList
                        that.mosaic = currentXEMHex

                    })


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


                })
            })
        }

        async getGenerateHash() {
            const that = this
            let {accountPrivateKey, accountPublicKey, accountAddress, node, address, mosaic, amount, remark, fee} = this
            await blockchainInterface.getBlockByHeight({
                height: 1,
                node
            }).then(async (blockReasult: any) => {
                await blockReasult.result.Block.subscribe((blockInfo) => {
                    that.generationHash = blockInfo.generationHash
                })
            }).catch(() => {
                console.log('generationHash  null')
            })
        }

        initData() {
            this.accountPrivateKey = this.$store.state.account.accountPrivateKey
            this.accountPublicKey = this.$store.state.account.accountPublicKey
            this.accountAddress = this.$store.state.account.accountAddress
            this.node = this.$store.state.account.node
            this.currentXem = this.$store.state.account.currentXem
        }

        created() {
            this.initData()
            this.getMosaicList()
            this.getGenerateHash()
        }

    }
</script>
<style scoped lang="less">
  @import "TransferTransaction.less";
</style>
