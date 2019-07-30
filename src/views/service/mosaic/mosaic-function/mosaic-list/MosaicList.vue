<template>
  <div class="mosaicList ">
    <div class="mosaicListBody scroll">
      <div class="listTit">
        <Row>
          <Col span="1">&nbsp;</Col>
          <Col span="5">{{$t('mosaic_ID')}}</Col>
          <Col span="4">{{$t('available_quantity')}}</Col>
          <Col span="3">{{$t('transportability')}}</Col>
          <Col span="3">{{$t('variable_supply')}}</Col>
          <Col span="3">{{$t('effective_time')}}</Col>
          <Col span="3">{{$t('alias')}}</Col>
          <Col span="2"></Col>
        </Row>
      </div>
      <Spin v-if="isLoadingConfirmedTx" size="large" fix class="absolute"></Spin>

      <div class="no_data" v-if="mosaicMapInfo.length == 0">{{$t('no_data')}}</div>
      <div class="listItem" v-for="(value,key,index) in mosaicMapInfo">
        <Row>
          <Col span="1">&nbsp;</Col>
          <Col span="5">{{value.hex}}</Col>
          <Col span="4">{{value.supply}}</Col>
          <Col span="3">{{value.transferable}}</Col>
          <Col span="3">{{value.supplyMutable}}</Col>
          <Col span="3">{{value._duration}}</Col>
          <Col span="3">null</Col>
          <Col span="2">
            <div class="listFnDiv">
              <Poptip placement="bottom">
                <i class="moreFn"></i>
                <div slot="content" class="updateFn">
                  <p class="fnItem" @click="showEditDialog">
                    <i><img src="../../../../../assets/images/service/updateMsaioc.png"></i>
                    <span class="">{{$t('modify_supply')}}</span>
                  </p>
                  <p class="fnItem" @click="showAliasDialog">
                    <i><img src="../../../../../assets/images/service/setAlias.png"></i>
                    <span>{{$t('binding_alias')}}</span>
                  </p>
                  <p class="fnItem">
                    <i><img src="../../../../../assets/images/service/clearAlias.png"></i>
                    <span>{{$t('unbind')}}</span>
                  </p>
                </div>
              </Poptip>
            </div>
          </Col>
        </Row>
      </div>
    </div>
    <MosaicAliasDialog :showMosaicAliasDialog="showMosaicAliasDialog" @closeMosaicAliasDialog="closeMosaicAliasDialog"></MosaicAliasDialog>
    <EditDialog :showMosaicEditDialog="showMosaicEditDialog" @closeMosaicEditDialog="closeMosaicEditDialog"></EditDialog>
  </div>
</template>

<script lang="ts">
    import {transactionInterface} from '@/interface/sdkTransaction'
    import {Component, Vue, Watch} from 'vue-property-decorator'
    import {MosaicId, MosaicNonce, PublicAccount, NetworkType, Account} from 'nem2-sdk'
    import {mosaicInterface} from '@/interface/sdkMosaic.ts'
    import {accountInterface} from '@/interface/sdkAccount.ts';
    import {formatSeconds} from '@/utils/util.js'
    import MosaicAliasDialog from './mosaic-alias-dialog/MosaicAliasDialog.vue'
    import EditDialog from './mosaic-edit-dialog/MosaicEditDialog.vue'
    import CheckPWDialog from '@/components/checkPW-dialog/CheckPWDialog.vue'
    import Message from "@/message/Message";

    @Component({
        components:{
            MosaicAliasDialog,
            EditDialog
        }
    })
    export default class MosaicList extends Vue {
        isLoadingConfirmedTx = true
        currentTab: number = 0
        rootNameList: any[] = []
        showCheckPWDialog = false
        showMosaicEditDialog = false
        showMosaicAliasDialog = false
        accountPublicKey = ''
        accountAddress = ''
        node = ''
        generationHash = ''
        currentXem = ''
        currentXEM2: string
        currentXEM1: string
        mosaicMapInfo: any = {}

        get getWallet() {
            return this.$store.state.account.wallet
        }

        showCheckDialog() {
            this.showCheckPWDialog = true
        }

        closeCheckPWDialog() {
            this.showCheckPWDialog = false
        }

        showAliasDialog() {
            document.body.click()
            setTimeout(() => {
                this.showMosaicAliasDialog = true
            })
        }

        closeMosaicAliasDialog() {
            this.showMosaicAliasDialog = false
        }

        showEditDialog() {
            document.body.click()
            setTimeout(() => {
                this.showMosaicEditDialog = true
            }, 0)
        }

        closeMosaicEditDialog() {
            this.showMosaicEditDialog = false
        }



        initData() {
            this.accountPublicKey = this.getWallet.publicKey
            this.accountAddress = this.getWallet.address
            this.node = this.$store.state.account.node
            this.generationHash = this.$store.state.account.generationHash
            this.$store.state.app.isInLoginPage = false
            this.currentXEM2 = this.$store.state.account.currentXEM2
            this.currentXEM1 = this.$store.state.account.currentXEM1
            this.currentXem = this.$store.state.account.currentXem
        }



        async getMosaicList() {
            const that = this
            let {accountPublicKey, accountAddress, node, currentXem} = this
            await accountInterface.getAccountInfo({
                node,
                address: accountAddress
            }).then(async accountInfoResult => {
                await accountInfoResult.result.accountInfo.subscribe((accountInfo) => {
                    let mosaicList = accountInfo.mosaics
                    const mosaicIdList = mosaicList.map((item) => {
                        return item.id
                    })
                    mosaicInterface.getMosaics({
                        node,
                        mosaicIdList
                    }).then((mosacListResult: any) => {
                        mosacListResult.result.mosaicsInfos.subscribe((mosaicListInfo: any) => {
                            let mosaicMapInfo: any = {}
                            mosaicListInfo.forEach((item) => {
                                if (item.owner.publicKey !== accountPublicKey) {
                                    return
                                }
                                item.hex = item.mosaicId.id.toHex()
                                item.supply = item.supply.compact()
                                item.supplyMutable = item.properties.supplyMutable
                                item._divisibility = item.properties.divisibility
                                item.transferable = item.properties.transferable
                                item._duration = item.properties.duration.compact()
                                if (item.mosaicId.id.toHex() == that.currentXEM2 || item.mosaicId.id.toHex() == that.currentXEM2) {
                                    item.name = currentXem
                                    mosaicMapInfo[item.name] = item
                                }
                                item.name = item.mosaicId.id.toHex()
                                mosaicMapInfo[item.name] = item
                            })
                            that.mosaicMapInfo = mosaicMapInfo
                            that.isLoadingConfirmedTx = false
                        })
                    })
                },() => {
                    that.mosaicMapInfo = []
                    that.isLoadingConfirmedTx = false
                    console.log('monitor panel error getMosaicList')
                })
            })
        }

        @Watch('getWallet')
        onGetWalletChange() {
            this.initData()
            this.getMosaicList()
        }

        created() {
            this.initData()
            this.getMosaicList()
        }
    }
</script>
<style scoped lang="less">
  @import "MosaicList.less";
</style>
