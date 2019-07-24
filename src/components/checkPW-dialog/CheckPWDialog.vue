<template>
    <div class="checkPWDialogWrap">
        <Modal
                v-model="show"
                class-name="vertical-center-modal"
                :footer-hide="true"
                :width="1000"
                :transfer="false"
                @on-cancel="checkPWDialogCancel">
            <div slot="header" class="checkPWDialogHeader">
                <span class="title">{{$t('confirm_password')}}</span>
            </div>
            <div class="checkPWDialogBody">
                <div class="stepItem1">
                    <div class="checkPWImg">
                        <img src="@/assets/images/window/checkPW.png">
                    </div>
                    <p class="checkRemind">{{$('please_enter_your_wallet_password_to_ensure_your_own_operation_and_keep_your_wallet_safe')}}</p>
                    <Form :model="wallet">
                        <FormItem>
                            <Input v-model="wallet.password" type="password" required :placeholder="$t('please_enter_your_wallet_password')"></Input>
                        </FormItem>
                        <FormItem>
                            <Button type="success" @click="checkPWed"> {{$t('confirm')}} </Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        </Modal>
    </div>
</template>

<!--
    @Prop: showCheckPWDialog  是否显示弹窗
    @return: closeCheckPWDialog()  弹窗关闭事件
             checkEnd(boolean)  返回事件 确认密码是否正确
-->

<script lang="ts">
    import {Component, Vue, Prop, Watch} from 'vue-property-decorator';
    import './CheckPWDialog.less';
    @Component({
        components: {},
    })
    export default class CheckPWDialog extends Vue{
        stepIndex = 0
        show = false
        wallet = {
            password:''
        }

        @Prop()
        showCheckPWDialog:boolean

        checkPWDialogCancel () {
            this.$emit('closeCheckPWDialog')
        }
        checkPWed () {
            this.show = false
            this.checkPWDialogCancel()
            this.$emit('checkEnd',true)
        }
        @Watch('showCheckPWDialog')
        onShowCheckPWDialogChange(){
            this.show = this.showCheckPWDialog
        }
    }
</script>

<style scoped>

</style>
