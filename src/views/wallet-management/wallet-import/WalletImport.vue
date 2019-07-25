<template>
    <div class="walletImportWrap scroll radius">
        <div class="seeting_main_container">
            <div class="left_navigator left">
                <div class="navigator_item pointer" @click="jumpToView(n,index)" v-for="(n,index) in navagatorList">
                    <span :class="n.isSelected ? 'selected_title':''">{{$t(n.title)}}</span>
                </div>
            </div>
            <div class="right_view right">
                <div class="top_title">
                    {{$t('import')}}{{$t(currentHeadText)}}
                </div>
                <div class="main_view">
                    <router-view/>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import './WalletImport.less'
    import {NetworkType} from "nem2-sdk";

    @Component({
        components: {},
    })
    export default class WalletImport extends Vue{
        currentTab = 'mnemonic'
        mnemonic = {
            mnemonic:'',
            password: '',
        }
        privateKey = {
            privateKey:'',
            password: '',
            checkPW: '',
        }
        keystore = {
            keystore:'',
            password: '',
        }
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

        navagatorList = [
            {
                title: 'mnemonic',
                name: 'walletImportMnemonic',
                isSelected: true
            }, {
                title: 'privatekey',
                name: 'walletImportPrivatekey',
                isSelected: false
            }, {
                title: 'keystore',
                name: 'walletImportKeystore',
                isSelected: false
            }
        ]
        currentHeadText = ''

        jumpToView(n, index) {
            let list = this.navagatorList
            list.map((item) => {
                item.isSelected = false
                return item
            })
            list[index].isSelected = true
            this.navagatorList = list
            this.currentHeadText = n.title
            this.$router.push({
                name: n.name
            })
        }

        created() {
            this.currentHeadText = this.navagatorList[0].title
            this.$store.commit('SET_CURRENT_PANEL_INDEX', 1)
        }

        changeTab (name) {
            this.currentTab = name
        }
        success (title,desc) {
            this.$Notice.success({
                title: title,
                desc:  desc?desc:''
            });
        }
        importWallet () {
            switch (this.currentTab) {
                case 'mnemonic':
                    this.$store.commit('SET_WALLET_LIST',[{name:'a'}])
                    this.$store.commit('SET_HAS_WALLET',true)
                    this.success('成功导入钱包','')
                    this.mnemonic = {
                        mnemonic:'',
                        password: '',
                    }
                    break;
                case 'privateKey':
                    this.$store.commit('SET_WALLET_LIST',[{name:'a'}])
                    this.$store.commit('SET_HAS_WALLET',true)
                    this.success('成功导入钱包','')
                    this.privateKey = {
                        privateKey:'',
                        password: '',
                        checkPW: '',
                    }
                    break;
                case 'keystore':
                    this.$store.commit('SET_WALLET_LIST',[{name:'a'}])
                    this.$store.commit('SET_HAS_WALLET',true)
                    this.success('成功导入钱包','')
                    this.keystore = {
                        keystore:'',
                        password: '',
                    }
                    break;
            }
        }
    }
</script>

<style scoped>

</style>
