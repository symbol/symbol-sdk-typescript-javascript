<template>
  <div class="monitor_panel_container">
    <div class="monitor_panel_left_container" ref="monitorPanelLeftContainer">
      <div class="top_wallet_address radius">
        <div class="wallet_address">
          <span class="address">
            {{address}}
          </span>
          <img class="pointer" @click="copyAddress"
               src="@/common/img/monitor/monitorCopyAddress.png" alt="">
        </div>

        <div class="split"></div>
        <div class="XEM_amount"><span>XEM</span><span class="amount">{{formatXEMamount(XEMamount.toString())}}</span>
        </div>
        <div class="exchange">${{(XEMamount*currentPrice).toFixed(2)}}</div>

        <div class="account_alias" v-show="isShowAccountAlias">
          {{$t('alias')}}：wallet.name
        </div>
      </div>
      <div class="bottom_account_info radius" ref="bottomAccountInfo">
        <div v-if="isShowAccountInfo" class="mosaicListWrap">
          <Spin v-if="isLoadingMosaic" size="large" fix class="absolute"></Spin>
          <Tabs size="small" v-if="!isShowManageMosaicIcon">
            <TabPane :label="$t('assets')" name="name1">
              <img @click="manageMosaicList()" class="asset_list pointer"
                   src="@/common/img/monitor/monitorAssetList.png">
              <!--        all       -->
              <div class="mosaicList">
                <div class="mosaic_data" v-if="value.show" v-for="(value,key,index) in mosaicMap"
                     :key="index">
                <span class="img_container">
                    <img v-if="index == 0" src="@/common/img/monitor/monitorMosaicIcon.png" alt="">
                    <img v-else src="@/common/img/monitor/mosaicDefault.png" alt="">
                </span>
                  <span class="mosaic_name">{{value.name || value.hex}}</span>
                  <span class="mosaic_value">
                  <div>{{value.amount.lower?value.amount.compact():value.amount}}</div>
                </span>
                </div>
                <div class="mosaic_data"></div>
              </div>
            </TabPane>
          </Tabs>

          <!--        sevral      -->
          <div v-if="isShowManageMosaicIcon" class="searchMosaic">
            <div class="asset_setting_tit pointer" @click="showMosaicMap">
              <img src="@/common/img/monitor/monitorLeftArrow.png" alt="">
              <span>{{$t('asset_setting')}}</span>
            </div>
            <div class="input_outter">
              <img src="@/common/img/monitor/monitorSearchIcon.png" alt="">
              <input v-model="mosaicName" type="text" :placeholder="$t('search_for_asset_name')">
              <span class="search pointer" @click="searchMosaic">{{$t('search')}}</span>

            </div>
            <div class="mosaicList">
              <div class="mosaic_data" v-for="(value,key,index) in mosaicMap" :key="index">
                <span class="namege_img">
                    <img @click="toggleShowMosaic(key,value)" class="small_icon pointer"
                         :src="value.show?monitorSeleted:monitorUnselected">
                    <img v-if="index == 0" class="mosaicIcon"
                         src="@/common/img/monitor/monitorMosaicIcon.png">
                    <img v-else class="mosaicIcon" src="@/common/img/monitor/mosaicDefault.png">
                </span>
                <span class="mosaic_name">{{value.name}}</span>
                <span class="mosaic_value">
                  <div>{{value.amount}}</div>
                </span>
              </div>
              <div class="complete_container">
                <div class="complete" @click="showMosaicMap">{{$t('complete')}}</div>

              </div>
              <div class="mosaic_data"></div>
            </div>

          </div>
        </div>
      </div>
    </div>
    <div class="monitor_panel_right_container">
      <div class="top_navidator radius">
        <span :class="[n.isSelect?'active_navigator':'','outter_container',n.disabled?'disabled':'pointer']"
              @click="switchPanel(index)"
              v-for="(n,index) in navigatorList">
          <span class="inner_container absolute">{{$t(n.name)}}</span>
          <span class="line">|</span>
        </span>
      </div>
      <div class="bottom_router_view">
        <router-view/>
      </div>
      <div class="transaction_status radius">
      </div>
    </div>
  </div>
</template>

