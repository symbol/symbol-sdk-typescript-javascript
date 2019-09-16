<template>
  <div id="app" :class="[isWindows?'windows':'mac']">
    <router-view/>
  </div>
</template>

<script lang="ts">
    import 'animate.css'
    import {mapState} from 'vuex'
    import {from, interval, asyncScheduler, of} from 'rxjs'
    import {toArray, flatMap, concatMap, map, tap, throttleTime, finalize, mergeMap} from 'rxjs/operators'
    import {
        Listener, NamespaceHttp, NamespaceId, Address, MosaicHttp, MosaicId,
        MosaicService, AccountHttp, UInt64, MosaicInfo, MosaicAlias
    } from "nem2-sdk"

    import {isWindows, Message, nodeConfig} from "@/config/index.ts"
    import {localRead, getRelativeMosaicAmount} from '@/core/utils/utils.ts'
    import {AppWallet, getMosaicList, getMosaicInfoList, getNamespaces} from '@/core/utils/wallet.ts'
    import {checkInstall} from '@/core/utils/electron.ts'
    import {AccountApiRxjs} from '@/core/api/AccountApiRxjs.ts'
    import {ListenerApiRxjs} from '@/core/api/ListenerApiRxjs.ts'
    import {Component, Vue, Watch} from 'vue-property-decorator'
    import {BlockApiRxjs} from '@/core/api/BlockApiRxjs.ts'
    import {ChainListeners} from '@/core/services/listeners.ts'
    import {getNetworkGenerationHash, getCurrentNetworkMosaic} from '@/core/utils/network.ts'
    import {aliasType} from '@/config/index.ts'
    import {mosaicsAmountViewFromAddress, initMosaic, enrichMosaics, AppMosaics} from '@/core/services/mosaics'
    import {getMarketOpenPrice} from '@/core/services/marketData.ts'
    import {setTransactionList} from '@/core/services/transactions'

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
            return this.activeAccount.namespace
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

        // @TODO: move out from there
        async setWalletsList() {
            const walletListFromStorage: any = localRead('wallets') !== '' ? JSON.parse(localRead('wallets')) : false
            if (!walletListFromStorage || !walletListFromStorage.length) return
            AppWallet.switchWallet(walletListFromStorage[0].address, walletListFromStorage, this.$store)

        }

        async onWalletChange(newWallet) {
            try {
                await Promise.all([
                    this.$store.commit('SET_TRANSACTIONS_LOADING', true),
                    this.$store.commit('SET_BALANCE_LOADING', true),
                    this.$store.commit('SET_MOSAICS_LOADING', true),
                ])
    
                const res = await Promise.all([
                    // @TODO make it an AppWallet methods
                    initMosaic(newWallet, this),
                    getNamespaces(newWallet.address, this.node),
                    setTransactionList(newWallet.address, this)
                ])

                this.$store.commit('SET_NAMESPACE', res[1] || [])
                enrichMosaics(this)
                new AppWallet(newWallet).setMultisigStatus(this.node, this.$store)

                if (!this.chainListeners) {
                    this.chainListeners = new ChainListeners(this, newWallet.address, this.node)
                    this.chainListeners.start()
                    this.chainListeners.startTransactionListeners()
                } else {
                    this.chainListeners.switchAddress(newWallet.address)
                }
            } catch (error) {
                console.error(error, 'ERROR')
            }
        }

        /**
         * Add namespaces and divisibility to transactions and balances
         */
        async mounted() {
            /**
             * On app initialisation
             */
            await Promise.all([
                this.$store.commit('SET_TRANSACTIONS_LOADING', true),
                this.$store.commit('SET_BALANCE_LOADING', true),
                this.$store.commit('SET_MOSAICS_LOADING', true),
            ])

            this.$Notice.config({ duration: 4 })
            const {node} = this

            getMarketOpenPrice(this)
            await getNetworkGenerationHash(node, this)
            await getCurrentNetworkMosaic(node, this.$store)
            await this.setWalletsList()

            if (this.wallet && this.wallet.address) {
                this.onWalletChange(this.wallet)
            } 
            /**
             * START EVENTS LISTENERS
             */
            this.$watchAsObservable('wallet')
                .pipe(
                    throttleTime(6000,asyncScheduler, {leading: true, trailing: true}),
                ).subscribe(({newValue, oldValue}) => {
                    /**
                     * On first wallet set
                     */
                    if(oldValue.address === undefined || newValue.address !== undefined) {
                        // @TODO
                    }
                    
                    /**
                     * On Wallet Change
                     */
                    if (oldValue.address !== undefined && newValue.address !== oldValue.address) {
                        const appMosaics = AppMosaics()
                        appMosaics.reset(this.$store)
                        const networkMosaic = {hex: this.currentXEM1, name: this.currentXem}
                        appMosaics.addNetworkMosaic(networkMosaic, this.$store)
                        this.onWalletChange(newValue)
                    }
                })


            this.$store.subscribe(async (mutation, state) => {
              switch(mutation.type) {
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
                    break;
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
