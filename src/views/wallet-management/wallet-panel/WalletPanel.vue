<template>
    <div class="WalletPanelWrap clear">
        <div class="left WalletSwitch">
            <WalletSwitch></WalletSwitch>
        </div>
        <div class="left WalletFn">
            <WalletFn></WalletFn>
        </div>
    </div>
</template>

<script>
    import { Component, Vue } from 'vue-property-decorator';
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

    }
</script>

<style scoped>

</style>
