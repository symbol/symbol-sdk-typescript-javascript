<template>
  <div class="container">
    <Modal
      v-model="show"
      :title="$t('modal_account_unlock_title')"
      :transfer="false"
      class-name="modal-container"
    >
      <FormAccountUnlock @success="onAccountUnlocked" @error="onError" />
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
import { ModalFormAccountUnlockTs } from './ModalFormAccountUnlockTs'
export default class ModalFormAccountUnlock extends ModalFormAccountUnlockTs {}
</script>
