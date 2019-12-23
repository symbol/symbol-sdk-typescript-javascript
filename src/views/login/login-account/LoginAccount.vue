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
        <div class="login-card">
          <img src="@/common/img/login/loginNewLogo.png">
          <p class="login-title">{{$t('login_account')}}</p>
          <p class="account-name ">{{$t('wallet_name')}}</p>

          <Select
                  v-model="formItems.currentAccountName"
                  placeholder=" "
                  :class="['select_wallet', accountList.length == 0?'un_click':'']" @change="test">
            <Option v-for="walletName in accountList" :value="walletName.value" :key="walletName.value" :label="walletName.label">
              <span>{{walletName.label}}</span>
              <span class="login-account-network-type">[{{walletName.networkType}}]</span>
            </Option>
          </Select>
          <p class="input-password">{{$t('password')}}</p>

          <ErrorTooltip fieldName="password">
            <input
                    :class="[accountList.length == 0?'un_click':'']"
                    :disabled="accountList.length == 0"
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
            <span class="prompt pointer" @click="isShowHint = !isShowHint">{{$t('hint')}}</span>
            <span class="pointer create-account"
                  @click="toChooseImportWay">{{$t('create_a_new_account')}}?</span>
          </div>
          <div class="hint" v-if="isShowHint">
            {{$t('hint')}} : {{hintText}}
          </div>
          <div v-if="accountList.length" class="pointer button" @click="submit">{{$t('login')}}</div>
          <div v-else class="pointer button" @click="toChooseImportWay">{{$t('register')}}</div>
        </div>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
    import LoginAccountTs from "./LoginAccountTs";
    import "./LoginAccount.less"

    export default class LoginAccount extends LoginAccountTs {
    }
</script>
<style lang="less">
</style>
