<template>
  <div class="checkPWDialogWrap">
    <Modal
            v-model="show"
            class-name="vertical-center-modal"
            :footer-hide="true"
            :transfer="false"
            @on-cancel="checkPWDialogCancel">
      <div slot="header" class="checkPWDialogHeader">
        <span class="title">{{$t('confirm_infomation')}}</span>
      </div>
      <div class="checkPWDialogBody">
        <div class="stepItem1">


          <div v-if="!transactionDetail">
            <div class="checkPWImg">
              <img src="@/common/img/window/checkPW.png">
            </div>
            <p class="checkRemind">
              {{$t('please_enter_your_wallet_password_to_ensure_your_own_operation_and_keep_your_wallet_safe')}}</p>
          </div>


          <div class="info_container" v-else>
            <div class="info_container_item" v-for="(value,key,index) in transactionDetail">
              <span class="key">{{$t(key)}}</span>
              <span v-if="index == 0" class="value orange">{{$t(value)}}</span>
              <span v-else class="value">{{value}}</span>
            </div>
          </div>


          <Form :model="wallet">
            <FormItem>
              <Input v-model="wallet.password" type="password" required
                     :placeholder="$t('please_enter_your_wallet_password')"></Input>
            </FormItem>
            <FormItem>
              <Button type="success" @click="checkPWed"> {{$t('confirm')}}</Button>
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
    import {Component, Vue, Prop, Watch} from 'vue-property-decorator'
    import {walletInterface} from "@/interface/sdkWallet"
    import {Message} from "config/index"
    import {Crypto} from 'nem2-sdk'
    import "./CheckPWDialog.less"


    @Component({
        components: {},
    })
    export default class CheckPWDialog extends Vue {
        stepIndex = 0
        show = false
        wallet = {
            password: ''
        }

        @Prop()
        showCheckPWDialog: boolean

        @Prop({default: ''})
        transactionDetail: any

        get getWallet() {
            return this.$store.state.account.wallet
        }

        checkPWDialogCancel() {
            this.$emit('closeCheckPWDialog')
        }

        checkPWed() {
            let saveData = {
                ciphertext: this.getWallet.ciphertext,
                iv: this.getWallet.iv.data ? this.getWallet.iv.data : this.getWallet.iv,
                key: this.wallet.password
            }
            const DeTxt = Crypto.decrypt(saveData)
            walletInterface.getWallet({
                name: this.getWallet.name,
                networkType: this.getWallet.networkType,
                privateKey: DeTxt.length === 64 ? DeTxt : ''
            }).then(async (Wallet: any) => {
                this.show = false
                this.checkPWDialogCancel()
                this.$emit('checkEnd', DeTxt)
            }).catch(() => {
                this.$Notice.error({
                    title: this.$t(Message.WRONG_PASSWORD_ERROR) + ''
                })
            })
        }

        @Watch('showCheckPWDialog')
        onShowCheckPWDialogChange() {
            this.wallet.password = ''
            this.show = this.showCheckPWDialog
        }

        // @Watch('transactionDetail')
        // onTransactionDetailChange(){
        //
        // }
    }
</script>

<style scoped>
</style>
