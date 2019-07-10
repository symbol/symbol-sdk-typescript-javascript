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
                    <i><img :src="Mnemonic"></i>
                    <span>导出助记词</span>
                </div>
                <div class="privateKey left">
                    <i><img :src="privateKey"></i>
                    <span>导出私钥</span>
                </div>
                <div class="Keystore left">
                    <i><img :src="Keystore"></i>
                    <span>导出Keystore</span>
                </div>
                <div class="Other left">
                    <i><img :src="Other"></i>
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
                <div class="tableCell">
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
                <div class="tableCell">
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
            </div>
        </div>
        <Modal
                v-model="showMnemonicDialog"
                class-name="vertical-center-modal"
                :footer-hide="true"
                :width="1000"
                @on-cancel="mnemonicDialogCancel">
        >
            <div slot="header" class="mnemonicDialogHeader">
                <span class="title">导出助记词</span>
            </div>
            <div class="mnemonicDialogBody">
                <div class="steps">
                    <span :class="['stepItem',stepIndex == 0?'active':'']">输入密码</span>
                    <span :class="['stepItem',stepIndex == 1?'active':'']">备份提示</span>
                    <span :class="['stepItem',stepIndex == 2?'active':'']">备份助记词</span>
                    <span :class="['stepItem',stepIndex == 3?'active':'']">确认备份</span>
                </div>
                <div class="stepItem1" v-if="stepIndex == 0">
                    <Form :model="wallet">
                    <FormItem>
                        <Input v-model="wallet.password" required placeholder="请输入你的钱包密码"></Input>
                    </FormItem>
                        <FormItem>
                            <Button type="success" @click="exportMnemonic">下一步 <Icon type="ios-arrow-round-forward" /></Button>
                        </FormItem>
                    </Form>
                </div>
                <div class="stepItem2" v-if="stepIndex == 1">
                    <div class="step2Txt">
                        <Row>
                            <Col span="9">
                                <div class="step2Img">
                                    <img :src="mnemonicStep2">
                                </div>
                            </Col>
                            <Col span="15">
                                <p class="tit">获得助记词等于拥有钱包资产所有权</p>
                                <div class="ul1">
                                    <p class="ul1Tit">备份助记词</p>
                                    <p class="ul1Txt">使用纸和笔正确抄写助记词,如果你的手机丢失、被盗、损坏,助记词将可以恢复你的资产</p>
                                </div>
                                <div class="ul2">
                                    <p class="ul2Tit">离线保管</p>
                                    <p class="ul2Txt">妥善保管至隔离网络的安全地方,请勿将助记词在联网环境下分享和存储,比如邮件、相册、社交应用等</p>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <Button type="success" @click="exportMnemonic">下一步 <Icon type="ios-arrow-round-forward" /></Button>
                </div>
            </div>
        </Modal>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import {createQRCode} from '@/utils/tools'
    import Mnemonic from '@/assets/images/wallet-management/Auxiliaries.png'
    import privateKey from '@/assets/images/wallet-management/privatekey.png'
    import Keystore from '@/assets/images/wallet-management/keystore.png'
    import Other from '@/assets/images/wallet-management/other.png'
    import mnemonicStep2 from '@/assets/images/wallet-management/mnemonicStep2.png'
    import './WalletDetails.less';

    @Component({
        components: {},
    })
    export default class WalletDetails extends Vue{
        Mnemonic = Mnemonic
        privateKey = privateKey
        Keystore = Keystore
        Other = Other
        mnemonicStep2 = mnemonicStep2

        showMnemonicDialog:boolean = false
        QRCode:string = ''
        wallet = {
            password:'',

        }
        stepIndex = 0
        changeMnemonicDialog () {
            this.showMnemonicDialog = true
        }
        mnemonicDialogCancel () {
            setTimeout(()=>{
                this.stepIndex = 0
            },300)
        }
        exportMnemonic () {
            switch (this.stepIndex) {
                case 0 :
                    this.stepIndex = 1
                    break;
                case 1 :
                    this.stepIndex = 2
                    break;
                case 2 :
                    this.stepIndex = 3
                    break;
                case 3 :
                    this.stepIndex = 4
                    break;
                case 4 :
                    this.stepIndex = 5
                    break;
            }
        }

        onresize () {
            const height = this.$refs['walletDetailsWrap'].clientHeight - ( this.$refs['accountFn'].offsetTop - this.$refs['walletDetailsWrap'].offsetTop)
            this.$refs['accountFn'].style.height = height +'px'
        }
        created () {
            createQRCode('TCTEXC-5TGXD7-OQCHBB-MNU3LS-2GFCB4-2KD75D-5VCN').then((data)=>{
                this.QRCode = data.url
            })
        }
        mounted () {
            const that = this
            window.addEventListener('resize',function () {
                if(that.$route.name == 'walletDetails'){
                    that.onresize()
                }
            })
            that.onresize()
        }
    }
</script>

<style scoped>

</style>
