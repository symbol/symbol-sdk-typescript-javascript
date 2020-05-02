<template>
  <div class="form-account-creation-container">
    <FormWrapper :whitelisted="true">
      <ValidationObserver v-slot="{ handleSubmit }" ref="observer" slim>
        <form onsubmit="event.preventDefault()">
          <div class="form-row">
            <div class="form-headline">
              {{ $t('choose_profile_name_and_password') }}
            </div>
          </div>

          <div class="form-row">
            <div class="form-line-container">
              <div class="form-text">
                {{ $t('profile_creation_description') }}
              </div>
            </div>
          </div>

          <FormRow>
            <template v-slot:label> {{ $t('Set_account_name') }}: </template>
            <template v-slot:inputs>
              <ValidationProvider
                v-slot="{ errors }"
                vid="newAccountName"
                :name="$t('newAccountName')"
                :rules="validationRules.newAccountName"
                tag="div"
                class="inputs-container items-container"
              >
                <ErrorTooltip :errors="errors">
                  <input
                    ref="passwordInput"
                    v-model="formItems.profileName"
                    class="input-size input-style"
                    type="text"
                  />
                </ErrorTooltip>
              </ValidationProvider>
            </template>
          </FormRow>

          <FormRow>
            <template v-slot:label> {{ $t('Set_network_type') }}: </template>
            <template v-slot:inputs>
              <div class="inputs-container select-container">
                <select
                  v-model="formItems.networkType"
                  :placeholder="$t('choose_network')"
                  class="select-size select-style"
                >
                  <option v-for="(item, index) in networkTypeList" :key="index" :value="item.value">
                    {{ item.label }}
                  </option>
                </select>
              </div>
            </template>
          </FormRow>

          <!-- @TODO: Place hint(should contain at least 8 characters, 1 letter and 1 number) -->
          <FormRow>
            <template v-slot:label> {{ $t('new_password_label') }}: </template>
            <template v-slot:inputs>
              <ValidationProvider
                v-slot="{ errors }"
                vid="newPassword"
                mode="lazy"
                :name="$t('password')"
                :rules="validationRules.password"
                tag="div"
                class="inputs-container select-container"
              >
                <ErrorTooltip :errors="errors">
                  <input
                    ref="passwordInput"
                    v-model="formItems.password"
                    class="input-size input-style"
                    :placeholder="$t('please_enter_your_account_password')"
                    type="password"
                  />
                </ErrorTooltip>
              </ValidationProvider>
            </template>
          </FormRow>

          <FormRow>
            <template v-slot:label> {{ $t('repeat_password_label') }}: </template>
            <template v-slot:inputs>
              <ValidationProvider
                v-slot="{ errors }"
                vid="confirmPassword"
                :name="$t('confirmPassword')"
                :rules="validationRules.confirmPassword"
                tag="div"
                class="inputs-container items-container"
              >
                <ErrorTooltip :errors="errors">
                  <input
                    v-model="formItems.passwordAgain"
                    class="input-size input-style"
                    data-vv-name="confirmPassword"
                    :placeholder="$t('please_enter_your_new_password_again')"
                    type="password"
                  />
                </ErrorTooltip>
              </ValidationProvider>
            </template>
          </FormRow>

          <FormRow>
            <template v-slot:label> {{ $t('Password_hint') }}: </template>
            <template v-slot:inputs>
              <ValidationProvider
                v-slot="{ errors }"
                vid="hint"
                :name="$t('hint')"
                :rules="validationRules.message"
                tag="div"
                class="inputs-container items-container"
              >
                <ErrorTooltip :errors="errors">
                  <input v-model="formItems.hint" class="input-size input-style" />
                </ErrorTooltip>
              </ValidationProvider>
            </template>
          </FormRow>

          <div class="form-line-container form-row">
            <div class="flex-container mt-3">
              <button type="button" class="button-style back-button" @click="$router.back(-1)">
                {{ $t('back') }}
              </button>
              <button type="submit" class="button-style validation-button" @click="handleSubmit(submit)">
                {{
                  $t(nextPage === 'profiles.importProfile.importMnemonic' ? 'Restore_Mnemonic' : 'Generating_mnemonic')
                }}
              </button>
            </div>
          </div>
        </form>
      </ValidationObserver>
    </FormWrapper>

    <div class="right-hints-section">
      <p class="text1">
        {{ $t('profile_description') }}
      </p>
      <p class="text">
        {{ $t('profile_description_tips1') }}
      </p>
      <p class="text">
        {{ $t('profile_description_tips2') }}
      </p>
      <p class="text red">
        {{ $t('profile_description_tips3') }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { FormProfileCreationTs } from './FormProfileCreationTs'
export default class FormProfileCreation extends FormProfileCreationTs {}
</script>

<style lang="less">
.right-hints-section {
  display: block;
  width: 5rem;
  padding: 0.5rem;
}

.form-account-creation-container {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: 100%;
  grid-template-columns: 10.4rem 20%;
}
</style>
