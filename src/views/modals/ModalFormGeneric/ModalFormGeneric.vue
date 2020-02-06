<template>
  <div class="transaction_modal">
    <Modal
      v-if="visible"
      v-model="visible"
      :title="$t('modal_account_unlock_title')"
      :transfer="false"
      class-name="transaction-modal-dialog text_select"
    >
      <form action="submit()" @keyup.enter="submit()">
        <slot name="fields" v-bind:formItems="formItems"></slot>

        <button type="cancel" @click="cancel()">{{ $t('cancel') }}</button>
        <button type="submit" @click="submit()">{{ $t('send') }}</button>
      </form>
    </Modal>
  </div>
</template>

<script lang="ts">
import {ModalFormGenericTs} from './ModalFormGenericTs'
import './ModalFormGeneric.less'

export default class ModalFormGeneric extends ModalFormGenericTs {}
</script>
