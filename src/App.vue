<template>
  <div id="app" :class="[isWindows?'windows':'mac']">
    <router-view/>
  </div>
</template>

<script lang="ts">
    import 'animate.css'
    import {isWindows} from "@/config/index.ts"
    import {localRead, localSave} from '@/core/utils/utils.ts'
    import {AppWallet} from '@/core/utils/wallet.ts'
    import {Listener} from "nem2-sdk"
    import {checkInstall} from '@/core/utils/electron.ts'
    import {AccountApiRxjs} from '@/core/api/AccountApiRxjs.ts'
    import {ListenerApiRxjs} from '@/core/api/ListenerApiRxjs.ts'
    import {Component, Vue} from 'vue-property-decorator'
    import {mapState} from 'vuex'

    @Component({
        computed: {
            ...mapState({activeAccount: 'account', app: 'app'})
        }
    })
    export default class App extends Vue {
        isWindows = isWindows
        activeAccount: any
        app: any

        get node(): string {
            return this.activeAccount.node
        }

        get wallet(): any {
            return this.activeAccount.wallet
        }

        get currentXEM2(): string {
            return this.activeAccount.currentXEM2
        }

        get currentXEM1(): string {
            return this.activeAccount.currentXEM1
        }

        get preBlockInfo() {
            return this.app.chainStatus.preBlockInfo
        }

        get currentBlockInfo() {
            return this.app.chainStatus.currentBlockInfo
        }

        // chainStatus: {
        //     currentHeight: 0,
        //     currentGenerateTime: 12,
        //     numTransactions: 0,
        //     currentBlockInfo: {},
        //     preBlockInfo: {},
        //     signerPublicKey: '',
        //     nodeAmount: 4
        // }
        initApp() {
            const walletListFromStorage: any = localRead('wallets') !== '' ? JSON.parse(localRead('wallets')) : false
            if (!walletListFromStorage) return
            AppWallet.switchWallet(walletListFromStorage[0].address, walletListFromStorage, this.$store)
            this.setWalletsBalancesAndMultisigStatus(walletListFromStorage)
        }

        async setWalletsBalancesAndMultisigStatus(walletListFromStorage) {
            const networkCurrencies = [this.currentXEM1, this.currentXEM2]
            try {
                const balances = await Promise.all(
                    [...walletListFromStorage]
                      .map(wallet => new AppWallet(wallet)
                      .getAccountBalance(networkCurrencies, this.node))
                  )
                const walletListWithBalances = [...walletListFromStorage].map((wallet, i) => ({...wallet, balance: balances[i]}))
                const activeWalletWithBalance = walletListWithBalances.find(wallet => wallet.address === this.wallet.address)
                if (activeWalletWithBalance === undefined) throw new Error('an active wallet was not found in the wallet list')
                this.$store.commit('SET_WALLET_LIST', walletListWithBalances)
                this.$store.commit('SET_WALLET', activeWalletWithBalance)
                localSave('wallets', JSON.stringify(walletListWithBalances))

                const multisigStatuses = await Promise.all(
                    [...walletListFromStorage]
                      .map(wallet => new AppWallet(wallet)
                      .setMultisigStatus(this.node))
                  )

                const walletListWithMultisigStatuses = [...walletListWithBalances]
                    .map((wallet, i) => ({...wallet, isMultisig: multisigStatuses[i]}))

                const activeWalletWithMultisigStatus = walletListWithMultisigStatuses
                  .find(wallet => wallet.address === this.wallet.address)
                if (activeWalletWithMultisigStatus === undefined) throw new Error('an active wallet was not found in the wallet list')
                this.$store.commit('SET_WALLET_LIST', walletListWithMultisigStatuses)
                this.$store.commit('SET_WALLET', activeWalletWithMultisigStatus)
                localSave('wallets', JSON.stringify(walletListWithMultisigStatuses))
            } catch (error) {
              // Use this error for network status
              throw new Error(error)
            }
        }

        chainListner() {
            if (!this.node) {
                return
            }
            const {currentBlockInfo, preBlockInfo} = this
            const node = this.node.replace('http', 'ws')
            const listener = new Listener(node, WebSocket)
            new ListenerApiRxjs().newBlock(listener, currentBlockInfo, preBlockInfo, this.setChainStatus)
        }

        setChainStatus(chainStatus) {
            this.$store.commit('SET_CHAIN_STATUS', chainStatus)
        }

        mounted() {
            this.$Notice.config({
                duration: 4,
            })
            this.initApp()
            this.chainListner()
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
