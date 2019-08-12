<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script lang="ts">
    import 'animate.css'
    import fs from 'fs'
    import {localRead} from '@/help/help'
    import {PublicAccount, Listener} from "nem2-sdk"
    import {wsInterface} from '@/interface/sdkListener'
    import {Component, Vue} from 'vue-property-decorator'
    import {accountInterface} from '@/interface/sdkAccount'

    @Component
    export default class App extends Vue {
        node: any

        async initApp() {
            let walletList: any = localRead('wallets') ? JSON.parse(localRead('wallets')) : []
            const that = this
            for (let i in walletList) {
                walletList[i].iv = walletList[i].iv.data
                let style = 'walletItem_bg_' + String(Number(i) % 3)
                walletList[i].style = style
                await that.getAccountInfo(walletList[i]).then((data) => {
                    walletList[i] = data
                })
                await that.getMultisigAccount(walletList[i]).then((data) => {
                    walletList[i] = data
                })
            }
            this.$store.state.account.wallet = walletList[0]
            this.$store.state.app.walletList = walletList
            this.$store.state.app.isInLoginPage = true
            this.$router.push({
                name: 'login'
            })
        }

        async getAccountInfo(listItem) {
            let walletItem = listItem
            let node = this.$store.state.account.node
            let currentXEM2 = this.$store.state.account.currentXEM2
            let currentXEM1 = this.$store.state.account.currentXEM1
            await accountInterface.getAccountInfo({
                node,
                address: walletItem.address
            }).then(async accountInfoResult => {
                await accountInfoResult.result.accountInfo.subscribe((accountInfo) => {
                    let mosaicList = accountInfo.mosaics
                    mosaicList.map((item) => {
                        item.hex = item.id.toHex()
                        if (item.id.toHex() == currentXEM2 || item.id.toHex() == currentXEM1) {
                            walletItem.balance = item.amount.compact() / 1000000
                        }
                    })
                    walletItem.mosaics = mosaicList
                }, () => {
                    walletItem.balance = 0
                })
                walletItem.publicAccount = PublicAccount.createFromPublicKey(walletItem.publicKey, walletItem.networkType)
            })
            return walletItem
        }

        async getMultisigAccount(listItem) {
            let walletItem = listItem
            let node = this.$store.state.account.node
            await accountInterface.getMultisigAccountInfo({
                node: node,
                address: walletItem.address
            }).then((multisigAccountInfo) => {
                if (typeof (multisigAccountInfo.result.multisigAccountInfo) == 'object') {
                    multisigAccountInfo.result.multisigAccountInfo['subscribe']((accountInfo) => {
                        walletItem.isMultisig = true
                    }, () => {
                        walletItem.isMultisig = false
                    })
                }
            })
            return walletItem
        }

        initData() {
            this.node = this.$store.state.account.node
            this.$Notice.config({
                duration: 3
            });
        }

        chainListner() {
            const node = this.node.replace('http', 'ws')
            const listener = new Listener(node, WebSocket)
            wsInterface.newBlock({
                listener,
                pointer: this
            })
        }
        checkInstall () {
            if(fs.readdirSync){
                const root = fs.readdirSync('./')
                console.log(root)
            }else {
                console.log('web')
            }
        }
        created() {
            this.checkInstall()
            this.initData()
            this.initApp()
            this.chainListner()
        }
    }
</script>

<style lang="less">
  @import "./common/css/common.less";
  @import "./common/css/iview.less";
</style>
