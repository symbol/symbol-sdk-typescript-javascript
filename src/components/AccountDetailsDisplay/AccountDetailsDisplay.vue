<template>
  <div class="detail-double-row">
    <div class="detail-row">
      <div class="account-detail-row-3cols">
        <span class="label">{{ $t('account_address') }}</span>
        <span class="value accountAddress">{{ AccountModel.getObjects(account).address.pretty() }}</span>
        <span>
          <img
            src="@/views/resources/img/account/copyIcon.png"
            class="copy-icon"
            @click="uiHelpers.copyToClipboard(account.address)"
          />
        </span>
      </div>
    </div>
    <div class="detail-row">
      <div class="account-detail-row-3cols">
        <span class="label">{{ $t('account_public_key') }}</span>
        <span class="value accountPublicKey">{{ account.publicKey }}</span>
        <span>
          <img
            src="@/views/resources/img/account/copyIcon.png"
            class="copy-icon"
            @click="uiHelpers.copyToClipboard(account.publicKey)"
          />
        </span>
      </div>
    </div>
    <!--
    <p class="link_text">
      <span class="tit">{{ $t('Aliases') }}</span>
      <span class="  alias_add pointer" @click="bindNamespace()" />
      <span class="accountPublicKey">
        <span v-if="!selfAliases.length">-</span>
        <div v-if="selfAliases.length">
          <span v-for="(alias, index) in selfAliases" :key="index">
            <span class="aliasLink">
              <a @click="unbindNamespace(alias)">{{ alias.name }}</a>
              {{ index < selfAliases.length - 1 ? ' | ' : '' }}
            </span>
          </span>
        </div>
      </span>
    </p>
-->
  </div>
</template>

<script lang="ts">
import { AccountDetailsDisplayTs } from './AccountDetailsDisplayTs'
export default class AccountDetailsDisplay extends AccountDetailsDisplayTs {}
</script>

<style lang="less" scoped>
.copy-icon {
  width: 0.24rem;
  height: 0.24rem;
  margin-left: 0.18rem;
  cursor: pointer;
}
</style>
