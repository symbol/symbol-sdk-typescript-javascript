<template>
  <div id="app" :class="[isWindows?'windows':'mac']">
    <router-view/>
  </div>
</template>

<script lang="ts">
    import 'animate.css'
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
    import {initMosaic} from '@/core/services/mosaics'
    import {getMarketOpenPrice} from '@/core/services/marketData.ts'
    import {setTransactionList} from '@/core/services/transactions'
    import {AppMosaic, AppWallet} from '@/core/model'
    import {getNamespaces} from "@/core/services/namespace";

    @Component({
        computed: {
            ...mapState({activeAccount: 'account', app: 'app'}),
        },
    })
    export default class App extends Vue {
        isWindows = isWindows
        activeAccount: any
        app: any
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

        get currentXem() {
            return this.activeAccount.currentXem
        }

        get currentXEM1(): string {
            return this.activeAccount.currentXEM1
        }

        get namespaceList() {
            return this.activeAccount.namespaces
        }

        get preBlockInfo() {
            return this.app.chainStatus.preBlockInfo
        }

        get currentBlockInfo() {
            return this.app.chainStatus.currentBlockInfo
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
                ])

                //@TODO: moove from there
                const mosaicListFromStorage = localRead(newWallet.address)
                const parsedMosaicListFromStorage = mosaicListFromStorage === ''
                    ? false : JSON.parse(mosaicListFromStorage)

                if (mosaicListFromStorage) await this.$store.commit('SET_MOSAICS', parsedMosaicListFromStorage)

                const initMosaicsAndNamespaces = await Promise.all([
                    // @TODO make it an AppWallet methods
                    initMosaic(newWallet, this),
                    getNamespaces(newWallet.address, this.node),
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
                } else {
                    this.chainListeners.switchAddress(newWallet.address)
                }
            } catch (error) {
                this.$store.commit('SET_TRANSACTIONS_LOADING', false)
                this.$store.commit('SET_BALANCE_LOADING', false)
                this.$store.commit('SET_MOSAICS_LOADING', false)
                this.$store.commit('SET_NAMESPACE_LOADING', false)
                if (!this.chainListeners) {
                    this.chainListeners = new ChainListeners(this, newWallet.address, this.node)
                    this.chainListeners.start()
                } else {
                    this.chainListeners.switchAddress(newWallet.address)
                }
                console.error("App -> onWalletChange -> error", error)
            }
        }



        checkIfWalletExist() {
            if (!this.wallet.address) {
                this.$router.push('login')
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
            await getNetworkGenerationHash(node, this)
            await getCurrentBlockHeight(node, this.$store)
            await getCurrentNetworkMosaic(node, this.$store)

            if (this.wallet && this.wallet.address) {
                this.onWalletChange(this.wallet)
            }
            /**
             * START EVENTS LISTENERS
             */
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
