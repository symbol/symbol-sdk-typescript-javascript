<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {localRead} from './utils/util'
    import {accountInterface} from './interface/sdkAccount';
    import {wsInterface} from './interface/sdkListener'
    import {PublicAccount, Listener} from "nem2-sdk";
    import 'animate.css'

    @Component
    export default class App extends Vue {
        node: any;

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

            if (!localRead('lock')) {
                this.$router.push({
                    name: 'login'
                })
            } else {
                this.$router.push({
                    name: 'reLogin'
                })
            }
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
                        console.log('not multisigAccount')
                        walletItem.isMultisig = false
                    })
                }
            })
            return walletItem
        }

        initData() {
            this.node = this.$store.state.account.node
        }


        chainListner() {
            const {node} = this
            // todo
            const listener = new Listener('ws://192.168.0.105:3000', WebSocket)
            wsInterface.newBlock({
                listener,
                pointer: this
            })
        }

        created() {
            this.initData()
            this.initApp()
            this.chainListner()
        }
    }
</script>

<style lang="less">
  @import "./assets/css/common.less";
  @import "./assets/css/iview.less";
</style>
