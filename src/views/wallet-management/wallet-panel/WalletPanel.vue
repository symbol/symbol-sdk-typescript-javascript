<template>
    <div class="WalletPanelWrap clear" v-if="!reload">
        <div class="hasWalletPanel" v-if="toFn||walletList.length > 0">
            <div class="left WalletSwitch" v-if="walletList.length > 0">
                <WalletSwitch :walletList="walletList" @reload="onReloadChange" @setWalletList="setWalletList"></WalletSwitch>
            </div>
            <div :class="[walletList.length > 0?'left':'ML30' ,'WalletFn']">
                <WalletFn :tabIndex="WalletFnTabIndex"></WalletFn>
            </div>
        </div>
        <div class="noWalletPanel" v-if="(!toFn)&&walletList.length <= 0">
            <div class="noWallet" v-if="!WalletFnTabIndex">
                <GuideInto @toCreate="toCreate" @toImport="toImport"></GuideInto>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import WalletSwitch from '@/views/wallet-management/wallet-switch/WalletSwitch.vue';
    import WalletFn from '@/views/wallet-management/wallet-fn/WalletFn.vue';
    import GuideInto from '@/views/login/guide-into/guideInto.vue';
    import './WalletPanel.less';

    @Component({
        components: {
            WalletSwitch,
            WalletFn,
            GuideInto
        },
    })
    export default class WalletPanel extends Vue{
        walletList = []
        WalletFnTabIndex = null
        toFn = false
        reload = false

        get nowWalletList () {
            return this.$store.state.app.walletList
        }

        get reloadWalletPage () {
            return this.$store.state.app.reloadWalletPage
        }

        toCreate () {
            this.toFn = true
            this.$store.commit('SET_HAS_WALLET',false)
            this.WalletFnTabIndex = 1
         }

        toImport () {
            this.toFn = true
            this.$store.commit('SET_HAS_WALLET',false)
            this.WalletFnTabIndex = 2
        }

        setWalletList () {
            for(let i in this.nowWalletList){
                this.$set(this.walletList,i,this.nowWalletList[i])
            }
            if(this.walletList.length > 0){
                this.$store.commit('SET_HAS_WALLET',true)
            }
        }

        onReloadChange(){
            if(this.nowWalletList.len() < 1){
                this.toFn = false
                this.$store.commit('SET_HAS_WALLET',false)
            }
            this.reload = false
            setTimeout(()=>{
                this.reload = true
            },0)
        }

        setDefaultPage(){
            const name = this.$route.params.name
            if(name == 'walletImportKeystore'){
                this.toImport()
            }else if(name == 'walletCreate'){
                this. toCreate()
            }
        }
        setLeftSwitchIcon(){
            this.$store.commit('SET_CURRENT_PANEL_INDEX', 1)

        }

        created(){
            this.setLeftSwitchIcon()
            this.setDefaultPage()
            this.setWalletList()
        }
    }
</script>

<style scoped>

</style>
