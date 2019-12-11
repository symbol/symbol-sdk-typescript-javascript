<template>
  <form action="createRemoteAccount" onsubmit="event.preventDefault()" @keyup.enter="submit">
    <div class="gray_input_content">
      <span class="title">{{$t('password')}}</span>
      <ErrorTooltip fieldName="password">
        <input
          v-model.lazy="password"
          type="password"
          v-validate="validation.walletPassword"
          data-vv-name="password"
          :data-vv-as="$t('password')"
          :placeholder="$t('password')"
        />
      </ErrorTooltip>
      <input v-show="false" v-model="wallet" v-validate disabled data-vv-name="wallet" />
    </div>
    <span class="link" @click="$emit('switch-mode')">{{ $t('Import_remote_account') }}</span>
    <div class="new_model_btn">
      <span class="modal_btn pointer radius" @click="submit">{{$t('confirm')}}</span>
    </div>
  </form>
</template>

<script lang="ts">
import { CreationFormTs } from "./CreationFormTs";
export default class CreationForm extends CreationFormTs {}
</script>
<style lang="less">
@import "../CreateRemoteAccount.less";
</style> 
