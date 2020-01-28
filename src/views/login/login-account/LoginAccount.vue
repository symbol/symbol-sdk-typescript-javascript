<template>
  <div class="login-account-wrapper">
    <form action="submit" onsubmit="event.preventDefault()" @keyup.enter="submit">
      <div class="switch-language-container">
        <Select v-model="language" :placeholder="$t('switch_language')">
          <Option v-for="item in languageList" :key="item.value" :value="item.value">
            {{ item.label }}
          </Option>
        </Select>
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
                  <div>
                    <span class="network-type-head-title">
                      {{ NetworkType[networkType] }}
                    </span>
                  </div>
                  <Option
                    v-for="(walletName, index) in accounts"
                    :key="`${walletName}${index}`"
                    :value="walletName"
                    :label="walletName"
                  >
                    <span>{{ walletName }}</span>
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
              v-validate="validationRules.accountPassword"
              :class="[!accountsClassifiedByNetworkType ? 'un_click' : '']"
              :disabled="!accountsClassifiedByNetworkType"
              type="password"
              data-vv-name="password"
              :data-vv-as="$t('password')"
              :placeholder="$t('please_enter_your_wallet_password')"
            >
          </ErrorTooltip>
          <input
            v-show="false" v-model="accountPassword" v-validate
            disabled data-vv-name="accountPassword"
          >

          <div class="password-tip">
            <span class="prompt pointer" @click="isShowHint = !isShowHint">{{ $t('Password_hint') }}</span>
            <span
              class="pointer create-account"
              @click="$router.push({name: 'login.importStrategy'})"
            >{{ $t('create_a_new_account') }}?</span>
          </div>
          <div v-if="isShowHint" class="hint">
            {{ $t('Password_hint') }}: {{ hintText }}
          </div>
          <div v-if="accountsClassifiedByNetworkType" class="pointer button" @click="submit">
            {{ $t('login') }}
          </div>
          <div v-else class="pointer button" @click="$router.push({name: 'login.importStrategy'})">
            {{ $t('register') }}
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import LoginAccountTs from '@/views/login/login-account/LoginAccountTs.ts'
import './LoginAccount.less'

export default class LoginAccount extends LoginAccountTs {
}
</script>
<style lang="less">
</style>
