<template>
    <div class="walletImportWrap">
        <div class="importDiv">
            <Tabs type="card" :animated="false" :value="currentTab" @on-click="changeTab">
                <TabPane label="助记词" name="mnemonic">
                    <p class="remind">该选项恢复丢失的KeyStore 文件+密码或者从其他钱包导入助记词。</p>
                    <hr>
                    <Form :model="mnemonic">
                        <FormItem label="助记词">
                            <Input v-model="mnemonic.walletName" type="textarea" :autosize="{minRows: 2,maxRows: 5}"  required placeholder="请输入你的助记词"></Input>
                            <p class="mnemonicRemind">请用空格隔开每个助记词 </p>
                        </FormItem>
                        <FormItem label="设置密码">
                            <Input v-model="mnemonic.password" type="password" required placeholder="请设置你的钱包密码"></Input>
                            <i class="icon"><img src="@/assets/images/wallet-management/psd_hidden.png"></i>
                        </FormItem>
                        <FormItem>
                            <Button type="success" @click="importWallet">导入</Button>
                        </FormItem>
                    </Form>
                </TabPane>
                <TabPane label="私钥" name="privateKey">
                    <p class="remind">该选项恢复丢失的KeyStore 文件+密码或者从其他钱包导入私钥。私钥钱包包含要导入的主私钥，私钥钱包只使用密码来加密导入的私钥。因此，选择一个安全的密码是至关重要的。</p>
                    <hr>
                    <Form :model="privateKey">
                        <FormItem label="私钥">
                            <Input v-model="privateKey.privateKey" required placeholder="请输入或粘贴你的私钥"></Input>
                        </FormItem>
                        <FormItem label="设置密码">
                            <Input v-model="privateKey.password" type="password" required placeholder="请设置你的钱包密码"></Input>
                            <i class="icon"><img src="@/assets/images/wallet-management/psd_hidden.png"></i>
                        </FormItem>
                        <FormItem label="确认密码">
                            <Input v-model="privateKey.checkPW" type="password" required placeholder="请再次输入你的密码"></Input>
                            <i class="icon"><img src="@/assets/images/wallet-management/psd_hidden.png"></i>
                        </FormItem>
                        <FormItem>
                            <Button type="success" @click="importWallet">导入</Button>
                        </FormItem>
                    </Form>
                </TabPane>
                <TabPane label="Keystore" name="keystore">
                    <p class="remind">KeyStore文件+密码导入钱包，密码为创建钱包时设置的密码，若忘记密码，可采用助记词或私钥导入。</p>
                    <hr>
                    <Form :model="keystore">
                        <FormItem label="Keystore">
                            <Input v-model="keystore.walletName" required placeholder="请输入或粘贴你的Keystore文件"></Input>
                        </FormItem>
                        <FormItem label="输入密码">
                            <Input v-model="keystore.password" type="password" required placeholder="请输入你的钱包密码"></Input>
                            <i class="icon"><img src="@/assets/images/wallet-management/psd_hidden.png"></i>
                        </FormItem>
                        <FormItem>
                            <Button type="success" @click="importWallet">导入</Button>
                        </FormItem>
                    </Form>
                </TabPane>
            </Tabs>
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
