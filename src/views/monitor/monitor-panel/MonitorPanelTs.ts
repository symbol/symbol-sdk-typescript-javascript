import {Message} from "@/config"
import {market} from "@/core/api/logicApi"
import {KlineQuery} from "@/core/query/klineQuery"
import {Address, MosaicId} from 'nem2-sdk'
import {mosaicApi} from '@/core/api/mosaicApi'
import {accountApi} from '@/core/api/accountApi'
import {Component, Vue, Watch} from 'vue-property-decorator'
import monitorSeleted from '@/common/img/monitor/monitorSeleted.png'
import monitorUnselected from '@/common/img/monitor/monitorUnselected.png'
import {copyTxt, localSave, localRead, formatXEMamount} from '@/core/utils/utils'
import {getNamespaces, setWalletMosaic} from "@/core/utils/wallet";

@Component
export class MonitorPanelTs extends Vue {
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
            name: 'receive',
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
            name: 'nem.xem',
            hex: 'nem.xem',
            amount: 0.265874,
            show: true,
            showInManage: true
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
            that.$Notice.success(
                {
                    title: this.$t(Message.COPY_SUCCESS) + ''
                }
            )
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
        const {node, currentXEM1, currentXEM2} = this
        setWalletMosaic(this.getWallet, node, currentXEM1, currentXEM2)
            .then((wallet) => {
                that.XEMamount = wallet.balance
            })
    }

    getMyNamespaces() {
        getNamespaces(this.getWallet.address, this.node)
            .then((list) => {
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
        accountApi.getAccountsNames({
            node,
            addressList: [Address.createFromRawAddress(accountAddress)]
        }).then((namespaceResult) => {
            namespaceResult.result.namespaceList.subscribe((namespaceInfo) => {
                if (namespaceInfo[0].names.length > 0) {
                    that.isShowAccountAlias = true
                } else {
                    that.isShowAccountAlias = false
                }
            }, () => {
                that.isShowAccountAlias = false
            })
        })
    }

    async getMarketOpenPrice() {
        const that = this
        const rstStr = await market.kline({period: "1min", symbol: "xemusdt", size: "1"});
        const rstQuery: KlineQuery = JSON.parse(rstStr.rst);
        const result = rstQuery.data ? rstQuery.data[0].close : 0
        that.currentPrice = result
    }

    async getMosaicList() {
        const that = this
        let {accountAddress, node} = this
        await accountApi.getAccountInfo({
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
                await mosaicApi.getMosaics({
                    node,
                    mosaicIdList: mosaicIds
                }).then((mosaics) => {
                    mosaics.result.mosaicsInfos['subscribe'](async (mosaicInfoList) => {
                        mosaicList = mosaicInfoList.map((item) => {
                            let mosaicItem = mosaicList[mosaicHexIds.indexOf(item.mosaicId.toHex())]
                            mosaicItem.hex = item.mosaicId.toHex()
                            if (mosaicItem.hex == that.currentXEM2 || mosaicItem.hex == that.currentXEM1) {
                                mosaicItem.name = that.$store.state.account.currentXem
                                getWallet.balance = mosaicItem.amount.compact() / Math.pow(10, item.divisibility)
                                this.$store.state.account.wallet = getWallet
                                walletList[0] = getWallet
                                this.$store.state.app.walletList = walletList
                                mosaicItem.amount = mosaicItem.amount.compact()
                                mosaicItem.show = true
                                mosaicItem.showInManage = true
                                return mosaicItem

                            }
                            mosaicItem.name = item.mosaicId.toHex()
                            mosaicItem.amount = mosaicItem.amount.compact()
                            mosaicItem.show = true
                            mosaicItem.showInManage = true
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
                                show: true,
                                showInManage: true
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
                                show: true,
                                showInManage: true
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
                    show: true,
                    showInManage: true
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

        mosaicApi.getMosaicByNamespace({
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
                show: false,
                showInManage: true
            }
            that.mosaicMap = searchResult
        }).catch(() => {
        })
    }

    showErrorMessage(message) {
        this.$Notice.destroy()
        this.$Notice.error({title: this.$t(message) + ''})
    }

    async realLocalStorage() {
        const that = this
        let {accountAddress, node} = this
        let mosaicMap: any = localRead(this.accountAddress)
        if (mosaicMap) {
            mosaicMap = JSON.parse(mosaicMap)
            // refresh mosaic amount
            const that = this
            await accountApi.getAccountInfo({
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
                        mosaicMap[mosaicHex].name = mosaicHex
                        mosaicMap[mosaicHex].show = true
                        mosaicMap[mosaicHex].showInManage = true
                    })
                    that.localMosaicMap = mosaicMap
                    that.mosaicMap = mosaicMap
                    that.saveMosaicRecordInLocal()
                }, () => {
                    let defaultMosaic = {
                        amount: 0,
                        name: 'nem.xem',
                        hex: that.currentXEM1,
                        show: true,
                        showInManage: true
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

    @Watch('mosaicName')
    onMosaicNameChange() {
        const {mosaicMap, mosaicName} = this
        for (const item in mosaicMap) {
            if (item.indexOf(mosaicName) !== -1 || mosaicMap[item].name.indexOf(mosaicName) !== -1) {
                mosaicMap[item].showInManage = true
                continue
            }
            mosaicMap[item].showInManage = false
        }
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
