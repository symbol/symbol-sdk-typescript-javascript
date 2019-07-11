<template>
    <div class="walletCreateWrap">
        <div class="createDiv">
            <div class="createForm">
                <p class="formTit">基本信息</p>
                <Form :model="formItem">
                    <FormItem label="网络选择">
                        <Select v-model="formItem.currentNetType" required>
                            <Option :value="item.value" v-for="(item,index) in netType" :key="index">{{item.label}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="设置钱包名">
                        <Input v-model="formItem.walletName" required placeholder="请输入钱包名"></Input>
                    </FormItem>
                    <FormItem label="设置密码">
                        <Input v-model="formItem.password" type="password" required placeholder="请设置你的钱包密码"></Input>
                        <i class="icon"><img src="@/assets/images/wallet-management/psd_hidden.png"></i>
                    </FormItem>
                    <FormItem label="重复密码">
                        <Input v-model="formItem.checkPW" type="password" required placeholder="请再次输入你的密码"></Input>
                        <i class="icon"><img src="@/assets/images/wallet-management/psd_hidden.png"></i>
                    </FormItem>
                    <FormItem>
                        <Button type="success" @click="createWallet">创建</Button>
                    </FormItem>
                </Form>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import './WalletCreate.less'
    import {NetworkType} from "nem2-sdk";

    @Component({
        components: {},
    })
    export default class WalletCreate extends Vue{
        formItem = {
            currentNetType: '',
            walletName: '',
            password: '',
            checkPW: '',
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
        createWallet () {
            this.$store.commit('SET_WALLET_LIST',[{name:'a'}])
            this.$store.commit('SET_HAS_WALLET',true)
            this.$router.push({path: '/WalletCreated'})
        }
    }
</script>

<style scoped>

</style>
