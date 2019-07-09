<template>
    <div class="walletSwitchWrap">
        <div class="walletSwitchHead">
            <p class="tit">钱包管理</p>
            <div class="changeNetType">
                <Select  @on-change="changeNetType" v-model="currentNetType">
                    <Option v-for="item in netType" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </div>
        </div>
        <div class="walletList">
            <div class="walletItem active">
                <p class="walletName">Test Wallet</p>
                <p class="walletAmount">800,000,000<span class="tails">XEM</span> </p>
            </div>
        </div>
    </div>
</template>

<script>
    import {Component, Vue} from 'vue-property-decorator';
    import {NetworkType} from  'nem2-sdk'
    import './WalletSwitch.less'
    @Component
    export default class WalletSwitchWrap extends Vue {
        netType = [
            {
                value:NetworkType.MIJIN_TEST,
                label:'MIJIN_TEST'
            },{
                value:NetworkType.MAIN_NET,
                label:'MAIN_NET'
            },{
                value:NetworkType.TEST_NET,
                label:'TEST_NET'
            },{
                value:NetworkType.MIJIN,
                label:'MIJIN'
            },
        ]
        currentNetType = this.netType[0].value

        changeNetType () {

        }
    }
</script>

<style scoped>

</style>
