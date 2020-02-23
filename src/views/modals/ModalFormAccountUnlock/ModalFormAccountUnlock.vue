<template>
  <div class="container">
    <Modal
      v-model="show"
      :title="$t('modal_account_unlock_title')"
      :transfer="false"
      class-name="modal-form-account-unlock"
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

<style lang="less"> 
.modal-form-account-unlock {
  .ivu-modal { width: unset !important }
  .ivu-modal-content   {
    min-width: 8.5rem;
    max-width: 12rem;
    margin: auto;
  }
}

.modal-footer {
  height: 0.46rem;
  padding-right: 0.4rem;
}

.float-right {
  float: right;
}
</style>
