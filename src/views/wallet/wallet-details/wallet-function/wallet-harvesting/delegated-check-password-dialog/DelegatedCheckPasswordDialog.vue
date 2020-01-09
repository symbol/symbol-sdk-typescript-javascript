<template>
  <Modal :transfer="false"
         class-name="delegated-check-password-dialog-wrapper"
         v-model="visible"
         @on-cancel="visible=false"
         :footer-hide="true">
    <div slot="header" class="check-deploy-dialog-header">
      <span class="title">{{$t('config')}}</span>
    </div>
    <div class="check-deploy-dialog-body">
      <div class="step-item">
        <div>
          <p class="title">{{$t('Configuration_instructions')}}:</p>
          <p class="checkRemind">{{$t('In_the_next_operation')}}</p>
        </div>

        <form>
          <div class="checkPassWord">
            <span class="title">{{$t('account_password')}}:</span>
          </div>
          <form action="submit" onsubmit="event.preventDefault()" @keyup.enter="submit">
            <ErrorTooltip fieldName="password">
              <input
                style="width: 800px"
                v-focus
                v-model.lazy="password"
                type="password"
                v-validate="validation.accountPassword"
                data-vv-name="password"
                :data-vv-as="$t('password')"
                :placeholder="$t('please_enter_your_wallet_password')"
              />
            </ErrorTooltip>
            <input v-show="false" v-model="accountPassword" v-validate disabled data-vv-name="accountPassword"/>
          </form>
          <div class="button_bottom">
            <Button type="default" @click="visible=false">{{$t('Cancel')}}</Button>
            <Button type="success" @click="submit">{{$t('Next_step')}}</Button>
          </div>
        </form>
      </div>
    </div>
  </Modal>
</template>

<script lang="ts">
    import DelegatedCheckPasswordDialogTs from './DelegatedCheckPasswordDialogTs';

    export default class DelegatedCheckPasswordDialog extends DelegatedCheckPasswordDialogTs {


    }
</script>
<style>
</style>
