<template>
    <div class="walletDetailsWrap"  ref="walletDetailsWrap">
        <div class="Information">
            <Row>
                <Col span="18">
                    <h6>基本信息</h6>
                    <div class="walletInfo">
                        <p>
                            <span class="tit">钱包名</span>
                            <span class="walletName">Test wallet <i class="updateWalletName"><img src=""></i></span>
                        </p>
                        <p>
                            <span class="tit">钱包地址</span>
                            <span class="walletAddress">TCTEXC-5TGXD7-OQCHBB-MNU3LS-2GFCB4-2KD75D-5VCN</span>
                        </p>
                        <p>
                            <span class="tit">钱包公钥</span>
                            <span class="walletPublicKey">262c12c4ad2edc1aa45213907737f985f62fdb0d6d7f0fa07450eafd37e17253</span>
                        </p>
                        <p>
                            <span class="tit">钱包别名</span>
                            <span class="walletAlias">1</span>
                        </p>
                    </div>
                </Col>
                <Col span="6">
                    <div class="addressQRCode">
                        <img :src="QRCode">
                    </div>
                    <p class="codeTit">地址二维码</p>
                </Col>
            </Row>
        </div>
        <div class="fnAndBackup">
            <h6>功能与备份</h6>
            <div class="backupDiv clear">
                <div class="Mnemonic left" @click="changeMnemonicDialog">
                    <i><img src="@/assets/images/wallet-management/auxiliaries.png"></i>
                    <span>导出助记词</span>
                </div>
                <div class="privateKey left" @click="changePrivatekeyDialog">
                    <i><img src="@/assets/images/wallet-management/privatekey.png"></i>
                    <span>导出私钥</span>
                </div>
                <div class="Keystore left" @click="changeKeystoreDialog">
                    <i><img src="@/assets/images/wallet-management/keystore.png"></i>
                    <span>导出Keystore</span>
                </div>
                <div class="Other left">
                    <i><img src="@/assets/images/wallet-management/other.png"></i>
                    <span>其他</span>
                </div>
            </div>
        </div>
        <div class="accountFn" ref="accountFn">
            <div class="accountFnNav">
                <ul class="navList clear">
                    <li class="active left">别名设置</li>
                    <li class="left">过滤器管理</li>
                    <li class="left">子地址管理</li>
                    <li class="left">修改密码</li>
                </ul>
            </div>
            <div class="aliasTable">
                <div class="tableTit">
                    <Row>
                        <Col span="7">空间别名</Col>
                        <Col span="6">有效期</Col>
                        <Col span="4">状态</Col>
                        <Col span="7">操作</Col>
                    </Row>
                </div>
                <div class="tableCell" v-for="(item,index) in aliasList" :key="index" v-if="aliasList.length>0">
                    <Row>
                        <Col span="7">girme</Col>
                        <Col span="6">2019-11-05</Col>
                        <Col span="4">已绑定</Col>
                        <Col span="7">
                            <div class="tableFn">
                                <span class="bind">绑定</span>
                                <span class="unbind active">解绑</span>
                                <span class="updateTime">更新</span>
                            </div>
                        </Col>
                    </Row>
                </div>
                <div class="noData" v-if="aliasList.length<=0">
                    <i><img src="@/assets/images/wallet-management/no_data.png"></i>
                    <p>暂无别名</p>
                </div>
            </div>
        </div>
        <mnemonicDialog :showMnemonicDialog="showMnemonicDialog" @closeMnemonicDialog="closeMnemonicDialog"></mnemonicDialog>
        <privatekeyDialog :showPrivatekeyDialog="showPrivatekeyDialog" @closePrivatekeyDialog="closePrivatekeyDialog"></privatekeyDialog>
        <keystoreDialog :showKeystoreDialog="showKeystoreDialog" @closeKeystoreDialog="closeKeystoreDialog"></keystoreDialog>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import {createQRCode} from '@/utils/tools'
    import mnemonicDialog from '@/views/wallet-management/mnemonic-dialog/mnemonicDialog.vue'
    import privatekeyDialog from '@/views/wallet-management/privatekey-dialog/privatekeyDialog.vue'
    import keystoreDialog from '@/views/wallet-management/keystore-dialog/keystoreDialog.vue'
    import './WalletDetails.less';

    @Component({
        components: {
            mnemonicDialog,
            privatekeyDialog,
            keystoreDialog
        },
    })
    export default class WalletDetails extends Vue{
        showMnemonicDialog:boolean = false
        showPrivatekeyDialog:boolean = false
        showKeystoreDialog:boolean = false
        QRCode:string = ''
        aliasList = []

        changeMnemonicDialog () {
            this.showMnemonicDialog = true
        }
        closeMnemonicDialog () {
            this.showMnemonicDialog = false
        }
        changePrivatekeyDialog () {
            this.showPrivatekeyDialog = true
        }
        closePrivatekeyDialog () {
            this.showPrivatekeyDialog = false
        }
        changeKeystoreDialog () {
            this.showKeystoreDialog = true
        }
        closeKeystoreDialog () {
            this.showKeystoreDialog = false
        }
        onresize () {
            const height = this.$refs['walletDetailsWrap']['clientHeight'] - ( this.$refs['accountFn']['offsetTop'] - this.$refs['walletDetailsWrap']['offsetTop'])
            this.$refs['accountFn']['style']['height'] = height +'px'
        }
        created () {
            createQRCode('TCTEXC-5TGXD7-OQCHBB-MNU3LS-2GFCB4-2KD75D-5VCN').then((data)=>{
                this.QRCode = data.url
            })
        }
        mounted () {
            const that = this
            window.addEventListener('resize',function () {
                if(that.$refs['walletDetailsWrap'] && that.$route.name == 'walletDetails'){
                    that.onresize()
                }
            })
            that.onresize()
        }
    }
</script>

<style scoped>

</style>
