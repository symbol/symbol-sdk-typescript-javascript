<template>
  <div class="container">
    <Modal
      v-model="show"
      :title="$t('modal_title_enter_wallet_name')"
      :transfer="false"
      class-name="modal-container"
    >
      <FormWalletNameUpdate @submit="onSubmit" />
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
import { ModalFormWalletNameUpdateTs } from './ModalFormWalletNameUpdateTs'
export default class ModalFormWalletNameUpdate extends ModalFormWalletNameUpdateTs {}
</script>