<script lang="ts">
    import {Message} from "config/index"
    import {market} from "@/interface/restLogic"
    import {KlineQuery} from "@/query/klineQuery"
    import {Address, MosaicId, UInt64} from 'nem2-sdk'
    import {mosaicInterface} from '@/interface/sdkMosaic'
    import {accountInterface} from '@/interface/sdkAccount'
    import {aliasInterface} from "@/interface/sdkNamespace"
    import {Component, Vue, Watch} from 'vue-property-decorator'
    import monitorSeleted from '@/common/img/monitor/monitorSeleted.png'
    import monitorUnselected from '@/common/img/monitor/monitorUnselected.png'
    import {copyTxt,localSave, localRead, formatXEMamount} from '@/help/help.ts'

    @Component
    export default class DashBoard extends Vue {
        node = ''
        address = ''
        XEMamount = 0
        mosaic: string
        mosaicName = ''
        currentXem = ''
        currentPrice = 0
        currentXEM1 = ''
        currentXEM2 = ''
        accountAddress = ''
        accountPublicKey = ''
        isLoadingMosaic = true
        localMosaicMap: any = {}
        isShowAccountInfo = true
        isShowAccountAlias = false
        isShowManageMosaicIcon = false
        monitorSeleted = monitorSeleted
        monitorUnselected = monitorUnselected
        navigatorList: any = [
            {
                name: 'dash_board',
                isSelect: true,
                path: 'dashBoard'
            },
            {
                name: 'transfer',
                isSelect: false,
                path: 'transfer'
            },
            {
                name: 'receipt',
                isSelect: false,
                path: 'receipt'
            },

            {
                name: 'remote',
                isSelect: false,
                path: 'remote',
            },
            {
                name: 'market',
                isSelect: false,
                path: 'market'
            },
        ]

        mosaicMap: any = {
            aabby: {
                name: 'XEM',
                hex: 'aabby',
                amount: 0.265874,
                show: true
            }
        }

        get getWallet() {
            return this.$store.state.account.wallet
        }

        get getWalletList() {
            return this.$store.state.app.walletList || []
        }

        get namespaceList() {
            return this.$store.state.account.namespace
        }

        get confirmedTxList() {
            return this.$store.state.account.ConfirmedTx
        }

        switchPanel(index) {
            if (this.navigatorList[index].disabled) {
                return
            }
            const list = this.navigatorList.map((item) => {
                item.isSelect = false
                return item
            });
            list[index].isSelect = true
            this.navigatorList = list
            this.$router.push({
                name: list[index].path
            })
        }

        hideAssetInfo() {
            this.isShowAccountInfo = false;
        }

        manageMosaicList() {
            this.isShowManageMosaicIcon = !this.isShowManageMosaicIcon
        }

        copyAddress() {
            const that = this
            copyTxt(this.address).then(() => {
                that.$Message.success(Message.COPY_SUCCESS)
            })
        }

        initData() {
            this.accountPublicKey = this.getWallet.publicKey
            this.accountAddress = this.getWallet.address
            this.address = this.getWallet.address
            this.node = this.$store.state.account.node
            this.currentXem = this.$store.state.account.currentXem
            this.currentXEM2 = this.$store.state.account.currentXEM2
            this.currentXEM1 = this.$store.state.account.currentXEM1
            this.$store.commit('SET_CURRENT_PANEL_INDEX', 0)
            this.$store.state.app.isInLoginPage = false


        }

        getXEMAmount() {
            const that = this
            const {accountAddress, node} = this
            accountInterface.getAccountInfo({
                node,
                address: accountAddress
            }).then((accountResult: any) => {
                accountResult.result.accountInfo.subscribe((accountInfo) => {
                    const mosaicList = accountInfo.mosaics
                    mosaicList.map((item) => {
                        if (item.id.toHex() == that.currentXEM2 || item.id.toHex() == that.currentXEM1) {
                            that.XEMamount = item.amount.compact() / 1000000
                        }
                    })
                }, () => {
                    that.XEMamount = 0
                })
            })
        }

        async getMyNamespaces() {
            await aliasInterface.getNamespacesFromAccount({
                address: Address.createFromRawAddress(this.getWallet.address),
                url: this.node
            }).then((namespacesFromAccount) => {
                let list = []
                let namespace = {}
                namespacesFromAccount.result.namespaceList
                    .sort((a, b) => {
                        return a['namespaceInfo']['depth'] - b['namespaceInfo']['depth']
                    }).map((item, index) => {
                    if (!namespace.hasOwnProperty(item.namespaceInfo.id.toHex())) {
                        namespace[item.namespaceInfo.id.toHex()] = item.namespaceName
                    } else {
                        return
                    }
                    let namespaceName = ''
                    item.namespaceInfo.levels.map((item, index) => {
                        namespaceName += namespace[item.id.toHex()] + '.'
                    })
                    namespaceName = namespaceName.slice(0, namespaceName.length - 1)
                    const newObj = {
                        value: namespaceName,
                        label: namespaceName,
                        alias: item.namespaceInfo.alias,
                        levels: item.namespaceInfo.levels.length,
                        name: namespaceName,
                        duration: item.namespaceInfo.endHeight.compact(),
                    }
                    list.push(newObj)
                })
                this.$store.commit('SET_NAMESPACE', list)
            })
        }

        showMosaicMap() {
            this.isShowManageMosaicIcon = !this.isShowManageMosaicIcon
            this.mosaicMap = this.localMosaicMap
        }

        toggleShowMosaic(key, value) {
            if (!this.localMosaicMap[key]) {
                this.localMosaicMap[key] = value
            }
            this.localMosaicMap[key].show = !this.localMosaicMap[key].show
            this.saveMosaicRecordInLocal()
        }

        saveMosaicRecordInLocal() {
            // save address
            this.isLoadingMosaic = false
            localSave(this.accountAddress, JSON.stringify(this.localMosaicMap))
        }

        getAccountsName() {
            const that = this
            const {accountAddress, node} = this
            accountInterface.getAccountsNames({
                node,
                addressList: [Address.createFromRawAddress(accountAddress)]
            }).then((namespaceResult) => {
                namespaceResult.result.namespaceList.subscribe((namespaceInfo) => {
                    that.isShowAccountAlias = false
                }, () => {
                    that.isShowAccountAlias = false
                })
            })
        }

        async getMarketOpenPrice() {
            const that = this
            const rstStr = await market.kline({period: "1min", symbol: "xemusdt", size: "1"});
            const rstQuery: KlineQuery = JSON.parse(rstStr.rst);
            const result = rstQuery.data[0].close
            that.currentPrice = result
        }

        async getMosaicList() {
            const that = this
            let {accountAddress, node} = this
            await accountInterface.getAccountInfo({
                node,
                address: accountAddress
            }).then(async accountInfoResult => {
                await accountInfoResult.result.accountInfo.subscribe(async (accountInfo) => {
                    let mosaicList = accountInfo.mosaics
                    let getWallet = this.getWallet
                    let walletList = this.getWalletList
                    let mosaicHexIds = []
                    let mosaicIds = mosaicList.map((item, index) => {
                        mosaicHexIds[index] = item.id.toHex()
                        return item.id
                    })
                    await mosaicInterface.getMosaics({
                        node,
                        mosaicIdList: mosaicIds
                    }).then((mosaics) => {
                        mosaics.result.mosaicsInfos['subscribe']((mosaicInfoList) => {
                            mosaicList = mosaicInfoList.map((item) => {
                                let mosaicItem = mosaicList[mosaicHexIds.indexOf(item.mosaicId.toHex())]
                                mosaicItem.hex = item.mosaicId.toHex()
                                if (mosaicItem.hex == that.currentXEM2 || mosaicItem.hex == that.currentXEM1) {
                                    mosaicItem.name = that.$store.state.account.currentXem
                                    getWallet.balance = mosaicItem.amount.compact() / Math.pow(10, item.divisibility)
                                    this.$store.state.account.wallet = getWallet
                                    walletList[0] = getWallet
                                    this.$store.state.app.walletList = walletList
                                } else {
                                    mosaicItem.name = item.mosaicId.toHex()
                                }
                                mosaicItem.amount = mosaicItem.amount.compact()
                                mosaicItem.show = true
                                return mosaicItem
                            })
                            // get nem.xem
                            let isCrrentXEMExists = false
                            isCrrentXEMExists = mosaicList.every((item) => {
                                if (item.id.toHex() == that.currentXEM2 || item.id.toHex() == that.currentXEM1) {
                                    return false
                                }
                                return true
                            })


                            if (isCrrentXEMExists) {
                                let xemHexId = this.$store.state.account.currentXEM1
                                mosaicList.unshift({
                                    amount: 0,
                                    hex: xemHexId,
                                    name: 'nem.xem',
                                    id: new MosaicId(xemHexId),
                                    show: true
                                })
                            }

                            let mosaicMap = {}
                            mosaicList = mosaicList.reverse()
                            mosaicList.forEach((item) => {
                                const hex = item.hex
                                if (item.name == 'nem.xem') {
                                    that.XEMamount = item.amount / 1000000
                                }
                                mosaicMap[hex] = {
                                    amount: item.amount,
                                    name: item.name,
                                    hex: item.hex,
                                    show: true
                                }
                            })

                            this.$store.commit('SET_MOSAICS', mosaicList)
                            that.localMosaicMap = mosaicMap
                            that.mosaicMap = mosaicMap
                            that.isLoadingMosaic = false
                        })
                    })
                }, () => {
                    let defaultMosaic = {
                        amount: 0,
                        name: 'nem.xem',
                        hex: that.currentXEM1,
                        show: true
                    }
                    let mosaicMap = {}
                    this.$store.commit('SET_MOSAICS', [defaultMosaic])
                    mosaicMap[defaultMosaic.hex] = defaultMosaic
                    that.localMosaicMap = mosaicMap
                    that.mosaicMap = mosaicMap
                    that.isLoadingMosaic = false
                })
            })
        }

        initLeftNavigator() {
            this.$store.commit('SET_CURRENT_PANEL_INDEX', 0)
        }

        searchMosaic() {
            // need hex search way
            const that = this
            const {mosaicName, mosaicMap} = this
            const {currentXEM1, currentXEM2} = this.$store.state.account
            if (this.mosaicName == '') {
                this.showErrorMessage(Message.MOSAIC_NAME_NULL_ERROR)
                return
            }
            let searchResult = {}

            mosaicInterface.getMosaicByNamespace({
                namespace: mosaicName
            }).then((result: any) => {
                const mosaicHex = result.result.mosaicId.toHex()
                if (mosaicMap[mosaicHex]) {
                    searchResult[mosaicHex] = mosaicMap[mosaicHex]
                    that.mosaicMap = searchResult
                    return
                }
                if (mosaicHex == currentXEM1 || currentXEM2 == mosaicHex) {
                    searchResult[mosaicHex] = mosaicMap[currentXEM1] ? mosaicMap[currentXEM1] : mosaicMap[currentXEM2]
                    that.mosaicMap = searchResult
                    return
                }
                searchResult[mosaicHex] = {
                    name: mosaicName,
                    hex: mosaicHex,
                    amount: 0,
                    show: false
                }
                that.mosaicMap = searchResult
            }).catch(() => {
            })
        }

        showErrorMessage(message) {
            this.$Message.destroy()
            this.$Message.error(message)
        }

        async realLocalStorage() {
            const that = this
            let {accountAddress, node} = this
            let mosaicMap:any = localRead(this.accountAddress)
            if (mosaicMap) {
                mosaicMap = JSON.parse(mosaicMap)
                // refresh mosaic amount
                const that = this
                await accountInterface.getAccountInfo({
                    node,
                    address: accountAddress
                }).then(async accountInfoResult => {
                    await accountInfoResult.result.accountInfo.subscribe((accountInfo) => {
                        const mosaicList = accountInfo.mosaics
                        mosaicList.forEach((item) => {
                            const mosaicHex = item.id.toHex()
                            const mosaicAmount = item.amount.compact()
                            if (mosaicMap[mosaicHex]) {
                                // refresh amount
                                mosaicMap[mosaicHex].amount = mosaicAmount
                                return
                            }
                            // add new mosaic into record
                            mosaicMap[mosaicHex] = item
                            mosaicMap[mosaicHex].show = true
                        })
                        that.localMosaicMap = mosaicMap
                        that.mosaicMap = mosaicMap
                        that.saveMosaicRecordInLocal()
                    }, () => {
                        let defaultMosaic = {
                            amount: 0,
                            name: 'nem.xem',
                            hex: that.currentXEM2,
                            show: true
                        }
                        let mosaicMap = {}
                        mosaicMap[defaultMosaic.hex] = defaultMosaic
                        that.localMosaicMap = mosaicMap
                        that.mosaicMap = mosaicMap
                        that.saveMosaicRecordInLocal()
                    })
                })
            } else {
                this.getMosaicList()
            }
        }

        setLeftSwitchIcon() {
            this.$store.commit('SET_CURRENT_PANEL_INDEX', 0)

        }

        formatXEMamount(text) {
            return formatXEMamount(text)
        }

        @Watch('getWallet')
        onGetWalletChange() {
            this.initData()
            this.getXEMAmount()
            this.getAccountsName()
            this.getMarketOpenPrice()
            this.realLocalStorage()
            this.getMyNamespaces()
        }

        @Watch('confirmedTxList')
        onConfirmedTxChange() {
            this.getXEMAmount()
            this.getAccountsName()
            this.realLocalStorage()
            this.getMyNamespaces()
        }

        created() {
            this.setLeftSwitchIcon()
            this.initLeftNavigator()
            this.initData()
            this.getXEMAmount()
            this.getAccountsName()
            this.getMarketOpenPrice()
            this.realLocalStorage()
            this.getMyNamespaces()
        }
    }
</script>

<style scoped lang="less">
  @import "MonitorPanel.less";
</style>
