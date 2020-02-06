<template>
  <div class="transaction_modal">
    <Modal
      v-if="visible"
      v-model="visible"
      :title="$t('modal_account_unlock_title')"
      :transfer="false"
      class-name="transaction-modal-dialog text_select"
    >
      <FormAccountUnlock v-else @success="onAccountUnlocked" @error="onError" />
    </Modal>
  </div>
</template>

<script lang="ts">
import {ModalFormAccountUnlockTs} from './ModalFormAccountUnlockTs'
import './ModalFormAccountUnlock.less'

export default class ModalFormAccountUnlock extends ModalFormAccountUnlockTs {}
</script>
