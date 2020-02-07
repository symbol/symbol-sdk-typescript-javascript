<template>
  <div class="container">
    <Modal
      v-model="show"
      :title="$t('modal_account_unlock_title')"
      :transfer="false"
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
import '@/styles/forms.less'
export default class ModalFormAccountUnlock extends ModalFormAccountUnlockTs {}
</script>

<style>
.ivu-modal-content   {
  width: 8.5rem;
}

.modal-footer {
  height: 0.46rem;
  padding-right: 0.4rem;
}

.float-right {
  float: right;
}
</style>
