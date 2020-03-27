<template>
  <div class="container">
    <Modal
      v-model="show"
      class-name="modal-container"
      :title="$t('modal_title_backup_mnemonic_display')"
      :transfer="false"
    >
      <div class="form-unlock">
        <FormAccountUnlock v-if="!hasMnemonicInfo" @success="onAccountUnlocked" @error="onError" />
      </div>
      <div v-if="hasMnemonicInfo" class="body">
        <div class="explain">
          <span class="subtitle">{{ $t('wallets_backup_title_mnemonic') }}</span>
          <p>{{ $t('wallets_backup_mnemonic_explain_p3', {num: mnemonic.plain.split(' ').length}) }}</p>
        </div>

        <MnemonicDisplay :words="words" />
      </div>

      <div slot="footer" class="modal-footer">
        <button
          type="submit"
          class="centered-button button-style back-button float-right"
          @click="show = false"
        >
          {{ $t('close') }}
        </button>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
import { ModalMnemonicDisplayTs } from './ModalMnemonicDisplayTs'
export default class ModalMnemonicDisplay extends ModalMnemonicDisplayTs {}
</script>

<style lang="less" scoped>
@import "./ModalMnemonicDisplay.less";
</style>
