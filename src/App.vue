<template>
  <div id="app" :class="[isWindows?'windows':'mac']">
    <router-view/>
  </div>
</template>

<script lang="ts">
    import 'animate.css'
    import {Address} from 'nem2-sdk'
    import {mapState} from 'vuex'
    import {asyncScheduler} from 'rxjs'
    import {throttleTime} from 'rxjs/operators'
    import {isWindows} from "@/config/index.ts"
    import {
        checkInstall,
        getCurrentBlockHeight,
        getCurrentNetworkMosaic,
        getNetworkGenerationHash,
        getObjectLength,
        getTopValueInObject,
        localRead,
    } from '@/core/utils'
    import {Component, Vue} from 'vue-property-decorator'
    import {ChainListeners} from '@/core/services/listeners.ts'
    import {initMosaic, mosaicsAmountViewFromAddress, AppMosaics} from '@/core/services/mosaics'
    import {getMarketOpenPrice} from '@/core/services/marketData.ts'
    import {setTransactionList} from '@/core/services/transactions'
    import {getNamespacesFromAddress} from '@/core/services'
    import {AppMosaic, AppWallet, AppInfo, StoreAccount} from '@/core/model'
    import {MultisigApiRxjs} from "@/core/api/MultisigApiRxjs"

    @Component({
        computed: {
            ...mapState({activeAccount: 'account', app: 'app'}),
        },
    })
    export default class App extends Vue {
        isWindows = isWindows
        activeAccount: StoreAccount
        app: AppInfo
        unconfirmedTxListener = null
        confirmedTxListener = null
        txStatusListener = null
        chainListeners: ChainListeners = null
        get node(): string {
            return this.activeAccount.node
        }

        get accountPublicKey() {
            return this.activeAccount.wallet.publicKey
        }

        get wallet(): any {
            return this.activeAccount.wallet
        }

        get activeMultisigAccount(): string {
            return this.activeAccount.activeMultisigAccount
        }

        get currentXem() {
            return this.activeAccount.currentXem
        }

        get currentXEM1(): string {
            return this.activeAccount.currentXEM1
        }

        get namespaceList() {
            return this.activeAccount.namespaces
        }

        get currentNode() {
            return this.activeAccount.node
        }

        get xemDivisibility() {
            return this.activeAccount.xemDivisibility
        }

        get accountAddress() {
            return this.activeAccount.wallet.address
        }

        get mosaicList() {
            return this.activeAccount.mosaics
        }

        get transactionList() {
            // used in enrichMosaics
            return this.activeAccount.transactionList
        }

        get accountName() {
            return this.activeAccount.accountName
        }

        // @TODO: move out from there
        async setWalletsList() {
            const {accountName} = this
            if (!accountName) return
            const accountMapFromStorage: any = localRead('accountMap') !== '' ? JSON.parse(localRead('accountMap')) : false
            if (!accountMapFromStorage || !getObjectLength(accountMapFromStorage)) return
            const wallets = getTopValueInObject(accountMapFromStorage)['wallets']
            AppWallet.switchWallet(wallets[0].address, wallets, this.$store)

        }

        async onWalletChange(newWallet) {
            // reset tx list
            try {
                await Promise.all([
                    this.$store.commit('SET_TRANSACTIONS_LOADING', true),
                    this.$store.commit('SET_BALANCE_LOADING', true),
                    this.$store.commit('SET_MOSAICS_LOADING', true),
                    this.$store.commit('SET_NAMESPACE_LOADING', true),
                    this.$store.commit('SET_MULTISIG_LOADING', true),
                ])

                //@TODO: moove from there
                const mosaicListFromStorage = localRead(newWallet.address)
                const parsedMosaicListFromStorage = mosaicListFromStorage === ''
                    ? false : JSON.parse(mosaicListFromStorage)

                if (mosaicListFromStorage) await this.$store.commit('SET_MOSAICS', parsedMosaicListFromStorage)

                const initMosaicsAndNamespaces = await Promise.all([
                    // @TODO make it an AppWallet methods
                    initMosaic(newWallet, this),
                    getNamespacesFromAddress(newWallet.address, this.node),
                    setTransactionList(newWallet.address, this)
                ])

                this.$store.commit('SET_NAMESPACES', initMosaicsAndNamespaces[1] || [])
                await Promise.all([
                    this.$store.commit('SET_MOSAICS_LOADING', false),
                    this.$store.commit('SET_NAMESPACE_LOADING', false),
                ])

                new AppWallet(newWallet).setMultisigStatus(this.node, this.$store)
                
                if (!this.chainListeners) {
                    this.chainListeners = new ChainListeners(this, newWallet.address, this.node)
                    this.chainListeners.start()
                    this.chainListeners.startTransactionListeners()
                    return
                }

                this.chainListeners.switchAddress(newWallet.address)
            } catch (error) {
                console.error("App -> onWalletChange -> error", error)
                Promise.all([
                    this.$store.commit('SET_TRANSACTIONS_LOADING', false),
                    this.$store.commit('SET_BALANCE_LOADING', false),
                    this.$store.commit('SET_MOSAICS_LOADING', false),
                    this.$store.commit('SET_NAMESPACE_LOADING', false),
                    this.$store.commit('SET_MULTISIG_LOADING', false),
                ])

                if (!this.chainListeners) {
                    this.chainListeners = new ChainListeners(this, newWallet.address, this.node)
                    this.chainListeners.start()
                    return
                }

                this.chainListeners.switchAddress(newWallet.address)
            }
        }

        async onActiveMultisigAccountChange(publicKey: string): Promise<void> {
            try {
                const {node} = this
                const {networkType} = this.wallet
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
                
                await Promise.all([
                    this.$store.commit('UPDATE_MULTISIG_ACCOUNT_MOSAICS', {
                      address, mosaics: appMosaics,
                    }),
                    this.$store.commit('SET_MULTISIG_ACCOUNT_NAMESPACES', {
                      address, namespaces: appNamespaces,
                    }),
                ])

                const appMosaicsFromNamespaces = await AppMosaics().fromAppNamespaces(appNamespaces)
                await this.$store.commit('UPDATE_MULTISIG_ACCOUNT_MOSAICS', {
                      address, mosaics: appMosaicsFromNamespaces,
                })
            } catch (error) {
                throw new Error(error) 
            }
        }

        checkIfWalletExist() {
            if (!this.wallet.address) {
                this.$router.push('login')
            }
        }

        async getMultisigAccountMultisigAccountInfo(publicKey) {
            const {networkType} = this.wallet
            const accountAddress = Address.createFromPublicKey(publicKey, networkType).plain()

            try {
                const multisigAccountInfo = await new MultisigApiRxjs()
                    .getMultisigAccountInfo(accountAddress, this.node).toPromise()
                this.$store.commit('SET_MULTISIG_ACCOUNT_INFO', {
                    address: accountAddress, multisigAccountInfo,
                })
            } catch (error) {
                this.$store.commit('SET_MULTISIG_ACCOUNT_INFO', {
                    address: accountAddress, multisigAccountInfo: null,
                })
            }
        }
        /**
         * Add namespaces and divisibility to transactions and balances
         */
        async mounted() {
            this.checkIfWalletExist()
            const {accountName} = this
            // need init at start
            await this.setWalletsList()
            /**
             * On app initialisation
             */
            await Promise.all([
                this.$store.commit('SET_TRANSACTIONS_LOADING', true),
                this.$store.commit('SET_BALANCE_LOADING', true),
                this.$store.commit('SET_MOSAICS_LOADING', true),
                this.$store.commit('SET_NAMESPACE_LOADING', true),
            ])

            this.$Notice.config({duration: 4})
            const {node} = this

            getMarketOpenPrice(this)

            // @TODO: refactor
            await Promise.all([
                getNetworkGenerationHash(node, this),
                getCurrentBlockHeight(node, this.$store),
                getCurrentNetworkMosaic(node, this.$store),
            ])

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
                if (oldValue.address === undefined || newValue.address !== undefined
                    || oldValue.address !== undefined && newValue.address !== oldValue.address) {
                    this.$store.commit('RESET_MOSAICS')
                    this.$store.commit('UPDATE_MOSAICS', [new AppMosaic({
                        hex: this.currentXEM1, name: this.currentXem
                    })])
                    this.onWalletChange(newValue)
                }
            })

            this.$watchAsObservable('activeMultisigAccount')
                .pipe(
                    throttleTime(6000, asyncScheduler, {leading: true, trailing: true}),
                ).subscribe(({newValue, oldValue}) => {
                if (!newValue) return

                if (oldValue !== newValue) {
                    this.onActiveMultisigAccountChange(newValue)
                    this.getMultisigAccountMultisigAccountInfo(newValue)
                }
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
                                await getCurrentBlockHeight(node, this.$store)
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
