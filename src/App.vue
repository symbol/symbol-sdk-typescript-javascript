<template>
  <div id="app" :class="[isWindows?'windows':'mac']">
    <router-view/>
    <DisabledUiOverlay/>
  </div>
</template>

<script lang="ts">
    import 'animate.css'
    import {Address, AccountHttp} from 'nem2-sdk'
    import {mapState} from 'vuex'
    import {asyncScheduler} from 'rxjs'
    import {throttleTime} from 'rxjs/operators'
    import {isWindows} from "@/config/index.ts"
    import {checkInstall, getObjectLength, getTopValueInObject, localRead} from '@/core/utils'
    import {Component, Vue} from 'vue-property-decorator'
    import {
        initMosaic, mosaicsAmountViewFromAddress, AppMosaics,
        getCurrentBlockHeight, getCurrentNetworkMosaic, getNetworkGenerationHash,
        getMarketOpenPrice, setTransactionList, getNamespacesFromAddress,
        setWalletsBalances, ChainListeners,
    } from '@/core/services'
    import {AppMosaic, AppWallet, AppInfo, StoreAccount} from '@/core/model'
    import {MultisigApiRxjs} from "@/core/api/MultisigApiRxjs"
    import DisabledUiOverlay from '@/common/vue/disabled-ui-overlay/DisabledUiOverlay.vue';

    @Component({
        computed: {
            ...mapState({activeAccount: 'account', app: 'app'}),
        },
        components: {
            DisabledUiOverlay
        }
    })
    export default class App extends Vue {
        isWindows = isWindows
        activeAccount: StoreAccount
        app: AppInfo
        chainListeners: ChainListeners = null

        get node() {
            return this.activeAccount.node
        }

        get wallet() {
            return this.activeAccount.wallet
        }

        get accountAddress() {
            return this.activeAccount.wallet.address
        }

        get networkCurrency() {
            return this.activeAccount.networkCurrency
        }

        get accountName(): string {
            return this.activeAccount.accountName
        }

        get accountMap() {
            return localRead('accountMap') ? JSON.parse(localRead('accountMap')) : null
        }

        // @TODO: move out from there
        async setWalletsList() {
            try {
                // @TODO: quick fix, to review when refactoring wallets
                const {accountName, accountMap} = this
                if (!accountMap) return
                const currentAccountName = accountName && accountName !== ''
                    ? accountName : getTopValueInObject(accountMap)['accountName']

                if (!currentAccountName || currentAccountName === '') return
                await this.$store.commit('SET_ACCOUNT_NAME', currentAccountName)
                const wallets = getTopValueInObject(accountMap)['wallets']
                AppWallet.switchWallet(wallets[0].address, wallets, this.$store)
            } catch (error) {
                console.error(error)
            }
        }

        async onWalletChange(newWallet) {
            // reset tx list
            try {
                this.$store.commit('SET_TRANSACTIONS_LOADING', true)
                this.$store.commit('SET_BALANCE_LOADING', true)
                this.$store.commit('SET_MOSAICS_LOADING', true)
                this.$store.commit('SET_NAMESPACE_LOADING', true)
                this.$store.commit('SET_MULTISIG_LOADING', true)
                this.$store.commit('SET_ACTIVE_MULTISIG_ACCOUNT', null)
                this.$store.commit('SET_TRANSACTION_LIST', [])
                this.$store.commit('RESET_MOSAICS')
                this.$store.commit('SET_NAMESPACES', [])

                //@TODO: move from there
                const mosaicListFromStorage = localRead(newWallet.address)
                const parsedMosaicListFromStorage = mosaicListFromStorage === ''
                    ? false : JSON.parse(mosaicListFromStorage)
                if (mosaicListFromStorage) await this.$store.commit('SET_MOSAICS', parsedMosaicListFromStorage)
                const initMosaicsAndNamespaces = await Promise.all([
                    // @TODO make it an AppWallet methods
                    initMosaic(newWallet, this.$store),
                    getNamespacesFromAddress(newWallet.address, this.node),
                    setTransactionList(newWallet.address, this.$store)
                ])

                this.$store.commit('SET_NAMESPACES', initMosaicsAndNamespaces[1] || [])
                this.$store.commit('SET_MOSAICS_LOADING', false)
                this.$store.commit('SET_NAMESPACE_LOADING', false)
                
                const appWallet = new AppWallet(newWallet)
                appWallet.setMultisigStatus(this.node, this.$store)
                appWallet.setAccountInfo(this.$store)

                if (!this.chainListeners) {
                    this.chainListeners = new ChainListeners(this, newWallet.address, this.node)
                    this.chainListeners.start()
                    this.chainListeners.startTransactionListeners()
                    return
                }

                this.chainListeners.switchAddress(newWallet.address)
            } catch (error) {
                console.error("App -> onWalletChange -> error", error)
                this.$store.commit('SET_TRANSACTIONS_LOADING', false)
                this.$store.commit('SET_BALANCE_LOADING', false)
                this.$store.commit('SET_MOSAICS_LOADING', false)
                this.$store.commit('SET_NAMESPACE_LOADING', false)
                this.$store.commit('SET_MULTISIG_LOADING', false)
            }
        }

        async onActiveMultisigAccountChange(publicKey: string): Promise<void> {
            try {
                const {node} = this
                const {networkType} = this.wallet

                // @TODO: Fix one single address type to be used as param
                const accountAddress = Address.createFromPublicKey(publicKey, networkType)
                const address = accountAddress.plain()

                const promises = await Promise.all([
                    getNamespacesFromAddress(address, node),
                    mosaicsAmountViewFromAddress(node, accountAddress),
                ])

                const appNamespaces = promises[0]
                // @TODO: refactor
                const mosaicAmountViews = promises[1]
                const appMosaics = mosaicAmountViews.map(x => AppMosaic.fromMosaicAmountView(x))

                this.$store.commit('UPDATE_MULTISIG_ACCOUNT_MOSAICS', {
                    address, mosaics: appMosaics,
                })
                this.$store.commit('SET_MULTISIG_ACCOUNT_NAMESPACES', {
                    address, namespaces: appNamespaces,
                })

                const appMosaicsFromNamespaces = await AppMosaics().fromAppNamespaces(appNamespaces)
                this.$store.commit('UPDATE_MULTISIG_ACCOUNT_MOSAICS', {
                    address, mosaics: appMosaicsFromNamespaces,
                })
            } catch (error) {
                throw new Error(error)
            }
        }

        checkIfWalletExist() {
            if (!this.wallet || !this.wallet.address) {
                this.$router.push('login')
            }
        }

        async getMultisigAccountMultisigAccountInfo(publicKey) {
            const {networkType} = this.wallet
            const accountAddress = Address.createFromPublicKey(publicKey, networkType).plain()

            try {
                const multisigAccountInfo = await new AccountHttp(this.node)
                    .getMultisigAccountInfo(Address.createFromRawAddress(accountAddress))
                    .toPromise()

                this.$store.commit('SET_MULTISIG_ACCOUNT_INFO', {
                    address: accountAddress, multisigAccountInfo,
                })
            } catch (error) {
                this.$store.commit('SET_MULTISIG_ACCOUNT_INFO', {
                    address: accountAddress, multisigAccountInfo: null,
                })
            }
        }

        async mounted() {
            const {accountName, node} = this
            this.checkIfWalletExist() // @TODO: move out when refactoring wallets

            try {
                // @TODO: refactor
                await Promise.all([
                    getNetworkGenerationHash(node, this),
                    getCurrentBlockHeight(this.$store),
                    getCurrentNetworkMosaic(node, this.$store),
                ])

                await this.setWalletsList()
                setWalletsBalances(this.$store)

                await Promise.all([
                    this.$store.commit('SET_TRANSACTIONS_LOADING', true),
                    this.$store.commit('SET_BALANCE_LOADING', true),
                    this.$store.commit('SET_MOSAICS_LOADING', true),
                    this.$store.commit('SET_NAMESPACE_LOADING', true),
                ])
            } catch (error) {
                console.log("TCL: App -> mounted -> error", error)
            }

            this.$Notice.config({duration: 4})

            getMarketOpenPrice(this)

            if (this.wallet && this.wallet.address) {
                this.onWalletChange(this.wallet)
            }

            this.$watchAsObservable('wallet')
                .pipe(
                    throttleTime(6000, asyncScheduler, {leading: true, trailing: true}),
                ).subscribe(({newValue, oldValue}) => {

                /**
                 * On Wallet Change
                 */
                if (oldValue.address === undefined && newValue.address !== undefined
                    || oldValue.address !== undefined && newValue.address !== oldValue.address) {
                    this.onWalletChange(newValue)
                }
            })

            this.$watchAsObservable('activeAccount.activeMultisigAccount')
                .pipe(
                    throttleTime(6000, asyncScheduler, {leading: true, trailing: true}),
                ).subscribe(({newValue, oldValue}) => {
                if (!newValue) return

                if (oldValue !== newValue) {
                    setWalletsBalances(this.$store)
                    this.onActiveMultisigAccountChange(newValue)
                    this.getMultisigAccountMultisigAccountInfo(newValue)
                }
            })

            this.$watchAsObservable('accountName')
                .pipe(
                    throttleTime(6000, asyncScheduler, {leading: true, trailing: true}),
                ).subscribe(({newValue, oldValue}) => {
                if (!newValue) return
                if (oldValue !== newValue) setWalletsBalances(this.$store)
            })

            this.$store.subscribe(async (mutation, state) => {
                switch (mutation.type) {
                    /**
                     * On Node Change
                     */
                    case 'SET_NODE':
                        const node = mutation.payload
                        if (!this.chainListeners) {
                            try {
                                await getNetworkGenerationHash(node, this)
                                // @TODO: Handle generationHash change
                                await getCurrentNetworkMosaic(node, this.$store)
                                await getCurrentBlockHeight(this.$store)
                                this.chainListeners = new ChainListeners(this, this.wallet.address, node)
                                this.chainListeners.start()
                            } catch (error) {
                                console.error(error)
                            }
                        } else {
                            this.chainListeners.switchEndpoint(node)
                        }
                        break
                }
            })
            // @TODO: hook to onLogin event
        }

        created() {
            if (isWindows) {
                checkInstall()
            }
        }
    }

</script>

<style lang="less">
  @import "./common/css/common.less";
  @import "./common/css/ivewWindows.less";
  @import "./common/css/iviewMac.less";
</style>
