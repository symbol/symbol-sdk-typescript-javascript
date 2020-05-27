<template>
  <div class="check-mnemonic-sec">
    <div class="skip pointer" @click="$router.push({ name: 'profiles.createProfile.finalize' })">
      {{ $t('skip') }}
    </div>
    <p class="set-title">
      {{ $t('verify_mnemonics') }}
    </p>
    <div class="check-mnemonic-col">
      <div class="check-mnemonic-left">
        <MnemonicVerification
          :words="mnemonicWordsList"
          @success="$router.push({ name: 'profiles.createProfile.finalize' })"
          @cancelled="$router.back()"
        />
      </div>
      <div class="check-mnemonic-right">
        <p class="text1">
          {{ $t('tips') }}
        </p>
        <p class="text">
          {{ $t('the_backup_is_wrong') }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import VerifyMnemonicTs from './VerifyMnemonicTs'
import './VerifyMnemonic.less'

export default class VerifyMnemonic extends VerifyMnemonicTs {}
</script>
