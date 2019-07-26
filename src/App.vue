<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {localRead} from './utils/util'
    import {accountInterface} from './interface/sdkAccount';

    @Component
    export default class App extends Vue {
        initData() {
            let walletList = localRead('wallets') ? JSON.parse(localRead('wallets')) : []
            // for (let i in walletList) {
            //     walletList[i].iv = walletList[i].iv.data
            //     walletList[i].style = 'walletItem_bg_2' + i % 3
            //
            // }
            const that = this
            walletList = walletList.map((item, index) => {
                item.iv = item.iv.data
                item.style = 'walletItem_bg_' + index % 3
                // console.log(item)
                // await that.getMosaicList(item).then((data) => {
                //     item = data
                // })
                return item
            })
            this.$store.state.account.wallet = walletList[0]
            this.$store.state.app.walletList = walletList
            console.log(walletList)
            this.$store.state.app.isInLoginPage = true

            if (this.$store.state.app.walletList.length == 0) {
                this.$router.push({
                    name: 'login'
                })
            } else {
                this.$router.push({
                    name: 'reLogin'
                })
            }
        }

        async getMosaicList(listItem) {
            const that = this
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
                }, () => {
                    // console.log(walletItem,".............")
                    walletItem.balance = 0
                })
            })
            return walletItem
        }

        created() {
            this.initData()
            // if (window['electron']) {
            //     const ipcRenderer = window['electron']['ipcRenderer']
            //     ipcRenderer.send('app', 'max')
            // }
            const lock = localRead('lock')
        }
    }
</script>

<style lang="less">
  @import "./assets/css/common.less";
  @import "./assets/css/iview.less";
</style>
