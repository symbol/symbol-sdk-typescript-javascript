<template>
  <div class="container">
    <Modal
      v-model="show"
      :title="$t('modal_account_unlock_title')"
      :transfer="false"
      class-name="modal-container"
    >
      <FormProfileUnlock @success="onAccountUnlocked" @error="onError" />
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
import { ModalFormProfileUnlockTs } from './ModalFormProfileUnlockTs'
export default class ModalFormProfileUnlock extends ModalFormProfileUnlockTs {}
</script>
