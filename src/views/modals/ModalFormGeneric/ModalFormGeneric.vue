<template>
  <div class="transaction_modal">
    <Modal
      v-model="show"
      :title="title"
      :transfer="false"
      class-name="transaction-modal-dialog text_select"
    >
      <FormWrapper class="generic-form-container">
        <ValidationObserver v-slot="{ handleSubmit }">
          <form
            action="handleSubmit(submit)"
            onsubmit="event.preventDefault()"
            class="mt-3"
            @keyup.enter="handleSubmit(submit)"
          >
            <div class="inline-container">
              <slot name="fields" v-bind:formItems="formItems"></slot>
              <button
                class="button-style validation-button right-side-button"
                type="submit"
                @click="handleSubmit(submit)"
              >
                {{ $t('confirm') }}
              </button>
            </div>
          </form>
        </ValidationObserver>
      </FormWrapper>

      <div slot="footer" class="modal-footer">
        <button
          type="reset"
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
import {ModalFormGenericTs} from './ModalFormGenericTs'

export default class ModalFormGeneric extends ModalFormGenericTs {}
</script>

<style lang="less" scoped>
.generic-form-container {
  display: block;
  width: 100%;
  clear: both;
  min-height: 1rem;
}
</style>
