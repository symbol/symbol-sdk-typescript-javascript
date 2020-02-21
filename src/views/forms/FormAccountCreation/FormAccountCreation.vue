<template>
  <div class="scroll">
    <FormWrapper>
      <ValidationObserver v-slot="{ handleSubmit }">
        <form onsubmit="event.preventDefault()" @keyup.enter="handleSubmit(submit)">
          <div class="fixed-full-width-item-container">
            <div class="form-headline">
              {{ $t('Create_an_account_and_password') }}
            </div>
          </div>

          <div class="fixed-full-width-item-container">
            <div class="form-line-container">
              <div class="form-text">
                {{ $t('Account_creation_description') }}
              </div>
            </div>
          </div>

          <div class="form-line-container">
            <FormLabel>{{ $t('Set_account_name') }}</FormLabel>
            <ValidationProvider
              v-slot="{ errors }"
              vid="newAccountName"
              :name="$t('newAccountName')"
              :rules="validationRules.newAccountName"
              tag="div"
              class="inline-container"
            >
              <ErrorTooltip :errors="errors">
                <div class="full-width-item-container">
                  <input
                    v-model="formItems.accountName"
                    v-focus
                    class="full-width-item-container input-size input-style"
                    :placeholder="$t('account_name')"
                  >
                </div>
              </ErrorTooltip>
            </ValidationProvider>
          </div>

          <div class="form-line-container">
            <FormLabel>{{ $t('Set_network_type') }}</FormLabel>
            <div class="inline-container">
              <div class="full-width-item-container">
                <Select
                  v-model="formItems.networkType"
                  :placeholder="$t('choose_network')"
                  class="select-size select-style"
                >
                  <Option v-for="(item,index) in networkTypeList" :key="index" :value="item.value">
                    {{ item.label }}
                  </Option>
                </Select>
              </div>
            </div>
          </div>

          <div class="form-line-container">
            <FormLabel>{{ $t('new_password_label') }}</FormLabel>
            <ValidationProvider
              v-slot="{ errors }"
              vid="newPassword"
              mode="lazy"
              :name="$t('password')"
              :rules="validationRules.password"
              tag="div"
              class="inline-container"
            >
              <ErrorTooltip :errors="errors">
                <div class="full-width-item-container">
                  <input
                    ref="passwordInput"
                    v-model="formItems.password"
                    class="full-width-item-container input-size input-style"
                    :placeholder="$t('please_enter_your_wallet_password')"
                    type="password"
                  >
                </div>
              </ErrorTooltip>
            </ValidationProvider>
          </div>

          <div class="form-line-container">
            <FormLabel>{{ $t('repeat_password_label') }}</FormLabel>
            <ValidationProvider
              v-slot="{ errors }"
              vid="confirmPassword"
              :name="$t('confirmPassword')"
              :rules="validationRules.confirmPassword"
              tag="div"
              class="inline-container"
            >
              <ErrorTooltip :errors="errors">
                <div class="full-width-item-container">
                  <input
                    v-model="formItems.passwordAgain"
                    class="full-width-item-container input-size input-style"
                    data-vv-name="confirmPassword"
                    :placeholder="$t('please_enter_your_new_password_again')"
                    type="password"
                  >
                </div>
              </ErrorTooltip>
            </ValidationProvider>
          </div>

          <div class="form-line-container">
            <FormLabel>{{ $t('Password_hint') }}</FormLabel>
            <ValidationProvider
              v-slot="{ errors }"
              vid="hint"
              :name="$t('hint')"
              :rules="validationRules.message"
              tag="div"
              class="inline-container"
            >
              <ErrorTooltip :errors="errors">
                <div class="full-width-item-container">
                  <input
                    v-model="formItems.hint"
                    class="full-width-item-container input-size input-style"
                  >
                </div>
              </ErrorTooltip>
            </ValidationProvider>
          </div>

          <div class="form-line-container fixed-full-width-item-container">
            <div class="flex-container mt-3">
              <button
                type="button"
                class="button-style back-button" 
                @click="$router.push({name: 'accounts.login'})"
              >
                {{ $t('back') }}
              </button>
              <button
                type="submit"
                class="button-style validation-button" 
                @click="handleSubmit(submit)"
              >
                {{ $t(nextPage === 'accounts.importAccount.importMnemonic'
                  ? 'Restore_Mnemonic'
                  : 'Generating_mnemonic'
                ) }}
              </button>
            </div>
          </div>
        </form>
      </ValidationObserver>
    </FormWrapper>

    <div class="right-hints-section">
      <p class="text1">
        {{ $t('Account_description') }}
      </p>
      <p class=" text">
        {{ $t('Account_description_tips1') }}
      </p>
      <p class=" text">
        {{ $t('Account_description_tips2') }}
      </p>
      <p class="text red">
        {{ $t('Account_description_tips3') }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import {FormAccountCreationTs} from './FormAccountCreationTs'
export default class FormAccountCreation extends FormAccountCreationTs {}
</script>

<style>
.right-hints-section {
  display: block;
  position: absolute;
  width: 5rem;
  float: left;
  left: 10.5rem;
  top: 2.5rem;
}
</style>
