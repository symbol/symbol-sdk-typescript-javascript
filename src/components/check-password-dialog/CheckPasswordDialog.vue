<template>
  <div class="checkPWDialogWrap">
    <Modal
      v-model="show"
      class-name="vertical-center-modal"
      :footer-hide="true"
      :transfer="false"
      @on-cancel="$emit('close'); $emit('cancelled')"
    >
      <div slot="header" class="checkPWDialogHeader">
        <span class="title">{{$t('confirm_information')}}</span>
      </div>
      <div class="checkPWDialogBody">
        <div class="stepItem1">
          <form action="submit" onsubmit="event.preventDefault()" @keyup.enter="submit">
            <ErrorTooltip fieldName="password">
              <input
                v-focus
                v-model.lazy="password"
                type="password"
                v-validate="validation.accountPassword"
                data-vv-name="password"
                :data-vv-as="$t('password')"
                :placeholder="$t('please_enter_your_wallet_password')"
              />
            </ErrorTooltip>
            <input v-show="false" v-model="accountPassword" v-validate disabled data-vv-name="accountPassword" />
            <Button type="success" @click="submit">{{$t('confirm')}}</Button>
          </form>
        </div>
      </div>
    </Modal>
  </div>
</template>


<script lang="ts">
import "./CheckPasswordDialog.less";
import { CheckPasswordDialogTs } from "@/components/check-password-dialog/CheckPasswordDialogTs.ts";

export default class CheckPasswordDialog extends CheckPasswordDialogTs {}
</script>

<style scoped>
</style>
