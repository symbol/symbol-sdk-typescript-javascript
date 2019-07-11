<template>
    <div class="mnemonicDialogWrap">
        <Modal
                v-model="show"
                class-name="vertical-center-modal"
                :footer-hide="true"
                :width="1000"
                :transfer="false"
                @on-cancel="mnemonicDialogCancel">
            <div slot="header" class="mnemonicDialogHeader">
                <span class="title">导出助记词</span>
            </div>
            <div class="mnemonicDialogBody">
                <div class="steps"  v-if="stepIndex != 4">
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
                                <div class="imgDiv">
                                    <div class="step2Img">
                                        <img src="@/assets/images/wallet-management/step2Img.png">
                                    </div>
                                </div>
                            </Col>
                            <Col span="15">
                                <p class="tit">获得助记词等于拥有钱包资产所有权</p>
                                <div class="ul1">
                                    <p class="ul1Tit"><span class="point"></span> 备份助记词</p>
                                    <p class="ul1Txt">使用纸和笔正确抄写助记词,如果你的手机丢失、被盗、损坏,助记词将可以恢复你的资产</p>
                                </div>
                                <div class="ul2">
                                    <p class="ul2Tit"><span class="point"></span> 离线保管</p>
                                    <p class="ul2Txt">妥善保管至隔离网络的安全地方,请勿将助记词在联网环境下分享和存储,比如邮件、相册、社交应用等</p>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <Button type="success" @click="exportMnemonic">下一步 <Icon type="ios-arrow-round-forward" /></Button>
                </div>
                <div class="stepItem3" v-if="stepIndex == 2">
                    <p class="tit">请准确抄写安全备份助记词</p>
                    <p class="mnemonicWords">level   hello   omit   donor   device   vivid   maximum   rail   merit   zone   alter   oven</p>
                    <Button type="success" @click="exportMnemonic">下一步 <Icon type="ios-arrow-round-forward" /></Button>
                </div>
                <div class="stepItem4" v-if="stepIndex == 3">
                    <p class="tit">请按顺序点击助记词，以确认您正确备份</p>
                    <div class="sureMnemonicWords"></div>
                    <p class="mnemonicWords">level   hello   omit   donor   device   vivid   maximum   rail   merit   zone   alter   oven</p>
                    <Button type="success" @click="exportMnemonic">下一步 <Icon type="ios-arrow-round-forward" /></Button>
                </div>
                <div class="stepItem5" v-if="stepIndex == 4">
                    <div class="backupImg">
                        <img src="@/assets/images/wallet-management/exportSuccess.png">
                    </div>
                    <p class="backupTxt">助记词顺序正确，备份成功</p>
                    <Button type="success" @click="exportMnemonic">完成</Button>
                </div>
            </div>
        </Modal>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Prop, Watch} from 'vue-property-decorator';
    import './mnemonicDialog.less';
    @Component({
        components: {},
    })
    export default class mnemonicDialog extends Vue{
        stepIndex = 0
        show = false
        wallet = {
            password:'',
            mnemonicWords:''
        }

        @Prop()
        showMnemonicDialog:boolean

        mnemonicDialogCancel () {
            this.$emit('closeMnemonicDialog')
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
                    this.mnemonicDialogCancel()
                    break;
            }
        }
        @Watch('showMnemonicDialog')
        onShowMnemonicDialogChange(){
            this.show = this.showMnemonicDialog
        }
    }
</script>

<style scoped>

</style>
