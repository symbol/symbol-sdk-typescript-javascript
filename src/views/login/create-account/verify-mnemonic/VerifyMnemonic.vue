<template>
  <div class="check-mnemonic-sec">

    <div class="skip pointer" @click="$router.push('finishCreate')">{{$t('skip')}}</div>
    <p class="set-title">{{$t('Verify_mnemonics')}}</p>
    <div class="check-mnemonic-col">
      <div class="check-mnemonic-left">
        <MnemonicVerification
                :mnemonicWordsList="mnemonicWordsList"
                @verificationSuccess="$router.push('finishCreate')"
                @toPreviousPage="$router.back()">
        </MnemonicVerification>
      </div>
      <div class="check-mnemonic-right">
        <p class="text1">{{$t('Tips')}}</p>
        <p class="text">{{$t('The_backup_is_wrong')}}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
    import VerifyMnemonicTs from "@/views/login/create-account/verify-mnemonic/VerifyMnemonicTs.ts"
    import "./VerifyMnemonic.less"

    export default class VerifyMnemonic extends VerifyMnemonicTs {
    }
</script>

<style lang="less">
</style>
