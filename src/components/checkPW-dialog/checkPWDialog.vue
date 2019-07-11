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
                <span class="title">确认密码</span>
            </div>
            <div class="checkPWDialogBody">
                <div class="stepItem1">
                    <div class="checkPWImg">
                        <img src="@/assets/images/window/checkPW.png">
                    </div>
                    <p class="checkRemind">请输入钱包密码，以确保为本人操作，保证你的钱包安全</p>
                    <Form :model="wallet">
                        <FormItem>
                            <Input v-model="wallet.password" type="password" required placeholder="请输入你的钱包密码"></Input>
                        </FormItem>
                        <FormItem>
                            <Button type="success" @click="checkPWed"> 确认 </Button>
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
    import './checkPWDialog.less';
    @Component({
        components: {},
    })
    export default class checkPWDialog extends Vue{
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
