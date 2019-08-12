<template>
  <div class="mosaicList ">
    <div class="mosaicListBody scroll">
      <div class="listTit">
        <Row>
          <Col span="1">&nbsp;</Col>
          <Col span="5">{{$t('mosaic_ID')}}</Col>
          <Col span="4">{{$t('available_quantity')}}</Col>
          <Col span="2">{{$t('mosaic_divisibility')}}</Col>
          <Col span="2">{{$t('transportability')}}</Col>
          <Col span="2">{{$t('variable_supply')}}</Col>
          <Col span="3">{{$t('effective_time')}}</Col>
          <Col span="3">{{$t('alias')}}</Col>
          <Col span="2"></Col>
        </Row>
      </div>
      <Spin v-if="isLoadingConfirmedTx" size="large" fix class="absolute"></Spin>
      <div class="no_data" v-if="mosaicMapInfo.length == 0">{{$t('no_data')}}</div>
      <div class="listItem" v-if="key !== 'length'" v-for="(value,key,index) in mosaicMapInfo">
        <Row>
          <Col span="1">&nbsp;</Col>
          <Col span="5">{{value.hex}}</Col>
          <Col span="4">{{value.supply}}</Col>
          <Col span="2" style="padding-left: 20px"> {{value.divisibility}}</Col>
          <Col span="2">{{value.transferable}}</Col>
          <Col span="2">{{value.supplyMutable}}</Col>
          <Col span="3">{{computeDuration(value) <=0 ? $t('overdue') : (computeDuration(value) === 'Forever'?  $t('forever') : computeDuration(value))}}</Col>
          <Col span="3">{{value.name?value.name:'null'}}</Col>
          <Col span="2">
            <div class="listFnDiv" v-if="computeDuration(value) > 0 || computeDuration(value) === 'Forever'">
              <Poptip placement="bottom">
                <i class="moreFn"></i>
                <div slot="content" class="updateFn">
                  <p class="fnItem" @click="showEditDialog(value)" v-if="value.supplyMutable">
                    <i><img src="@/common/img/service/updateMsaioc.png"></i>
                    <span class="">{{$t('modify_supply')}}</span>
                  </p>
                  <p class="fnItem" @click="showAliasDialog(value)">
                    <i><img src="@/common/img/service/setAlias.png"></i>
                    <span>{{$t('binding_alias')}}</span>
                  </p>
                  <p class="fnItem" @click="showUnAliasDialog(value)" v-if="value.name">
                    <i><img src="@/common/img/service/clearAlias.png"></i>
                    <span>{{$t('unbind')}}</span>
                  </p>
                </div>
              </Poptip>
            </div>
          </Col>
        </Row>
      </div>
    </div>
    <MosaicAliasDialog :showMosaicAliasDialog="showMosaicAliasDialog" :itemMosaic="selectedMosaic" @closeMosaicAliasDialog="closeMosaicAliasDialog"></MosaicAliasDialog>
    <MosaicUnAliasDialog :showMosaicUnAliasDialog="showMosaicUnAliasDialog" :itemMosaic="selectedMosaic" @closeMosaicUnAliasDialog="closeMosaicUnAliasDialog"></MosaicUnAliasDialog>
    <EditDialog :showMosaicEditDialog="showMosaicEditDialog" :itemMosaic="selectedMosaic" @closeMosaicEditDialog="closeMosaicEditDialog"></EditDialog>
  </div>
</template>

