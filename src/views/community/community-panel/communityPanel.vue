<template>
    <div class="communityPanelWrap clear">
        <div class="communityPanel">
            <div class="communityPanelNav">
                <ul class="navList clear">
                    <li :class="[item.active?'active':'','left']"
                        v-for="(item,index) in navList"
                        :key="index"
                        @click="goToPage(item)"
                    >{{item.name}}</li>
                </ul>
            </div>
            <div class="contentPanel">
                <router-view/>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import './communityPanel.less';

    @Component({
        components: {},
    })
    export default class communityPanel extends Vue{
        walletList = []
        navList = [
            {name:'资讯',to:'/information',active:true},
            {name:'投票',to:'/vote',active:false},
        ]

        get nowWalletList () {
            return this.$store.state.app.walletList
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
    }
</script>

<style scoped>

</style>
