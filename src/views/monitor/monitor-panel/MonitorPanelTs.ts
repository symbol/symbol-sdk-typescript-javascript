import {Message, nodeConfig} from "@/config/index.ts"
import {market} from "@/core/api/logicApi.ts"
import {KlineQuery} from "@/core/query/klineQuery.ts"
import {Address, MosaicHttp, MosaicId, NamespaceHttp, NamespaceId} from 'nem2-sdk'
import {MosaicApiRxjs} from '@/core/api/MosaicApiRxjs.ts'
import {AccountApiRxjs} from '@/core/api/AccountApiRxjs.ts'
import {Component, Vue, Watch} from 'vue-property-decorator'
import {aliasType} from '@/config/index.ts'
import monitorSeleted from '@/common/img/monitor/monitorSeleted.png'
import monitorUnselected from '@/common/img/monitor/monitorUnselected.png'
import {getNamespaces, getMosaicList, getMosaicInfoList, AppWallet} from "@/core/utils/wallet.ts"
import {copyTxt, localSave, formatXEMamount, formatNumber, getRelativeMosaicAmount} from '@/core/utils/utils.ts'
import {mapState} from "vuex"
import {minitorPanelNavigatorList} from '@/config/index.ts'

@Component({
    computed: {
        ...mapState({
            activeAccount: 'account',
            app: 'app',
        })
    }
})
export class MonitorPanelTs extends Vue {
    app: any
    activeAccount: any
    mosaic: string
    mosaicName = ''
    // @TODO: current price in the store
    currentPrice = 0
    isLoadingMosaic = true
    localMosaicMap: any = {}
    isShowAccountInfo = true
    isShowAccountAlias = false
    isShowManageMosaicIcon = false
    ischecked=true
    monitorSeleted = monitorSeleted
    monitorUnselected = monitorUnselected
    navigatorList: any = minitorPanelNavigatorList
    mosaicMap: any = {}
    arr=[]
    a=0

    get getWallet() {
        return this.activeAccount.wallet
    }

    get XEMamount() {
        return this.activeAccount.wallet.balance
    }

    get confirmedTxList() {
        return this.activeAccount.ConfirmedTx
    }

    get accountAddress() {
        return this.activeAccount.wallet.address
    }

    get address() {
        return this.activeAccount.wallet.address
    }

    get node() {
        return this.activeAccount.node
    }

    get currentXem() {
        return this.activeAccount.currentXem
    }

    get currentXEM1() {
        return this.activeAccount.currentXEM1
    }

    get currentXEM2() {
        return this.activeAccount.currentXEM2
    }

    get networkCurrencies() {
        return [this.currentXEM1, this.currentXEM2]
    }


    get namespaceList() {
        return this.activeAccount.namespace
    }

    get xemDivisibility() {
        return this.activeAccount.xemDivisibility
    }

    switchPanel(index) {
        if (this.navigatorList[index].disabled) {
            return
        }
        const list = this.navigatorList.map((item) => {
            item.isSelect = false
            return item
        })
        list[index].isSelect = true
        this.navigatorList = list
        this.$router.push({
            name: list[index].path
        })
    }

