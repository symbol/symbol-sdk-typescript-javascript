<template>
    <div class="WalletFnWrap">
        <div class="walletFnNav">
            <ul class="navList clear">
                <li class="active left">钱包详情</li>
                <li class="left">创建</li>
                <li class="left">导入</li>
            </ul>
        </div>
        <div class="walletFnContent">
            <router-view/>
        </div>
    </div>
</template>

<script>
    import { Component, Vue } from 'vue-property-decorator';
    import './WalletFn.less';

    @Component({
        components: {},
    })
    export default class WalletFnNavigation extends Vue{

    }
</script>

<style scoped>

</style>
