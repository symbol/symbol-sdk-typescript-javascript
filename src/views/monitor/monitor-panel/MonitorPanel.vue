<template>
    <div class="monitor_panel_container">
        <div class="monitor_panel_left_container" ref="monitorPanelLeftContainer">
            <div class="top_wallet_address radius">
                <div class="wallet_address">
          <span class="address">
            {{address}}
          </span>
                    <img class="pointer" @click="copyAddress"
                         src="../../../assets/images/monitor/monitorCopyAddress.png" alt="">
                </div>

                <div class="split"></div>
                <div class="XEM_amount"><span>XEM</span><span class="amount">{{XEMamount}}</span></div>
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
                                 src="../../../assets/images/monitor/monitorAssetList.png">
                            <!--        all       -->
                            <div class="mosaicList">
                                <div class="mosaic_data" v-if="value.show" v-for="(value,key,index) in mosaicMap"
                                     :key="index">
                <span class="img_container">
                    <img v-if="index == 0" src="../../../assets/images/monitor/monitorMosaicIcon.png" alt="">
                    <img v-else src="../../../assets/images/monitor/mosaicDefault.png" alt="">
                </span>
                                    <span class="mosaic_name">{{value.name}}</span>
                                    <span class="mosaic_value">
                  <div>{{value.amount}}</div>
                </span>
                                </div>
                            </div>
                        </TabPane>
                        <!--            <TabPane :label="$t('namespace')" name="name2">-->
                        <!--              <div class="namespace_data">-->
                        <!--                <div class="namespace_table_head">-->
                        <!--                  <span class="namespace">{{$t('namespace')}}</span>-->
                        <!--                  <span class="duration">{{$t('validity_period')}}</span>-->
                        <!--                </div>-->
                        <!--                <div class="namespace_item" v-for="i in 3">-->
                        <!--                  <span class="namespace">@123.456</span>-->
                        <!--                  <span class="duration">2019-02-09</span>-->
                        <!--                </div>-->
                        <!--              </div>-->
                        <!--            </TabPane>-->
                        <!--            <TabPane :label="$t('harvested_block')" name="name3">-->
                        <!--              <div class="harvesting_data">-->
                        <!--                <div class="harvesting_item " v-for="i in 3">-->
                        <!--                  <div class="clear top_info">-->
                        <!--                    <span class="left">{{$t('block')}}：4585464</span>-->
                        <!--                    <span class="right">fees:1.0546551xem</span>-->
                        <!--                  </div>-->
                        <!--                  <div class="bottom_info">-->
                        <!--                    <span class="left">include: 1 txs</span>-->
                        <!--                    <span class="right">2019-07-09 16:00</span>-->
                        <!--                  </div>-->
                        <!--                </div>-->
                        <!--              </div>-->
                        <!--            </TabPane>-->
                    </Tabs>

                    <!--        sevral      -->
                    <div v-if="isShowManageMosaicIcon" class="searchMosaic">
                        <div class="asset_setting_tit pointer" @click="showMosaicMap">
                            <img src="../../../assets/images/monitor/monitorLeftArrow.png" alt="">
                            <span>{{$t('asset_setting')}}</span>
                        </div>
                        <div class="input_outter">
                            <img src="../../../assets/images/monitor/monitorSearchIcon.png" alt="">
                            <input v-model="mosaicName" type="text" :placeholder="$t('search_for_asset_name')">
                            <span class="search pointer" @click="searchMosaic">{{$t('search')}}</span>

                        </div>
                        <div class="mosaicList">
                            <div class="mosaic_data" v-for="(value,key,index) in mosaicMap" :key="index">
                <span class="namege_img">
                    <img @click="toggleShowMosaic(key,value)" class="small_icon pointer"
                         :src="value.show?monitorSeleted:monitorUnselected">
                    <img v-if="index == 0" class="mosaicIcon"
                         src="../../../assets/images/monitor/monitorMosaicIcon.png">
                    <img v-else class="mosaicIcon" src="../../../assets/images/monitor/mosaicDefault.png">
                </span>
                                <span class="mosaic_name">{{value.name}}</span>
                                <span class="mosaic_value">
                  <div>{{value.amount}}</div>
                </span>
                            </div>
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
    import {Address, MosaicId, UInt64} from 'nem2-sdk'
    import {accountInterface} from '@/interface/sdkAccount'
    import {Component, Vue, Watch} from 'vue-property-decorator'
    import {mosaicInterface} from '@/interface/sdkMosaic';
    import {copyTxt} from '@/utils/tools'
    import {localSave, localRead} from '@/utils/util'
    import axios from 'axios'
    import monitorSeleted from '@/assets/images/monitor/monitorSeleted.png'
    import monitorUnselected from '@/assets/images/monitor/monitorUnselected.png'
    import monitorMosaicIcon from '@/assets/images/monitor/monitorMosaicIcon.png'
    import Message from "@/message/Message";

    @Component
    export default class DashBoard extends Vue {
        accountPublicKey = ''
        accountAddress = ''
        node = ''
        XEMamount = 0
        currentPrice = 0
        currentXem = ''
        address = ''
        currentXEM1 = ''
        currentXEM2 = ''
        monitorUnselected = monitorUnselected
        monitorSeleted = monitorSeleted
        mosaicName = ''
        isLoadingMosaic = true
        navigatorList: any = [
            {
                name: 'dash_board',
                isSelect: true,
                path: 'dashBoard'
            }, {
                name: 'market',
                isSelect: false,
                path: 'market'
            }, {
                name: 'transfer',
                isSelect: false,
                path: 'transfer'
            }, {
                name: 'receipt',
                isSelect: false,
                path: 'receipt'
            },
            {
                name: 'remote',
                isSelect: false,
                path: 'receipt',
                disabled: true
            }
        ]
        isShowAccountInfo = true;
        isShowManageMosaicIcon = false
        mosaicMap: any = {
            aabby: {
                name: 'XEM',
                hex: 'aabby',
                amount: 0.265874,
                show: true
            }
        }

        localMosaicMap: any = {}
        isShowAccountAlias = false
        mosaic: string;

        get getWallet() {
            return this.$store.state.account.wallet
        }

        get getWalletList() {
            return this.$store.state.app.walletList || []
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

        noticeComponent() {
            this.$Notice.destroy()
            this.$Notice.open({
                duration: 999,
                desc: 'The desc will hide when you set render.',
                render: h => {
                    return h('span',
                        {
                            style: {
                                display: 'flex',
                                justifyContent: 'center',
                                justifyItems: 'center',
                                alignItems: 'center',
                                alignContent: 'center'
                            },
                        }
                        , [
                            h('img', {
                                style: {
                                    width: '30px',
                                    marginRight: '20px'
                                },
                                attrs: {
                                    src: monitorMosaicIcon
                                }
                            }),
                            h('span', {
                                    style: {
                                        display: 'inline-block',
                                        width: '530px',
                                        lineHeight: '24px'
                                    },
                                },
                                '公告：Nem发布了最新投票，你可以在https://forum.nem.io/t/2020/ele-ction查看更多'
                            )
                        ])
                }
            });
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
            const {accountPublicKey, currentXem, accountAddress, node, address} = this
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
                    console.log('error getXEMAmount ')
                })
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
            const {accountPublicKey, currentXem, accountAddress, node, address} = this
            accountInterface.getAccountsNames({
                node,
                addressList: [Address.createFromRawAddress(accountAddress)]
            }).then((namespaceResult) => {
                namespaceResult.result.namespaceList.subscribe((namespaceInfo) => {
                    that.isShowAccountAlias = false
                }, () => {
                    console.log('no alias in this account')
                    that.isShowAccountAlias = false
                })
            })
        }

        async getMarketOpenPrice() {
            const that = this
            const url = this.$store.state.app.marketUrl + '/kline/xemusdt/1min/1'
            await axios.get(url).then(function (response) {
                const result = response.data.data[0].open
                that.currentPrice = result
            }).catch(function (error) {
                console.log('error ', error);
                that.getMarketOpenPrice()
            });
        }

        async getMosaicList() {
            const that = this
            let {accountPublicKey, currentXem, accountAddress, node, address, mosaic} = this
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
                                    getWallet.balance = item.amount
                                    this.$store.state.account.wallet = getWallet
                                    walletList[0] = getWallet
                                    this.$store.state.app.walletList = walletList
                                } else {
                                    mosaicItem.name = item.mosaicId.toHex()
                                }
                                mosaicItem.amount = mosaicItem.amount.compact() / Math.pow(10, item.divisibility)
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
                                    hex:xemHexId,
                                    name: 'nem.xem',
                                    id:new MosaicId(xemHexId),
                                    show: true
                                })
                            }
                            let mosaicMap = {}
                            mosaicList.forEach((item) => {
                                const hex = item.hex
                                mosaicMap[hex] = {
                                    amount: item.amount,
                                    name: item.name,
                                    hex: item.hex,
                                    show: true
                                }

                            })
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
                    mosaicMap[defaultMosaic.hex] = defaultMosaic
                    that.localMosaicMap = mosaicMap
                    that.mosaicMap = mosaicMap
                    that.isLoadingMosaic = false
                    console.log('monitor panel error getMosaicList')
                })
            })
        }

        initLeftNavigator() {
            this.$store.commit('SET_CURRENT_PANEL_INDEX', 1)
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
                } else if (mosaicHex == currentXEM1 || currentXEM2 == mosaicHex) {
                    searchResult[mosaicHex] = mosaicMap[currentXEM1] ? mosaicMap[currentXEM1] : mosaicMap[currentXEM2]
                } else {
                    searchResult[mosaicHex] = {
                        name: mosaicName,
                        hex: mosaicHex,
                        amount: 0,
                        show: false
                    }
                }
                that.mosaicMap = searchResult
            }).catch(() => {
                console.log('monitor paenl searchMosaic error')
            })
        }

        showErrorMessage(message) {
            this.$Message.destroy()
            this.$Message.error(message)
        }

        async realLocalStorage() {
            const that = this
            let {accountPublicKey, currentXem, accountAddress, node, address, mosaic} = this
            let mosaicMap = localRead(this.accountAddress)
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
                            } else {
                                // add new mosaic into record
                                mosaicMap[mosaicHex] = item
                                mosaicMap[mosaicHex].show = true
                            }
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
                        console.log('monitor paenl realLocalStorage error')
                    })
                })
            } else {
                this.getMosaicList()
            }
        }

        setLeftSwitchIcon() {
            this.$store.commit('SET_CURRENT_PANEL_INDEX', 0)

        }

        @Watch('getWallet')
        onGetWalletChange() {
            this.initData()
            this.getXEMAmount()
            this.getAccountsName()
            this.getMarketOpenPrice()
            this.realLocalStorage()
        }

        created() {
            this.setLeftSwitchIcon()
            this.initLeftNavigator()
            // this.noticeComponent()   tips
            this.initData()
            this.getXEMAmount()
            this.getAccountsName()
            this.getMarketOpenPrice()
            this.realLocalStorage()
        }

    }
</script>

<style scoped lang="less">
    @import "MonitorPanel.less";
</style>
