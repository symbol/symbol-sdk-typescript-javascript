<template>
  <div class="checkPWDialogWrap">
    <Modal
      v-model="show"
      class-name="vertical-center-modal"
      :footer-hide="true"
      :transfer="false"
      @on-cancel="show=false"
    >
      <div slot="header" class="checkPWDialogHeader">
        <span class="title">{{$t(dialogTitle)}}</span>
      </div>
      <div class="checkPWDialogBody">
        <div class="stepItem1">
          <CheckPassword
            :returnPassword="returnPassword"
            @passwordValidated="passwordValidated" ></CheckPassword>
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
