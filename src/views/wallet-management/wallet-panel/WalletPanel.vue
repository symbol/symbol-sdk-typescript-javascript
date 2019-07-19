<template>
    <div class="WalletPanelWrap clear">
        <div class="hasWalletPanel" v-if="toFn||walletList.length > 0">
            <div class="left WalletSwitch" v-if="walletList.length > 0">
                <WalletSwitch></WalletSwitch>
            </div>
            <div :class="[walletList.length > 0?'left':'ML30' ,'WalletFn']">
                <WalletFn :tabIndex="WalletFnTabIndex"></WalletFn>
            </div>
        </div>
        <div class="noWalletPanel" v-if="(!toFn)&&walletList.length <= 0">
            <div class="noWallet" v-if="!WalletFnTabIndex">
                <p class="remindTxt">你还没有任何钱包</p>
                <div class="btns">
                    <Row>
                        <Col span="12">
                            <Button type="success" @click="toCreate">创建</Button>
                        </Col>
                        <Col span="12">
                            <Button type="success" @click="toImport">导入</Button>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import WalletSwitch from '@/views/wallet-management/wallet-switch/WalletSwitch.vue';
    import WalletFn from '@/views/wallet-management/wallet-fn/WalletFn.vue';
    import './WalletPanel.less';

    @Component({
        components: {
            WalletSwitch,
            WalletFn
        },
    })
    export default class WalletPanel extends Vue{
        walletList = []
        WalletFnTabIndex = null
        toFn = false

        get nowWalletList () {
            return this.$store.state.app.walletList
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
        @Watch('nowWalletList')
        onNowWalletListChange(){
           for(let i in this.nowWalletList){
               this.$set(this.walletList,i,this.nowWalletList[i])
           }
           if(this.walletList.length > 0){
               this.$store.commit('SET_HAS_WALLET',true)
           }
        }

        created(){
            this.$store.commit('SET_CURRENT_PANEL_INDEX', 1)
            const name = this.$route.params.name
            if(name == 'walletImportKeystore'){
                this.toImport()
            }else if(name == 'walletCreate'){
                this. toCreate()
            }
        }
    }
</script>

<style scoped>

</style>