<script lang="ts">
    import {MosaicId} from "nem2-sdk"
    import {mosaicInterface} from '@/interface/sdkMosaic.ts'
    import {accountInterface} from '@/interface/sdkAccount.ts'
    import {Component, Vue, Watch} from 'vue-property-decorator'
    import EditDialog from './mosaic-edit-dialog/MosaicEditDialog.vue'
    import MosaicAliasDialog from './mosaic-alias-dialog/MosaicAliasDialog.vue'
    import MosaicUnAliasDialog from './mosaic-unAlias-dialog/mosaicUnAliasDialog.vue'

    @Component({
        components:{
            MosaicAliasDialog,
            MosaicUnAliasDialog,
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
        showMosaicUnAliasDialog = false
        accountPublicKey = ''
        accountAddress = ''
        node = ''
        generationHash = ''
        currentXem = ''
        currentXEM2: string
        currentXEM1: string
        mosaicMapInfo: any = {}
        selectedMosaic: any = {}

        get getWallet() {
            return this.$store.state.account.wallet
        }

        get ConfirmedTxList () {
            return this.$store.state.account.ConfirmedTx
        }

        get nowBlockHeihgt () {
            return this.$store.state.app.chainStatus.currentHeight
        }

        get namespaceList () {
            return this.$store.state.account.namespace
        }

        showCheckDialog() {
            this.showCheckPWDialog = true
        }

        closeCheckPWDialog() {
            this.showCheckPWDialog = false
        }

        showAliasDialog(item) {
            document.body.click()
            this.selectedMosaic = item
            setTimeout(() => {
                this.showMosaicAliasDialog = true
            })
        }
        showUnAliasDialog(item) {
            document.body.click()
            this.selectedMosaic = item
            setTimeout(() => {
                this.showMosaicUnAliasDialog = true
            })
        }

        closeMosaicAliasDialog() {
            this.showMosaicAliasDialog = false
        }
        closeMosaicUnAliasDialog() {
            this.showMosaicUnAliasDialog = false
        }

        showEditDialog(item) {
            document.body.click()
            this.selectedMosaic = item
            setTimeout(() => {
                this.showMosaicEditDialog = true
            }, 0)
        }

        closeMosaicEditDialog(item) {
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
                await accountInfoResult.result.accountInfo.subscribe(async (accountInfo) => {
                    let mosaicList = accountInfo.mosaics
                    const mosaicIdList = mosaicList.map((item) => {
                        return item.id
                    })
                    await mosaicInterface.getMosaics({
                        node,
                        mosaicIdList
                    }).then((mosacListResult: any) => {
                        mosacListResult.result.mosaicsInfos.subscribe(async (mosaicListInfo: any) => {
                            let mosaicMapInfo: any = {}
                            let existMosaics: any = []
                            mosaicMapInfo.length = 0
                            mosaicListInfo.forEach((item) => {
                                if (item.owner.publicKey !== accountPublicKey) {
                                    return
                                }
                                item.hex = item.mosaicId.id.toHex().toUpperCase()
                                item.supply = item.supply.compact()
                                item.supplyMutable = item.properties.supplyMutable
                                item._divisibility = item.properties.divisibility
                                item.transferable = item.properties.transferable
                                if(that.computeDuration(item) === 'Forever' || that.computeDuration(item) > 0){
                                    existMosaics.push(new MosaicId(item.hex))
                                }
                                mosaicMapInfo.length += 1
                                if (item.mosaicId.id.toHex() == that.currentXEM1 || item.mosaicId.id.toHex() == that.currentXEM2) {
                                    item.name = currentXem
                                }else {
                                    item.name = ''
                                }
                                mosaicMapInfo[item.hex] = item
                            })
                             await mosaicInterface.getMosaicsNames({
                                node,
                                mosaicIds: [new MosaicId('1674FC62BD449C16')]
                            }).then((mosacListResult: any) => {
                                mosacListResult.result.mosaicsNamesInfos.subscribe((mosaicsName: any)=>{
                                    console.log(mosaicsName)
                                })
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

        computeDuration (item) {
            let continuousTime
            if(item.properties.duration.compact() === 0){
                continuousTime = 'Forever'
            }else{
                continuousTime =(item.height.compact() + item.properties.duration.compact()) - this.nowBlockHeihgt
            }

            return continuousTime
        }

        @Watch('getWallet')
        onGetWalletChange() {
            this.initData()
            this.getMosaicList()
        }

        @Watch('ConfirmedTxList')
        onConfirmedTxChange() {
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
