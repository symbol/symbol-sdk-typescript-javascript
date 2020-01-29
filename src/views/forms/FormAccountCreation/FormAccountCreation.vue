<template>
  <div class="create-account-sec" @keyup.enter="submit()">
    <p class="set-title">
      {{ $t('Create_an_account_and_password') }}
    </p>
    <p class="set-title-tips">
      {{ $t('Set_title_tips') }}
    </p>
    <div class="create-account-col">
      <div class="create-account-left">
        <div class="form-input-item">
          <div>* {{ $t('Set_account_name') }}</div>
          <ErrorTooltip field-name="newAccountName">
            <input
              v-model="formItems.accountName"
              v-validate="validationRules.newAccountName"
              v-focus
              data-vv-name="newAccountName"
              :data-vv-as="$t('newAccountName')"
              :placeholder="$t('account_name')"
            >
          </ErrorTooltip>
        </div>
        <div class="form-input-item">
          <div>* {{ $t('Set_network_type') }}</div>
          <Select v-model="formItems.networkType" :placeholder="$t('choose_network')" required>
            <Option v-for="(item,index) in networkTypeList" :key="index" :value="item.value">
              {{ item.label }}
            </Option>
          </Select>
        </div>
        <div class="form-input-item">
          <div>* {{ $t('Set_password') }}</div>
          <ErrorTooltip field-name="password">
            <input
              ref="passwordInput"
              name="password"
              v-model.lazy="formItems.password"
              v-focus
              v-validate="validationRules.password"
              data-vv-name="password"
              :data-vv-as="$t('password')"
              :placeholder="$t('please_enter_your_wallet_password')"
              type="password"
            >
          </ErrorTooltip>
        </div>
        <div class="form-input-item">
          <div>* {{ $t('Confirm_password') }}</div>
          <ErrorTooltip field-name="confirmPassword">
            <input
              v-model.lazy="formItems.passwordAgain"
              v-focus
              v-validate="'required|confirmed:passwordInput'"
              data-vv-name="confirmPassword"
              :data-vv-as="$t('password')"
              :placeholder="$t('please_enter_your_wallet_password')"
              type="password"
            >
          </ErrorTooltip>
        </div>
        <div class="form-input-item">
          <div>* {{ $t('Password_hint') }}</div>
          <input v-model="formItems.hint">
        </div>
        <div class="button-container">
          <button class="info-button" @click="$router.push({name: 'login'})">
            {{ $t('Back_to_home') }}
          </button>
          <button @click="submit">
            {{ $t(nextPage === 'login.importAccount.importMnemonic' ? 'Restore_Mnemonic' : 'Generating_mnemonic') }}
          </button>
        </div>
      </div>
      <div class="create-account-right">
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
  </div>
</template>

<script lang="ts">
import {FormAccountCreationTs} from './FormAccountCreationTs'
import './FormAccountCreation.less'

export default class FormAccountCreation extends FormAccountCreationTs {}
</script>
