<template>
    <div class="keystoreDialogWrap">
        <Modal
                v-model="show"
                class-name="vertical-center-modal"
                :footer-hide="true"
                :width="1000"
                :transfer="false"
                @on-cancel="keystoreDialogCancel">
            <div slot="header" class="keystoreDialogHeader">
                <span class="title">导出Keystore</span>
            </div>
            <div class="keystoreDialogBody">
                <div class="steps"  v-if="stepIndex != 4">
                    <span :class="['stepItem',stepIndex == 0?'active':'']">输入密码</span>
                    <span :class="['stepItem',stepIndex == 1?'active':'']">备份提示</span>
                    <span :class="['stepItem',stepIndex == 2||stepIndex == 3?'active':'']">备份Keystore</span>
                </div>
                <div class="stepItem1" v-if="stepIndex == 0">
                    <Form :model="wallet">
                        <FormItem>
                            <Input v-model="wallet.password" required placeholder="请输入你的钱包密码"></Input>
                        </FormItem>
                        <FormItem>
                            <Button type="success" @click="exportKeystore">下一步 <Icon type="ios-arrow-round-forward" /></Button>
                        </FormItem>
                    </Form>
                </div>
                <div class="stepItem2" v-if="stepIndex == 1">
                    <div class="step2Txt">
                        <Row>
                            <Col span="9">
                                <div class="imgDiv">
                                    <div class="step2Img">
                                        <img src="@/assets/images/wallet-management/Step2Img.png">
                                    </div>
                                </div>
                            </Col>
                            <Col span="15">
                                <p class="tit">获得Keystore+密码等于拥有钱包资产所有权</p>
                                <div class="ul1">
                                    <p class="ul1Tit"><span class="point"></span> 备份Keystore</p>
                                    <p class="ul1Txt">请妥善备份Keystore,如果你的手机丢失、被盗、损坏,Keystore+密码将可以恢复你的资产</p>
                                </div>
                                <div class="ul2">
                                    <p class="ul2Tit"><span class="point"></span> 离线保管</p>
                                    <p class="ul2Txt">妥善保管至隔离网络的安全地方,请勿将助记词在联网环境下分享和存储,比如邮件、相册、社交应用等</p>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <Button type="success" @click="exportKeystore">下一步 <Icon type="ios-arrow-round-forward" /></Button>
                </div>
                <div class="stepItem3" v-if="stepIndex == 2">
                    <Row>
                        <Col span="15">
                            <div class="keystoreCode">{"crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"5eb58323f39467d9a4b7c14b76fb2154"},"ciphertext":"571cba91c56605a5ac115918be84b454333ccb600310a0bf3dec25ff778e04b9","kdf":"pbkdf2","kdfparams":{"c":10240,"dklen":32,"prf":"hmac-sha256","salt":"a417c49dbeb3bbec79cfbf3cda545e47b4ce150f4e32b7d4c3de34b4c9b4a496"},"mac":"ee97c769b3fde908a5e59689de6226107d098e27b0508cde8449143008c1f6c1"},"id":"e6ba80f1-fd2b-407c-9ef6-cec880ce481e","version":3,"address":"d18ad549395b1c03c05ec4375ed99c9737e51594"}
                            </div>
                        </Col>
                        <Col span="9">
                            <p class="tit">请安全备份Keystore</p>
                            <p class="txt">切勿保存至邮箱、记事本、网盘、聊天工具等，非常危险请勿使用网络传输</p>
                            <p class="tit">请勿使用网络传输</p>
                            <p class="txt">请勿通过网络工具传输，一旦被黑客获取将造成不可挽回的资产损失。建议离线设备通过扫二维码方式传输。</p>
                            <p class="tit">密码管理工具保存</p>
                            <p class="txt">建议使用密码管理工具管理</p>
                        </Col>
                    </Row>
                    <Row :gutter="80">
                        <Col span="12">
                            <Button type="success" @click="copyKeystore">复制Keystore</Button>
                        </Col>
                        <Col span="8">
                            <Button type="success" @click="exportKeystore">显示Keystore二维码</Button>
                        </Col>
                    </Row>
                </div>
                <div class="stepItem4" v-if="stepIndex == 3">
                    <div class="QRCodeImg">
                        <img :src="QRCode">
                        <div class="imgBorder"></div>
                    </div>
                    <div class="btns">
                        <Row :gutter="80">
                            <Col span="7">&nbsp;</Col>
                            <Col span="5">
                                <Button type="success" @click="toPrevPage">显示Keystore</Button>
                            </Col>
                            <Col span="5">
                                <Button type="success" @click="saveQRCode">复制二维码</Button>
                            </Col>
                            <Col span="7">&nbsp;</Col>
                        </Row>
                    </div>
                </div>
            </div>
        </Modal>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Prop, Watch} from 'vue-property-decorator';
    import {createQRCode, copyTxt} from '@/utils/tools'
    import './keystoreDialog.less';
    @Component({
        components: {},
    })
    export default class keystoreDialog extends Vue{
        stepIndex = 0
        show = false
        QRCode = ''
        wallet = {
            password:'',
            keystore:''
        }

        @Prop()
        showKeystoreDialog:boolean

        keystoreDialogCancel () {
            this.$emit('closeKeystoreDialog')
            setTimeout(()=>{
                this.stepIndex = 0
            },300)
        }
        exportKeystore () {
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
            }
        }
        toPrevPage () {
            this.stepIndex = 2
        }
        copyKeystore () {
            copyTxt(this.wallet.keystore).then((data)=>{
                this.$Message.success('复制成功');
            })
        }
        saveQRCode () {

        }
        @Watch('showKeystoreDialog')
        onShowKeystoreDialogChange(){
            this.show = this.showKeystoreDialog
        }
        created () {
            createQRCode('TCTEXC-5TGXD7-OQCHBB-MNU3LS-2GFCB4-2KD75D-5VCN').then((data)=>{
                this.QRCode = data.url
            })
        }
    }
</script>

<style scoped>

</style>
