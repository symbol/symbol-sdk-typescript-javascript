<template>
    <div class="WalletFnWrap" :style="(!importHasWallet)&&importTabIndex ? 'width:inherit':''">
        <div class="walletFnNav">
            <ul class="navList clear">
                <li :class="[item.active?'active':'','left']"
                    v-for="(item,index) in navList"
                    :key="index"
                    @click="goToPage(item)"
                    v-if="importHasWallet||!(importTabIndex&&index == 0)"
                >{{item.name}}</li>
            </ul>
            <div class="delBtn" v-if="importHasWallet||!importTabIndex">
                <i><img :src="delBtn"></i>
                <span>删除</span>
            </div>
        </div>
        <div class="walletFnContent">
            <router-view/>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
    // @ts-ignore
    import delBtn from '@/assets/images/wallet-management/delete.png'
    import './WalletFn.less';

    @Component({
        components: {},
    })
    export default class WalletFnNavigation extends Vue{
        delBtn = delBtn
        navList = [
            {name:'钱包详情',to:'/walletDetails',active:true},
            {name:'创建',to:'/walletCreate',active:false},
            {name:'导入',to:'/walletImport',active:false},
        ]
        importTabIndex = null
        importHasWallet = false

        @Prop()
        tabIndex:any

        get importIndex () {
            return this.tabIndex
        }

        get hasWallet () {
            return this.$store.state.app.hasWallet
        }
        get query () {
            return this.$route.query
        }

        goToPage (item) {
            for(let i in this.navList){
                if(this.navList[i].to == item.to){
                    this.navList[i].active = true
                }else {
                    this.navList[i].active = false
                }
            }
            this.$router.push({path:item.to})
        }
        @Watch('hasWallet')
        onHasWalletChange(){
            this.importHasWallet = this.hasWallet
        }
        created () {
            if(this.importIndex){
                this.importTabIndex = this.importIndex
            }
        }

        @Watch('query')
        onQueryChange(){
            let index:number = Number(this.query['tabIndex'])
            if(index){
                this.goToPage(this.navList[index])
            }
        }

        mounted () {
            if(this.importTabIndex){
                this.goToPage(this.navList[this.importTabIndex])
            }else {
                this.$router.push({path:'/walletDetails'})
            }
        }
    }
</script>

<style scoped>

</style>
