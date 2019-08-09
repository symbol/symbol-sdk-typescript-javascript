<template>
    <div class="WalletFnWrap" >
        <div class="walletFnNav">
            <ul class="navList clear">
                <li :class="[item.active?'active':'','left']"
                    v-for="(item,index) in navList"
                    :key="index"
                    @click="goToPage(item,index)"
                >{{$t(item.name)}}</li>
            </ul>
        </div>
        <div class="walletFnContent">
            <WalletCreate v-if="Index === 0 && !walletCreated" @isCreated="isCreated" @closeCreate="closeCreate"></WalletCreate>
            <WalletCreated :createForm='createForm' @toWalletDetails="toWalletDetails" @closeCreated="closeCreated" v-if="walletCreated"></WalletCreated>
            <WalletImport v-if="Index === 1" @toWalletDetails="toWalletDetails" @closeImport="closeImport"></WalletImport>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
    import WalletCreate from '@/views/wallet-management/wallet-create/WalletCreate.vue';
    import WalletCreated from '@/views/wallet-management/wallet-created/WalletCreated.vue';
    import WalletImport from '@/views/wallet-management/wallet-import/WalletImport.vue';
    // @ts-ignore
    import './WalletFn.less';

    @Component({
        components: {
            WalletCreate,
            WalletCreated,
            WalletImport
        },
    })
    export default class WalletFnNavigation extends Vue{
        @Prop()
        tabIndex:any

        navList = [
            {name:'create',to:'/walletCreate',active:true},
            {name:'import',to:'/walletImportKeystore',active:false},
        ]
        Index = 0
        walletCreated = false
        createForm = {}

        get tabIndexNumber () {
            return this.tabIndex
        }

        isCreated (form) {
            this.createForm = form
            this.walletCreated = true
        }

        closeCreated () {
            this.walletCreated = false
        }

        closeCreate () {
            this.$emit('backToGuideInto')
        }

        closeImport () {
            this.$emit('backToGuideInto')
        }

        toWalletDetails () {
            this.$emit('toWalletDetails')
        }

        goToPage (item,index) {
            for(let i in this.navList){
                if(this.navList[i].to == item.to){
                    this.navList[i].active = true
                }else {
                    this.navList[i].active = false
                }
            }
            this.Index = index
        }
        @Watch('tabIndexNumber')
        onTabIndexNumberChange() {
            this.Index = this.tabIndexNumber
            this.goToPage(this.navList[this.tabIndexNumber], this.Index)
        }
    }
</script>

<style scoped>

</style>
