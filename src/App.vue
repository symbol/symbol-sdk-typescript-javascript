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


    @Component
    export default class App extends Vue {
        node: any
        isWindows = isWindows

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
            this.$store.state.account.wallet = walletList[0]
            this.$store.state.app.walletList = walletList
        }

        async getAccountInfo(listItem) {
            let walletItem = listItem
            walletItem.mosaics = []
            let node = this.$store.state.account.node
            let currentXEM2 = this.$store.state.account.currentXEM2
            let currentXEM1 = this.$store.state.account.currentXEM1
            new AccountApiRxjs().getAccountInfo(walletItem.address, node).subscribe((accountInfo) => {
                let mosaicList = accountInfo.mosaics
                mosaicList.map((item: any) => {
                    item.hex = item.id.toHex()
                    if (item.id.toHex() == currentXEM2 || item.id.toHex() == currentXEM1) {
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
            let node = this.$store.state.account.node
            walletItem.isMultisig = false
            new AccountApiRxjs().getMultisigAccountInfo(walletItem.address, node).subscribe((multisigAccountInfo: any) => {
                multisigAccountInfo.subscribe((accountInfo) => {
                    walletItem.isMultisig = true
                }, () => {
                    walletItem.isMultisig = false
                })
            })
            return walletItem
        }

        initData() {
            if (!this.$store) {
                return
            }
            this.node = this.$store.state.account.node
            this.$Notice.config({
                duration: 4
            });
        }

        chainListner() {
            if (!this.node) {
                return
            }
            const node = this.node.replace('http', 'ws')
            const listener = new Listener(node, WebSocket)
            new ListenerApiRxjs().newBlock(listener, this)
        }

        created() {
            if (isWindows) {
                checkInstall()
            }
            this.initData()
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
