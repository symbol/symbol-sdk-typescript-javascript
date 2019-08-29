<template>
  <div id="app" :class="[isWindows?'windows':'mac']">
    <router-view/>
  </div>
</template>

<script lang="ts">
    import 'animate.css'
    import {isWindows} from "@/config/index.ts"
    import {localRead} from '@/core/utils/utils.ts'
    import {PublicAccount, Listener} from "nem2-sdk"
    import {checkInstall} from '@/core/utils/electron.ts'
    import {AccountApiRxjs} from '@/core/api/AccountApiRxjs.ts'
    import {ListenerApiRxjs} from '@/core/api/ListenerApiRxjs.ts'
    import {Component, Vue} from 'vue-property-decorator'
    import {mapState} from 'vuex';


    @Component({
        computed: {
            ...mapState({activeAccount: 'account'})
        }
    })
    export default class App extends Vue {
        isWindows = isWindows
        activeAccount: any

        get node(): string {
            return this.activeAccount.node
        }

        get currentXEM2(): string {
            return this.activeAccount.currentXEM2
        }

        get currentXEM1(): string {
            return this.activeAccount.currentXEM1
        }

        async initApp() {
            let walletList: any = localRead('wallets') ? JSON.parse(localRead('wallets')) : []
            const that = this
            for (let i in walletList) {
                walletList[i].iv = walletList[i].iv.data
                let style = 'walletItem_bg_' + String(Number(i) % 3)
                walletList[i].style = style
                that.getAccountInfo(walletList[i]).then((data) => {
                    walletList[i] = data
                })
                that.getMultisigAccount(walletList[i]).then((data) => {
                    walletList[i] = data
                })
            }
            this.$store.commit('SET_WALLET', walletList[0])
            this.$store.commit('SET_WALLET_LIST', walletList)
        }

        async getAccountInfo(listItem) {
            let walletItem = listItem
            walletItem.mosaics = []

            new AccountApiRxjs().getAccountInfo(walletItem.address, this.node)
                .subscribe((accountInfo) => {
                    let mosaicList = accountInfo.mosaics
                    mosaicList.map((item: any) => {
                        item.hex = item.id.toHex()
                        if (item.id.toHex() === this.currentXEM2
                            || item.id.toHex() === this.currentXEM1) {
                            walletItem.balance = item.amount.compact() / 1000000
                        }
                    })
                    walletItem.mosaics = mosaicList
                }, (error) => {
                    walletItem.mosaics = []
                })
            return walletItem
        }

        async getMultisigAccount(listItem) {
            let walletItem = listItem
            walletItem.isMultisig = false
            new AccountApiRxjs().getMultisigAccountInfo(walletItem.address, this.node).subscribe((multisigAccountInfo: any) => {
                walletItem.isMultisig = true
            }, () => {
                walletItem.isMultisig = false
            })
            return walletItem
        }

        chainListner() {
            if (!this.node) {
                return
            }
            const node = this.node.replace('http', 'ws')
            const listener = new Listener(node, WebSocket)
            new ListenerApiRxjs().newBlock(listener, this)
        }

        mounted() {
            this.$Notice.config({
                duration: 4
            });
        }

        created() {
            if (isWindows) {
                checkInstall()
            }
            this.initApp()
            this.chainListner()
        }
    }
</script>

<style lang="less">
  @import "./common/css/common.less";
  @import "./common/css/ivewWindows.less";
  @import "./common/css/iviewMac.less";
</style>