    hideAssetInfo() {
        this.isShowAccountInfo = false
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
        this.$store.commit('SET_CURRENT_PANEL_INDEX', 0)
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
    toggleAllChecked(){
        this.ischecked = !this.ischecked
        document.getElementsByClassName("choose")[0].classList.replace(`${!this.ischecked}`,`${this.ischecked}`)
        Object.keys(this.localMosaicMap).forEach(key=>{
            this.localMosaicMap[key].show = this.ischecked
            let pos = this.arr.indexOf(key)
            if(pos<0){
                this.arr.push(key)
            }
        })
    }

    toggleShowMosaic(key, value) {
            this.a=0
        if (!this.localMosaicMap[key]) {
            this.localMosaicMap[key] = value
        }
        this.localMosaicMap[key].show = !this.localMosaicMap[key].show
        if(this.localMosaicMap[key].show===false){
            this.ischecked=false
            document.getElementsByClassName("choose")[0].classList.replace(`${!this.ischecked}`,`${this.ischecked}`)
        }
        Object.keys(this.localMosaicMap).forEach(index=>{
            let pos = this.arr.indexOf(index)
            if(pos<0){
                this.arr.push(index)
            }
            if(this.localMosaicMap[index].show ){
                
                this.a= this.a+1
            }
            else{
                this.a= this.a-1
            }
            
        })
        if(this.arr.length===this.a){
            this.ischecked=true
            document.getElementsByClassName("choose")[0].classList.replace(`${!this.ischecked}`,`${this.ischecked}`)
        }
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
        if (!accountAddress || accountAddress.length < 40) return
        new AccountApiRxjs().getAccountsNames([Address.createFromRawAddress(accountAddress)], node).subscribe((namespaceInfo) => {
            if (namespaceInfo[0].names.length > 0) {
                that.isShowAccountAlias = true
            } else {
                that.isShowAccountAlias = false
            }
        }, () => {
            that.isShowAccountAlias = false
        })

    }

    async getMarketOpenPrice() {
        try {
            const rstStr = await market.kline({period: "1min", symbol: "xemusdt", size: "1"})
            const rstQuery: KlineQuery = JSON.parse(rstStr.rst)
            const result = rstQuery.data ? rstQuery.data[0].close : 0
            this.currentPrice = result
        } catch (error) {
            setTimeout(() => this.getMarketOpenPrice(), 10000)
        }
    }

    async initMosaic() {
        this.isLoadingMosaic = true
        const that = this
        let {accountAddress, node, currentXEM1, currentXem, currentXEM2} = this
        let mosaicMap = {}
        let addressMap = {}
        let mosaicHexIds = []
        const defaultMosaic = {
            amount: 0,
            name: currentXem,
            hex: currentXEM1,
            show: true,
            divisibility: 6,
            showInManage: true
        }
        let mosaicList: any = await getMosaicList(accountAddress, node)
        mosaicList.map((item, index) => {
            mosaicHexIds[index] = item.id.toHex()
            return item.id
        })
        const mosaicInfoList = await getMosaicInfoList(node, mosaicList)
        mosaicList = mosaicInfoList.map((item: any) => {
            const mosaicItem: any = mosaicList[mosaicHexIds.indexOf(item.mosaicId.toHex())]
            mosaicItem.hex = item.mosaicId.toHex()
            if (mosaicItem.hex == currentXEM2 || mosaicItem.hex == currentXEM1) {
                mosaicItem.name = currentXem
                mosaicItem.amount = getRelativeMosaicAmount(mosaicItem.amount.compact(), item.divisibility)
                mosaicItem.show = true
                mosaicItem.divisibility = item.properties.divisibility
                mosaicItem.showInManage = true
                return mosaicItem
            }
            mosaicItem.name = item.mosaicId.toHex()
            mosaicItem.amount = getRelativeMosaicAmount(mosaicItem.amount.compact(), item.divisibility)
            mosaicItem.show = true
            mosaicItem.divisibility = item.properties.divisibility
            mosaicItem.showInManage = true
            return mosaicItem
        })
        const isCoinExist = mosaicList.every((item) => {
            if (item.id.toHex() == that.currentXEM2 || item.id.toHex() == that.currentXEM1) {
                return false
            }
            return true
        })
        if (isCoinExist) {
            mosaicList.unshift({
                amount: 0,
                hex: currentXEM1,
                divisibility: that.xemDivisibility,
                name: currentXem,
                id: new MosaicId(currentXEM1),
                show: true,
                showInManage: true
            })
        }
        mosaicList = mosaicList.reverse()
        mosaicList.forEach((item) => {
            mosaicMap[item.hex] = {
                amount: item.amount,
                name: item.name,
                divisibility: item.divisibility,
                hex: item.hex,
                show: true,
                showInManage: true
            }
        })
        this.namespaceList.forEach((item) => {
            switch (item.alias.type) {
                case aliasType.mosaicAlias:
                    const mosaicHex = new MosaicId(item.alias.mosaicId).toHex()
                    if (mosaicMap[mosaicHex]) {
                        mosaicMap[mosaicHex].name = item.label
                    }
                    break
                case  aliasType.addressAlias:
                    //@ts-ignore
                    const address = Address.createFromEncoded(item.alias.address).address
                    addressMap[address] = item
                    break
            }
        })
        that.updateMosaicMap(mosaicMap)
        this.$store.commit('SET_ADDRESS_ALIAS_MAP', addressMap)
        that.isLoadingMosaic = false
        if (mosaicList.length > 0) {
            this.$store.commit('SET_MOSAICS', mosaicList)
        } else {
            this.$store.commit('SET_MOSAICS', [defaultMosaic])
            mosaicMap[defaultMosaic.hex] = defaultMosaic
        }
    }


    updateMosaicMap(mosaicMap) {
        this.$set(this, 'localMosaicMap', mosaicMap)
        this.$set(this, 'mosaicMap', mosaicMap)
        this.$store.commit('SET_MOSAIC_MAP', mosaicMap)
        this.$store.commit('SET_WALLET_BALANCE', mosaicMap[this.currentXEM1].amount)
    }


    formatNumber(number) {
        return formatNumber(number)
    }

    initLeftNavigator() {
        this.$store.commit('SET_CURRENT_PANEL_INDEX', 0)
    }

    searchMosaic() {
        // need hex search way
        const that = this
        const {mosaicName, mosaicMap, currentXEM1, currentXEM2} = this
        const {} = this
        if (this.mosaicName == '') {
            this.showErrorMessage(Message.MOSAIC_NAME_NULL_ERROR)
            return
        }
        let searchResult = {}
        const mosaicHex = new MosaicApiRxjs().getMosaicByNamespace(mosaicName).id.toHex()
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
    }

    showErrorMessage(message) {
        this.$Notice.destroy()
        this.$Notice.error({title: this.$t(message) + ''})
    }

    setLeftSwitchIcon() {
        this.$store.commit('SET_CURRENT_PANEL_INDEX', 0)
    }

    formatXEMamount(text) {
        return formatXEMamount(text)
    }


    @Watch('currentXem')
    onCurrentXemChange() {
        this.initMosaic()
    }

    @Watch('getWallet.address')
    onGetWalletChange(n, o) {
        if (!n.address || n.address === o.address) return
        this.initData()
        this.initMosaic()
        new AppWallet(this.getWallet).updateAccountBalance(this.networkCurrencies, this.node, this.$store)
        this.getAccountsName()
        this.getMarketOpenPrice()
        this.getMyNamespaces()
    }

    @Watch('confirmedTxList')
    onConfirmedTxChange() {
        this.initMosaic()
        new AppWallet(this.getWallet).updateAccountBalance(this.networkCurrencies, this.node, this.$store)
        this.getAccountsName()
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

    mounted() {
        this.switchPanel(0)
        this.setLeftSwitchIcon()
        this.initLeftNavigator()
        this.initData()
        this.getMarketOpenPrice()
        // Functions hereunder should probably not be here
        this.getMyNamespaces()
        this.getAccountsName()
        this.initMosaic()
        new AppWallet(this.getWallet).updateAccountBalance(this.networkCurrencies, this.node, this.$store)
    }
}
