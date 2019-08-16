<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script lang="ts">
    import 'animate.css'
    import {localRead} from '@/core/utils/utils'
    import {PublicAccount, Listener} from "nem2-sdk"
    import {listenerApi} from '@/core/api/listenerApi'
    import {Component, Vue} from 'vue-property-decorator'
    import {accountApi} from '@/core/api/accountApi'
    import {checkInstall} from '@/core/utils/electron'

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
        }

        async getAccountInfo(listItem) {
            let walletItem = listItem
            let node = this.$store.state.account.node
            let currentXEM2 = this.$store.state.account.currentXEM2
            let currentXEM1 = this.$store.state.account.currentXEM1
            await accountApi.getAccountInfo({
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
            await accountApi.getMultisigAccountInfo({
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
                duration: 4
            });
        }

        chainListner() {
            const node = this.node.replace('http', 'ws')
            const listener = new Listener(node, WebSocket)
            listenerApi.newBlock({
                listener,
                pointer: this
            })
        }

        created() {
            // checkInstall()
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
