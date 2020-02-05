<template>
  <div class="login-account-wrapper">
    <form action="submit" onsubmit="event.preventDefault()" @keyup.enter="submit">
      <div class="switch-language-container">
        <LanguageSelector />
      </div>
      <div class="welcome-box">
        <div class="banner-image">
          <div class="top-welcome-text">
            {{ $t('Nem_Catapult_Welcome_you_nice') }}!
          </div>
          <div class="bottom-welcome-text">
            {{ $t('This_program_is_free') }}
          </div>
        </div>
        <div class="login-card radius">
          <img src="@/views/resources/img/login/loginNewLogo.png">
          <p class="login-title">
            {{ $t('login_account') }}
          </p>
          <p class="account-name ">
            {{ $t('wallet_name') }}
          </p>

          <AutoComplete
            v-model="formItems.currentAccountName"
            placeholder=" "
            :class="[ 'select-wallet', !accountsClassifiedByNetworkType ? 'un_click' : '' ]"
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
                    <span class="network-type-head-title">
                      {{ getNetworkTypeLabel(networkType) }}
                    </span>
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
          <ErrorTooltip field-name="password">
            <input
              v-model.lazy="formItems.password"
              v-focus
              v-validate="'required|min:8'"
              :class="[!accountsClassifiedByNetworkType ? 'un_click' : '']"
              :disabled="!accountsClassifiedByNetworkType"
              type="password"
              data-vv-name="password"
              :data-vv-as="$t('password')"
              :placeholder="$t('please_enter_your_wallet_password')"
            >
          </ErrorTooltip>

          <div class="password-tip">
            <span class="prompt pointer" @click="formItems.hasHint = !formItems.hasHint">{{ $t('Password_hint') }}</span>
            <span
              class="pointer create-account"
              @click="$router.push({name: 'accounts.importAccount.importStrategy'})"
            >{{ $t('create_a_new_account') }}?</span>
          </div>
          <div v-if="formItems.hasHint" class="hint">
            {{ $t('Password_hint') }}: {{ getPasswordHint() }}
          </div>
          <div v-if="accountsClassifiedByNetworkType" class="pointer button" @click="submit">
            {{ $t('login') }}
          </div>
          <div v-else class="pointer button" @click="$router.push({name: 'accounts.importAccount.importStrategy'})">
            {{ $t('register') }}
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import LoginPageTs from './LoginPageTs'
import './LoginPage.less'

export default class LoginPage extends LoginPageTs {}
</script>
<style lang="less">
</style>
