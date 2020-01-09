<template>
  <div class="login-account-wrapper">
    <form action="submit" onsubmit="event.preventDefault()" @keyup.enter="submit">
      <div class="switch-language-container">
        <Select v-model="language" :placeholder="$t('switch_language')">
          <Option v-for="item in languageList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
      <div class="welcome-box">
        <div class="banner-image">
          <div class="top-welcome-text">
            {{$t('Nem_Catapult_Welcome_you_nice')}}!
          </div>
          <div class="bottom-welcome-text">
            {{$t('This_program_is_free')}}
          </div>
        </div>
        <div class="login-card radius">
          <img src="@/common/img/login/loginNewLogo.png">
          <p class="login-title">{{$t('login_account')}}</p>
          <p class="account-name ">{{$t('wallet_name')}}</p>

          <AutoComplete
            v-model="formItems.currentAccountName"
            placeholder=" "
            :class="['select-wallet', !accountsClassifiedByNetworkType?'un_click':'']">
            <div class="auto-complete-sub-container scroll" >
              <div class="tips-in-sub-container">{{$t(accountsClassifiedByNetworkType?'Select_a_wallet_in_local_storage':'No_wallet_in_local_storage')}}</div>
              <div v-if="accountsClassifiedByNetworkType">
                <div
                  v-for="(accounts, networkType) in accountsClassifiedByNetworkType"
                  :key="networkType"
                >
                  <div>
                    <span class="network-type-head-title">
                      {{NetworkType[networkType]}}
                    </span>
                  </div>
                  <Option
                    v-for="(walletName, index) in accounts"
                    :value="walletName"
                    :key="`${walletName}${index}`"
                    :label="walletName"
                  >
                    <span>{{walletName}}</span>
                  </Option>
                </div>
              </div>
            </div>
          </AutoComplete>
          <p class="input-password">{{$t('password')}}</p>
          <ErrorTooltip fieldName="password">
            <input
                    :class="[!accountsClassifiedByNetworkType?'un_click':'']"
                    :disabled="!accountsClassifiedByNetworkType"
                    v-focus
                    v-model.lazy="formItems.password"
                    type="password"
                    v-validate="validation.accountPassword"
                    data-vv-name="password"
                    :data-vv-as="$t('password')"
                    :placeholder="$t('please_enter_your_wallet_password')"
            />
          </ErrorTooltip>
          <input v-show="false" v-model="accountPassword" v-validate disabled data-vv-name="accountPassword"/>

          <div class="password-tip">
            <span class="prompt pointer" @click="isShowHint = !isShowHint">{{$t('Password_hint')}}</span>
            <span class="pointer create-account"
                  @click="toChooseImportWay">{{$t('create_a_new_account')}}?</span>
          </div>
          <div class="hint" v-if="isShowHint">
            {{$t('Password_hint')}}: {{hintText}}
          </div>
          <div v-if="accountsClassifiedByNetworkType" class="pointer button" @click="submit">{{$t('login')}}</div>
          <div v-else class="pointer button" @click="toChooseImportWay">{{$t('register')}}</div>
        </div>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
    import LoginAccountTs from "@/views/login/login-account/LoginAccountTs.ts";
    import "./LoginAccount.less"

    export default class LoginAccount extends LoginAccountTs {
    }
</script>
<style lang="less">
</style>
