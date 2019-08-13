<template>
  <div class="checkPWDialogWrap">
    <Modal
            v-model="show"
            class-name="vertical-center-modal"
            :footer-hide="true"
            :transfer="false"
            @on-cancel="checkPasswordDialogCancel">
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
              <Button type="success" @click="checkPassword"> {{$t('confirm')}}</Button>
            </FormItem>
          </Form>
        </div>
      </div>
    </Modal>
  </div>
</template>


<script lang="ts">
    import "./CheckPasswordDialog.less"
    import {CheckPasswordDialogTs} from './CheckPasswordDialogTs'
    /**
     @Prop: showCheckPWDialog
     @return: closeCheckPWDialog()
     @return: checkEnd(privatekey:string)
     */

    export default class CheckPWDialog extends CheckPasswordDialogTs {
          }
</script>

<style scoped>
</style>
