<template>
  <div v-show="currentAccount" class="account-detail-outer-container">
    <div class="account-detail-inner-container">
      <div class="left-container">
        <div class="account-details-grid">
          <div class="detail-row">
            <AccountNameDisplay :account="currentAccount" :editable="true" />
          </div>

          <div class="detail-row">
            <ImportanceScoreDisplay :address="currentAccount.address" />
          </div>

          <div class="detail-row">
            <AccountAddressDisplay :account="currentAccount" />
          </div>

          <div class="detail-row">
            <AccountPublicKeyDisplay :account="currentAccount" />
          </div>

          <div class="detail-row">
            <ProtectedPrivateKeyDisplay :account="currentAccount" />
          </div>

          <!-- default account flag -->
          <div v-if="defaultAccount === currentAccount.id" class="detail-row">
            <div class="account-detail-row">
              <span class="label">{{ $t('accounts_flags_default_account') }}</span>
              <div class="value">
                <span>{{ $t('accounts_flags_default_account_explain') }}</span>
              </div>
            </div>
          </div>

          <!-- simple/multisig flag -->
          <div v-if="currentAccount.isMultisig" class="detail-row">
            <div class="account-detail-row">
              <span class="label">{{ $t('accounts_flags_default_account') }}</span>
              <div class="value">
                <span>{{ $t('accounts_flags_default_account_explain') }}</span>
              </div>
            </div>
          </div>

          <div class="detail-row">
            <AccountAliasDisplay :account="currentAccount" />
          </div>
        </div>
      </div>
      <div class="right-container">
        <AccountContactQR :account="currentAccount" />
      </div>
    </div>

    <div class="account-detail-inner-container">
      <div class="left-container">
        <div class="title-row">
          <span>{{ $t('accounts_subtitle_account_links') }}</span>
        </div>

        <AccountLinks :account="currentAccount" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { AccountDetailsPageTs } from './AccountDetailsPageTs'
export default class AccountDetailsPage extends AccountDetailsPageTs {}
</script>

<style lang="less" scoped>
@import './AccountDetailsPage.less';
</style>
