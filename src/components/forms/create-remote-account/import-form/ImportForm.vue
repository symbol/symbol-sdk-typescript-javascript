<template>
  <form action="importRemoteAccount" onsubmit="event.preventDefault()" @keyup.enter="submit">
    <div v-if="wallet.linkedAccountKey" class="form-text-block">
      <span>{{ $t('account_must_match_linked') }}</span>
      <span>{{ $t('if_want_new_account_unlink') }}</span>
      <span> {{ $t('Linked_account_key') }}: {{ wallet.linkedAccountKey }}</span>
    </div>
    <div class="gray_input_content">
      <span class="title">{{$t('privatekey')}}</span>
      <ErrorTooltip fieldName="privateKey">
        <input
          v-model="privateKey"
          type="password"
          v-validate="'required|remoteAccountPrivateKey:wallet'"
          data-vv-name="privateKey"
          :data-vv-as="$t('privatekey')"
          :placeholder="$t('privatekey')"
        />
      </ErrorTooltip>
    </div>
    <div class="gray_input_content">
      <span class="title">{{$t('password')}}</span>
      <ErrorTooltip fieldName="password">
        <input
          v-model="password"
          :type="standardFields.walletPassword.type"
          v-validate="standardFields.walletPassword.validation"
          :data-vv-name="standardFields.walletPassword.name"
          :data-vv-as="$t(standardFields.walletPassword.name)"
          :placeholder="$t(standardFields.walletPassword.name)"
        />
      </ErrorTooltip>
      <input
        v-show="false"
        v-model="wallet"
        v-validate=""
        disabled
        data-vv-name="wallet"
      />
    </div>
    <span
      v-if="!wallet.linkedAccountKey"
      class="link" @click="$emit('switch-mode')"
    >
      {{ $t('Create_new_remote_account') }}
    </span>
    <div class="new_model_btn">
      <span class="modal_btn pointer radius" @click="submit">{{$t('confirm')}}</span>
    </div>
  </form>
</template>

<script lang="ts">
import { ImportFormTs } from "./ImportFormTs";
export default class ImportForm extends ImportFormTs {}
</script>
<style lang="less">
@import "../CreateRemoteAccount.less";
</style>
