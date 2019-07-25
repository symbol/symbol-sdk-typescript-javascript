<template>
    <div class="walletCreateWrap">
        <div class="createDiv">
            <div class="createForm">
                <p class="formTit">创建钱包</p>
                <Form :model="formItem" label-position="top">
                    <FormItem label="网络选择">
                        <p class="formItemTxt">nem2 的生态系统中，你可以构建自己的主网钱包，或者私用网络钱包，或者测试网络，比如：Mainnet, Testnet, 不同网络下生成的钱包地址前缀不同</p>
                        <Select v-model="formItem.currentNetType" required>
                            <Option :value="item.value" v-for="(item,index) in netType" :key="index">{{item.label}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="设置钱包名">
                        <p class="formItemTxt">钱包名能方便你在使用中，可以区别不同的钱包等，便于更好的管理；进入系统后，你也可以钱包详情中修改</p>
                        <Input v-model="formItem.walletName" required placeholder="请输入钱包名"></Input>
                    </FormItem>
                    <FormItem label="设置密码">
                        <p class="formItemTxt">这是非常重要的，用于加密你的私钥。你的私钥会被加密存储在你的本地电脑上，一定要单独备份自己的私钥，以便在你忘记此密码时可以恢复。
                            密码设置要求，不低于六位数字，建议越复杂越好，有利于你的私钥的安全性。</p>
                        <Input v-model="formItem.password" type="password" required placeholder="请设置你的钱包密码"></Input>
                        <!--<i class="icon"><img src="@/assets/images/wallet-management/psd_hidden.png"></i>-->
                    </FormItem>
                    <FormItem label="重复密码">
                        <Input v-model="formItem.checkPW" type="password" required placeholder="请再次输入你的密码"></Input>
                        <!--<i class="icon"><img src="@/assets/images/wallet-management/psd_hidden.png"></i>-->
                    </FormItem>
                    <FormItem>
                        <div class="clear">
                            <Button class="prev left" type="default" @click="toBack">返回</Button>
                            <Button class="next right" type="success" @click="createWallet">下一步</Button>
                        </div>
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
    import {MnemonicPassPhrase} from 'nem2-hd-wallets';


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

        createMnemonic () {
            const mnemonic = MnemonicPassPhrase.createRandom('english', 128);
            this.$store.commit('SET_MNEMONIC',mnemonic.plain)
        }

        createWallet () {
            this.createMnemonic()
            this.$router.push({path: '/walletCreated',query:this.formItem})
        }
        toBack () {
            this.$router.back()
            this.$store.commit('SET_CURRENT_PANEL_INDEX', 1)
        }
    }
</script>

<style scoped>

</style>
