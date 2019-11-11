<template>
  <Modal
    :title="$t('Activate_remote_harvesting')"
    v-model="show"
    :transfer="false"
    class-name="dash_board_dialog text_select"
  >
    <DisabledForms />

    <GetNodePublicKey v-if="showGetNodePublicKey" />

    <form action="submit" onsubmit="event.preventDefault()" @keyup.enter="submit">
      <div class="gray_input_content">
        <span class="title">{{$t('Node_public_key')}}</span>
        <ErrorTooltip fieldName="recipientPublicKey">
          <input
            v-model="recipientPublicKey"
            v-validate="'required|publicKey'"
            v-focus
            type="text"
            :placeholder="$t('Node_public_key')"
            :data-vv-as="$t('Node_public_key')"
            data-vv-name="recipientPublicKey"
          />
        </ErrorTooltip>
      </div>
      <div class="gray_input_content">
        <span
          class="link"
          @click="showGetNodePublicKey = !showGetNodePublicKey"
        >{{ showGetNodePublicKey ? $t('Hide') : $t('Show') }} {{ $t('helper') }}</span>
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
        <input v-show="false" v-model="wallet" v-validate disabled data-vv-name="wallet" />
      </div>
      <div class="new_model_btn">
        <span class="modal_btn pointer radius" @click="submit">{{$t('confirm')}}</span>
      </div>
    </form>
  </Modal>
</template>

<script lang="ts">
import { PersistentDelegationRequestTs } from "./PersistentDelegationRequestTs";
export default class PersistentDelegationRequest extends PersistentDelegationRequestTs {}
</script>
<style lang="less">
@import "PersistentDelegationRequest.less";
</style> 
