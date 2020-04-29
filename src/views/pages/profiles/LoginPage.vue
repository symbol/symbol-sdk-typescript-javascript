<template>
  <div class="login-profile-wrapper">
    <div class="login-profile-background-img">
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
              {{ $t('login') }}
            </p>
            <p class="profile-name">
              {{ $t('account_name') }}
            </p>
            <AutoComplete
              v-model="formItems.currentProfileName"
              placeholder=" "
              :class="[
                'select-account',
                !profilesClassifiedByNetworkType ? 'un_click' : 'profile-name-input',
              ]"
            >
              <div class="auto-complete-sub-container scroll">
                <div class="tips-in-sub-container">
                  {{ $t(profilesClassifiedByNetworkType
                    ? 'Select_a_profile' : 'no_profiles_in_database'
                  ) }}
                </div>
                <div v-if="profilesClassifiedByNetworkType">
                  <div
                    v-for="pair in profilesClassifiedByNetworkType"
                    :key="pair.networkType"
                  >
                    <div v-if="pair.profiles.length">
                      <span class="network-type-head-title">{{ getNetworkTypeLabel(pair.networkType) }}</span>
                    </div>
                    <Option
                      v-for="(profile, index) in pair.profiles"
                      :key="`${profile.profileName}${index}`"
                      :value="profile.profileName"
                      :label="profile.profileName"
                    >
                      <span>{{ profile.profileName }}</span>
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
                  :class="[!profilesClassifiedByNetworkType ? 'un_click' : '']"
                  :placeholder="$t('please_enter_your_account_password')"
                  type="password"
                  :disabled="!profilesClassifiedByNetworkType"
                >
              </ErrorTooltip>
            </ValidationProvider>

            <div class="password-tip">
              <span
                class="prompt pointer"
                @click="formItems.hasHint = !formItems.hasHint"
              >{{ $t('Password_hint') }}</span>
              <span
                class="pointer create-profile"
                @click="$router.push({name: 'profiles.importProfile.importStrategy'})"
              >{{ $t('create_a_new_account') }}?</span>
            </div>
            <div
              v-if="formItems.hasHint"
              class="hint"
            >
              {{ $t('Password_hint') }}: {{ getPasswordHint() }}
            </div>
            <div
              v-if="profilesClassifiedByNetworkType"
              class="pointer button"
              @click.stop="submit"
            >
              {{ $t('login') }}
            </div>
            <div
              v-else
              class="pointer button"
              @click="$router.push({name: 'profiles.importProfile.importStrategy'})"
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
