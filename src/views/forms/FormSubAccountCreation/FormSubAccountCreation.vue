<template>
  <div>
    <FormWrapper
      ref="observer"
      class="sub-account-creation-container"
      :whitelisted="true"
      slim
    >
      <ValidationObserver v-slot="{ handleSubmit }" ref="observer" slim>
        <form
          class="form-container mt-3"
          onsubmit="event.preventDefault()"
          autocomplete="off"
        >
          <FormRow>
            <template v-slot:label>
              {{ $t('form_label_new_account_type') }}:
            </template>
            <template v-slot:inputs>
              <select 
                v-model="formItems.type"
                class="input-size input-style"
              >
                <option value="child_account">
                  {{ $t('option_child_account') }}
                </option>
                <option value="privatekey_account">
                  {{ $t('option_privatekey_account') }}
                </option>
              </select>
            </template>
          </FormRow>

          <FormRow>
            <template v-slot:label>
              {{ $t('form_label_new_account_name') }}:
            </template>
            <template v-slot:inputs>
              <ValidationProvider
                v-slot="{ errors }"
                mode="lazy"
                vid="name"
                :name="$t('name')"
                :rules="validationRules.profileAccountName"
                tag="div"
                class="inputs-container items-container"
              >
                <ErrorTooltip :errors="errors">
                  <input
                    v-model="formItems.name"
                    type="text"
                    name="name"
                    class="input-size input-style"
                    autocomplete="new-password"
                  >
                </ErrorTooltip>
              </ValidationProvider>
            </template>
          </FormRow>


          <FormRow v-if="formItems.type === 'privatekey_account'">
            <template v-slot:label>
              {{ $t('form_label_private_key') }}:
            </template>
            <template v-slot:inputs>
              <ValidationProvider
                v-slot="{ errors }"
                mode="lazy"
                vid="name"
                :name="$t('privateKey')"
                :rules="validationRules.privateKey"
                tag="div"
                class="inputs-container items-container"
              >
                <ErrorTooltip :errors="errors">
                  <input
                    v-model="formItems.privateKey"
                    type="password"
                    name="privateKey"
                    class="input-size input-style"
                    autocomplete="new-password"
                  >
                </ErrorTooltip>
              </ValidationProvider>
            </template>
          </FormRow>
          <FormRow>
            <template v-slot:inputs>
              <div class="align-right">
                <button
                  class="button-style validation-button left-side-button"
                  type="submit"
                  @click="handleSubmit(onSubmit)"
                >
                  {{ $t('confirm') }}
                </button>
              </div>
            </template>
          </FormRow>
        </form>
      </ValidationObserver>
    </FormWrapper>

    <ModalFormProfileUnlock
      v-if="hasAccountUnlockModal"
      :visible="hasAccountUnlockModal"
      :on-success="onAccountUnlocked"
      @close="hasAccountUnlockModal = false"
    />
  </div>
</template>

<script lang="ts">
import { FormSubAccountCreationTs } from './FormSubAccountCreationTs'
export default class FormSubAccountCreation extends FormSubAccountCreationTs {}
</script>

<style scope>
.sub-account-creation-container {
  display: block;
  width: 100%;
  clear: both;
  min-height: 1rem;
}
</style>

