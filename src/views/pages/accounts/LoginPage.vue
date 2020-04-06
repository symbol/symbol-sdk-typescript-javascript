<template>
  <div class="login-account-wrapper">
    <div class="login-account-background-img">
      <form action="submit" onsubmit="event.preventDefault()" @keyup.enter="submit">
        <div class="switch-language-container">
          <LanguageSelector />
        </div>
        <div class="welcome-box">
          <div class="banner-image">
            <span class="top-welcome-text">{{ $t('welcome') }}</span>
            <span class="top-to-symbol-text">{{ $t('to_symbol') }}</span>
            <div class="bottom-welcome-text">
              {{ $t('program_description') }}
            </div>
          </div>
          <div class="login-card radius">
            <div class="img-box" />
            <p class="login-title">
              {{ $t('login_account') }}
            </p>
            <p class="account-name">
              {{ $t('account_name') }}
            </p>
            <AutoComplete
              v-model="formItems.currentAccountName"
              placeholder=" "
              :class="[
                'select-wallet',
                !accountsClassifiedByNetworkType ? 'un_click' : 'account-name-input',
              ]"
            >
              <div class="auto-complete-sub-container scroll">
                <div class="tips-in-sub-container">
                  {{ $t(accountsClassifiedByNetworkType
                    ? 'Select_a_wallet_in_local_storage' : 'No_wallet_in_local_storage'
                  ) }}
                </div>
                <div v-if="accountsClassifiedByNetworkType">
                  <div
                    v-for="(accounts, networkType) in accountsClassifiedByNetworkType"
                    :key="networkType"
                  >
                    <div v-if="accounts.length">
                      <span class="network-type-head-title">{{ getNetworkTypeLabel(networkType) }}</span>
                    </div>
                    <Option
                      v-for="(accountName, index) in accounts"
                      :key="`${accountName}${index}`"
                      :value="accountName"
                      :label="accountName"
                    >
                      <span>{{ accountName }}</span>
                    </Option>
                  </div>
                </div>
              </div>
            </AutoComplete>
            <p class="input-password">
              {{ $t('password') }}
            </p>
            <ValidationProvider
              v-slot="{ errors }"
              mode="lazy"
              vid="password"
              :name="$t('password')"
              rules="required|min:8"
            >
              <ErrorTooltip field-name="password" :errors="errors">
                <input
                  v-model="formItems.password"
                  v-focus
                  :class="[!accountsClassifiedByNetworkType ? 'un_click' : '']"
                  :placeholder="$t('please_enter_your_wallet_password')"
                  type="password"
                  :disabled="!accountsClassifiedByNetworkType"
                >
              </ErrorTooltip>
            </ValidationProvider>

            <div class="password-tip">
              <span
                class="prompt pointer"
                @click="formItems.hasHint = !formItems.hasHint"
              >{{ $t('Password_hint') }}</span>
              <span
                class="pointer create-account"
                @click="$router.push({name: 'accounts.importAccount.importStrategy'})"
              >{{ $t('create_a_new_account') }}?</span>
            </div>
            <div
              v-if="formItems.hasHint"
              class="hint"
            >
              {{ $t('Password_hint') }}: {{ getPasswordHint() }}
            </div>
            <div
              v-if="accountsClassifiedByNetworkType"
              class="pointer button"
              @click.stop="submit"
            >
              {{ $t('login') }}
            </div>
            <div
              v-else
              class="pointer button"
              @click="$router.push({name: 'accounts.importAccount.importStrategy'})"
            >
              {{ $t('register') }}
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import LoginPageTs from './LoginPageTs'
import './LoginPage.less'

export default class LoginPage extends LoginPageTs {}
</script>
