<template>
  <Modal
    :title="$t(modalTitle)"
    v-model="show"
    :transfer="false"
    class-name="dash_board_dialog text_select"
    on-cancel="this.emit('close')"
  >
    <div v-if="remoteAccountPublicKey" class="text_select">
      <span
        v-if="!viewAccountPropertiesOnly"
        class="message"
      >{{ $t('Your_remote_account_has_been_successfully_saved_in_the_wallet') }}</span>

      <div class="gray_input_content">
        <span class="title">{{$t('Wallet_public_key')}}</span>
        <span>{{ remoteAccountPublicKey }}</span>
      </div>
      <div v-if="showPrivateKey" class="gray_input_content">
        <span class="title">{{$t('privatekey')}}</span>
        <span v-if="showPrivateKey">{{ privateKey }}</span>
      </div>
      <div class="gray_input_content">
        <span class="link">
          <span
            v-if="!showPrivateKey"
            @click="showPrivateKeyClicked(true)"
          >{{ $t('Show_private_key') }}</span>
          <span
            v-if="showPrivateKey"
            @click="showPrivateKeyClicked(false)"
          >{{ $t('Hide_private_key') }}</span>
        </span>
      </div>
    </div>

    <div v-if="!viewAccountPropertiesOnly && !hideForms">
      <CreationForm
        v-if="!importAccount && !remoteAccountPublicKey"
        @switch-mode="importAccount = true"
        @set-private-key="setPrivateKey"
      />
      <ImportForm
        v-if="importAccount || remoteAccountPublicKey"
        @switch-mode="importAccount = false"
        @set-private-key="setPrivateKey"
      />
    </div>

    <div v-if="showPasswordPrompt">
      <form
        action="getRemoteAccountPrivateKey"
        onsubmit="event.preventDefault()"
        @keyup.enter="getRemoteAccountPrivateKey"
      >
        <div class="gray_input_content">
          <span class="title">{{$t('password')}}</span>
          <ErrorTooltip fieldName="password">
            <input
              v-model.lazy="password"
              type="password"
              v-validate="validation.walletPassword"
              data-vv-name="password"
              :data-vv-as="$t('password')"
              placeholder="PLACEHOLDER_password"
            />
          </ErrorTooltip>
          <input v-show="false" v-model="wallet" v-validate disabled data-vv-name="wallet" />
        </div>
        <div class="new_model_btn">
          <span class="modal_btn pointer radius" @click="getRemoteAccountPrivateKey">
            {{$t('Show_private_key')}}
          </span>
        </div>
      </form>
    </div>

    <div v-if="hideForms">
      <div class="new_model_btn">
        <span
          class="modal_btn pointer radius"
          @click="$emit('openAccountLinkTransaction')"
        >{{$t('Link_now')}}</span>
      </div>
    </div>
  </Modal>
</template>

<script lang="ts">
import { CreateRemoteAccountTs } from "./CreateRemoteAccountTs";
export default class CreateRemoteAccount extends CreateRemoteAccountTs {}
</script>
<style lang="less">
@import "CreateRemoteAccount.less";
</style> 
