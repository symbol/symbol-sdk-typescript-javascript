<template>
    <div class="walletSwitchWrap">
        <div class="walletSwitchHead">
            <p class="tit">钱包管理</p>
            <!--<div class="changeNetType">-->
                <!--<Select  @on-change="changeNetType" v-model="currentNetType">-->
                    <!--<Option v-for="item in netType" :value="item.value" :key="item.value">{{ item.label }}</Option>-->
                <!--</Select>-->
            <!--</div>-->
        </div>
        <div class="walletList">
            <div :class="['walletItem', item.active ? 'active':'']" v-for="(item, index) in walletList" :key="index">
               <Row>
                   <Col span="17">
                       <div>
                           <p class="walletName">{{item.name}}</p>
                           <p class="walletAmount">{{item.balance}}&nbsp;<span class="tails">XEM</span> </p>
                       </div>
                   </Col>
                   <Col span="7">
                       <div>
                           <p class="walletTypeTxt">公共账户</p>
                           <div class="options">
                               <Poptip  placement="bottom">
                                  <img src="../../../assets/images/wallet-management/moreActive.png" v-if="item.active">
                                  <img src="../../../assets/images/wallet-management/more.png" v-else>
                                   <div slot="content">
                                       <p class="optionItem" @click="delWallet(index, item.active)">
                                           <i><img src="../../../assets/images/wallet-management/delete.png"></i>
                                           <span>删除</span>
                                       </p>
                                   </div>
                               </Poptip>
                           </div>
                       </div>
                   </Col>
               </Row>

            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
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
        walletList = []
        currentNetType = this.netType[0].value

        get getWalletList () {
            let list = this.$store.state.app.walletList
            list.map((item,index)=>{
                if(index === 0){
                    item.active = true
                }else {
                    item.active = false
                }
            })
            return list
        }

        delWallet (index, current) {
            let list = this.walletList;
            list.splice(index,1)
            if(list.length < 1){
                this.$emit('noHasWallet')
            }else {
                if(current){
                    this.$store.commit('SET_WALLET', this.walletList[0])
                }
            }
            this.$store.commit('SET_WALLET_LIST',list)
            this.$emit('reload')
        }

        initWalletList () {
            const list = this.getWalletList
            for(let i in list){
                this.$set(this.walletList,i,list[i])
            }
            if(this.walletList.length > 0){
                this.$emit('hasWallet')
                this.$store.commit('SET_HAS_WALLET',true)
            }else {
                this.$store.commit('SET_HAS_WALLET',false)
            }
        }

        @Watch('getWalletList')
        onNowWalletListChange(){
            this.$emit('setWalletList')
            this.initWalletList()
        }

        created () {
            this.initWalletList()
        }
    }
</script>

<style scoped>

</style>
