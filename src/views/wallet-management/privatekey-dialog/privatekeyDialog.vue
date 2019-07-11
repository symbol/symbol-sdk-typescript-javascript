<template>
    <div class="privatekeyDialogWrap">
        <Modal
                v-model="show"
                class-name="vertical-center-modal"
                :footer-hide="true"
                :width="1000"
                :transfer="false"
                @on-cancel="privatekeyDialogCancel">
            <div slot="header" class="privatekeyDialogHeader">
                <span class="title">导出私钥</span>
            </div>
            <div class="privatekeyDialogBody">
                <div class="steps"  v-if="stepIndex != 4">
                    <span :class="['stepItem',stepIndex == 0?'active':'']">输入密码</span>
                    <span :class="['stepItem',stepIndex == 1?'active':'']">备份提示</span>
                    <span :class="['stepItem',stepIndex == 2||stepIndex == 3?'active':'']">备份私钥</span>
                </div>
                <div class="stepItem1" v-if="stepIndex == 0">
                    <Form :model="wallet">
                        <FormItem>
                            <Input v-model="wallet.password" required placeholder="请输入你的钱包密码"></Input>
                        </FormItem>
                        <FormItem>
                            <Button type="success" @click="exportPrivatekey">下一步 <Icon type="ios-arrow-round-forward" /></Button>
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
                                <p class="tit">获得私钥等于拥有钱包资产所有权</p>
                                <div class="ul1">
                                    <p class="ul1Tit"><span class="point"></span> 备份私钥</p>
                                    <p class="ul1Txt">使用纸和笔正确抄写私钥,如果你的手机丢失、被盗、损坏,私钥将可以恢复你的资产</p>
                                </div>
                                <div class="ul2">
                                    <p class="ul2Tit"><span class="point"></span> 离线保管</p>
                                    <p class="ul2Txt">妥善保管至隔离网络的安全地方,请勿将助记词在联网环境下分享和存储,比如邮件、相册、社交应用等</p>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <Button type="success" @click="exportPrivatekey">下一步 <Icon type="ios-arrow-round-forward" /></Button>
                </div>
                <div class="stepItem3" v-if="stepIndex == 2">
                    <p class="tit">请准确抄写安全备份私钥</p>
                    <p class="txt">切勿保存至邮箱、记事本、网盘、聊天工具等，非常危险请勿使用网络传输</p>
                    <p class="tit">请勿使用网络传输</p>
                    <p class="txt">请勿通过网络工具传输，一旦被黑客获取将造成不可挽回的资产损失。建议离线设备通过扫二维码方式传输。</p>
                    <p class="tit">密码管理工具保存</p>
                    <p class="txt">建议使用密码管理工具管理</p>
                    <div class="privateKeyCode">79375884ce4e01f82e3128f4a9aadbdeab6e1 c4ef7718fca93aa1fOec38ab4b2</div>
                    <Button type="success" @click="exportPrivatekey">显示私钥 二维码</Button>
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
                                <Button type="success" @click="toPrevPage">显示私钥</Button>
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
    import {createQRCode} from '@/utils/tools'
    import './privatekeyDialog.less';
    @Component({
        components: {},
    })
    export default class privatekeyDialog extends Vue{
        stepIndex = 0
        show = false
        QRCode = ''
        wallet = {
            password:'',
            privatekey:''
        }

        @Prop()
        showPrivatekeyDialog:boolean

        privatekeyDialogCancel () {
            this.$emit('closePrivatekeyDialog')
            setTimeout(()=>{
                this.stepIndex = 0
            },300)
        }
        exportPrivatekey () {
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
        saveQRCode () {

        }
        @Watch('showPrivatekeyDialog')
        onShowPrivatekeyDialogChange(){
            this.show = this.showPrivatekeyDialog
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
