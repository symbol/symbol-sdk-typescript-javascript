<template>
  <div id="app" :class="[isWindows?'windows':'mac']">
    <router-view/>
    <DisabledUiOverlay/>
    <TransactionConfirmation/>
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
        setMosaics, mosaicsAmountViewFromAddress, AppMosaics,
        getCurrentBlockHeight, setCurrentNetworkMosaic, getNetworkGenerationHash,
        getMarketOpenPrice, setTransactionList, setNamespaces, getNamespacesFromAddress,
        setWalletsBalances, ChainListeners, getMultisigAccountMultisigAccountInfo, getNodeInfo,
    } from '@/core/services'
    import {AppMosaic, AppWallet, AppInfo, StoreAccount} from '@/core/model'
    import DisabledUiOverlay from '@/components/disabled-ui-overlay/DisabledUiOverlay.vue'
    import TransactionConfirmation from '@/components/transaction-confirmation/TransactionConfirmation.vue'

    @Component({
        computed: {
            ...mapState({activeAccount: 'account', app: 'app'}),
        },
        components: {
            DisabledUiOverlay,
            TransactionConfirmation
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

        get generationHash() {
            return this.activeAccount.generationHash
        }

        get isNodeHealthy() {
            return this.app.isNodeHealthy
        }

        get wallet() {
            return this.activeAccount.wallet
        }

        get address() {
            if (!this.wallet) return null
            return this.wallet.address
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
                // get active wallet
                const wallets = getTopValueInObject(accountMap)['wallets']
                this.$store.commit('SET_WALLET_LIST', wallets)
                const activeWalletAddress = JSON.parse(localRead('accountMap'))[currentAccountName].activeWalletAddress
                AppWallet.updateActiveWalletAddress(activeWalletAddress, this.$store)
            } catch (error) {
                console.error(error)
            }
        }

        async onWalletChange(newWallet) {
            // reset tx list
            try {
                this.$store.commit('SET_TRANSACTIONS_LOADING', true)
                this.$store.commit('SET_MOSAICS_LOADING', true)
                this.$store.commit('SET_NAMESPACE_LOADING', true)
                this.$store.commit('SET_MULTISIG_LOADING', true)
                this.$store.commit('SET_ACTIVE_MULTISIG_ACCOUNT', null)
                this.$store.commit('RESET_TRANSACTION_LIST')
                this.$store.commit('RESET_MOSAICS')
                this.$store.commit('RESET_NAMESPACES')

                //@TODO: move from there
                const mosaicListFromStorage = localRead(newWallet.address)
                const appWallet = new AppWallet(newWallet)
                const parsedMosaicListFromStorage = mosaicListFromStorage === ''
                    ? false : JSON.parse(mosaicListFromStorage)
                if (mosaicListFromStorage) await this.$store.commit('SET_MOSAICS', parsedMosaicListFromStorage)
                appWallet.setAccountInfo(this.$store)

                await setMosaics(newWallet, this.$store)
                await setNamespaces(newWallet.address, this.$store),

                    /**
                     * Delay network calls to avoid ban
                     */
                    setTimeout(() => {
                        try {
                            setTransactionList(newWallet.address, this.$store)
                            appWallet.setMultisigStatus(this.node, this.$store)
                        } catch (error) {
                            console.error("TCL: App -> onWalletChange -> setTimeout -> error", error)
                        }
                    }, 1000)
                getNodeInfo(this.$store)
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

        async mounted() {
            if (!this.activeAccount.wallet) this.$router.push('/login')
            getNodeInfo(this.$store)
            this.$store.commit('SET_TRANSACTIONS_LOADING', true)
            this.$store.commit('SET_MOSAICS_LOADING', true)
            this.$store.commit('SET_NAMESPACE_LOADING', true)
            try {
                await Promise.all([
                    getNetworkGenerationHash(this),
                    getCurrentBlockHeight(this.$store),
                    setCurrentNetworkMosaic(this.$store),
                ])

                /**
                 * Delay network calls to avoid ban
                 */
                setTimeout(async () => {
                    try {
                        await this.setWalletsList()
                        setWalletsBalances(this.$store)
                    } catch (error) {
                        console.error("App -> mounted -> setTimeout -> error", error)
                    }
                }, 1000)
            } catch (error) {
                console.error("App -> mounted -> error", error)
            }

            this.$Notice.config({duration: 4})

            getMarketOpenPrice(this)

            if (this.address && !this.address !== undefined) this.onWalletChange(this.wallet)


            /**
             *  EVENTS HANDLERS
             */


            /**
             * ON ADDRESS CHANGE
             */
            this.$watchAsObservable('address')
                .pipe(
                    throttleTime(6000, asyncScheduler, {leading: true, trailing: true}),
                ).subscribe(({newValue, oldValue}) => {

                if (!newValue) return

                if (!oldValue && newValue || oldValue && newValue !== oldValue) {
                    this.onWalletChange(this.wallet)
                }
            })


            /**
             * ON ACTIVE MULTISIG ACCOUNT CHANGE
             */
            this.$watchAsObservable('activeAccount.activeMultisigAccount')
                .pipe(
                    throttleTime(6000, asyncScheduler, {leading: true, trailing: true}),
                ).subscribe(({newValue, oldValue}) => {
                if (!newValue) return

                if (oldValue !== newValue) {
                    this.onActiveMultisigAccountChange(newValue)
                    getMultisigAccountMultisigAccountInfo(newValue, this.$store)
                }
            })


            /**
             * ON ACCOUNT CHANGE
             */
            this.$watchAsObservable('accountName')
                .pipe(
                    throttleTime(6000, asyncScheduler, {leading: true, trailing: true}),
                ).subscribe(({newValue, oldValue}) => {
                if (!newValue) return
                if (oldValue !== newValue) setWalletsBalances(this.$store)
            })


            /**
             * ON ENDPOINT CHANGE
             */
            this.$watchAsObservable('node')
                .pipe(
                    throttleTime(6000, asyncScheduler, {leading: true, trailing: true}),
                ).subscribe(async ({newValue, oldValue}) => {
                if (!newValue) return
                if (oldValue !== newValue) {
                    if (!this.chainListeners) {
                        this.chainListeners = new ChainListeners(this, this.wallet.address, newValue)
                        this.chainListeners.start()
                    } else {
                        this.chainListeners.switchEndpoint(newValue)
                    }
                    getNodeInfo(this.$store)
                    try {
                        const oldGenerationHash = this.generationHash
                        await getNetworkGenerationHash(this)
                        await getCurrentBlockHeight(this.$store)


                        /**
                         * ON GENERATION HASH CHANGE
                         */
                        if (oldGenerationHash !== this.generationHash || this.networkCurrency.hex === '') {
                            this.$store.commit('SET_NETWORK_MOSAICS', [])
                            this.$store.commit('SET_MOSAICS', {})
                            await setCurrentNetworkMosaic(this.$store)
                            this.onWalletChange(this.wallet)
                        } else {
                            this.onWalletChange(this.wallet)
                        }
                    } catch (error) {
                        console.error(error)
                    }
                }
            })
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
