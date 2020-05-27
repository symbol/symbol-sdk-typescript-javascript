<template>
  <div class="detail-double-row">
    <div class="detail-row">
      <div class="account-detail-row-3cols">
        <span class="label">{{ $t('account_address') }}</span>
        <span class="value accountAddress">{{ AccountModel.getObjects(account).address.pretty() }}</span>
        <span>
          <ButtonCopyToClipboard v-model="account.address">
            <img src="@/views/resources/img/account/copyIcon.png" class="copy-icon" />
          </ButtonCopyToClipboard>
        </span>
      </div>
    </div>
    <div class="detail-row">
      <div class="account-detail-row-3cols">
        <span class="label">{{ $t('account_public_key') }}</span>
        <span class="value accountPublicKey">{{ account.publicKey }}</span>
        <span>
          <ButtonCopyToClipboard v-model="account.publicKey">
            <img src="@/views/resources/img/account/copyIcon.png" class="copy-icon" />
          </ButtonCopyToClipboard>
        </span>
      </div>
    </div>
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
