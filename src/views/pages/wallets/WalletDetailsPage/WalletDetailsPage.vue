<template>
  <div class="wallet-detail-outer-container">
    <div class="wallet-detail-inner-container">
      <div class="left-container">
        <div class="wallet-details-grid  mt-3">
          <div class="detail-row">
            <WalletNameDisplay 
              :wallet="currentWallet"
              :editable="true"
            />
          </div>

          <div class="detail-row">
            <ImportanceScoreDisplay :wallet="currentWallet" />
          </div>

          <div class="detail-row">
            <WalletAddressDisplay :wallet="currentWallet" />
          </div>

          <div class="detail-row">
            <WalletPublicKeyDisplay :wallet="currentWallet" />
          </div>

          <div class="detail-row">
            <ProtectedPrivateKeyDisplay :wallet="currentWallet" />
          </div>

          <!-- default wallet flag -->
          <div v-if="defaultWallet === currentWallet.getIdentifier()" class="detail-row">
            <div class="wallet-detail-row">
              <span class="label">{{ $t('wallets_flags_default_wallet') }}</span>
              <div class="value">
                <span>{{ $t('wallets_flags_default_wallet_explain') }}</span>
              </div>
            </div>
          </div>

          <!-- simple/multisig flag -->
          <div v-if="currentWallet.values.get('isMultisig')" class="detail-row">
            <div class="wallet-detail-row">
              <span class="label">{{ $t('wallets_flags_default_wallet') }}</span>
              <div class="value">
                <span>{{ $t('wallets_flags_default_wallet_explain') }}</span>
              </div>
            </div>
          </div>

          <div class="detail-row">
            <WalletAliasDisplay :wallet="currentWallet" />
          </div>
        </div>
      </div>
      <div class="right-container">
        <WalletContactQR :wallet="currentWallet" />
      </div>
    </div>

    <div class="wallet-detail-inner-container">
      <div class="left-container">
        <div class="title-row">
          <span>{{ $t('wallets_subtitle_account_links') }}</span>
        </div>

        <WalletLinks :wallet="currentWallet" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {WalletDetailsPageTs} from './WalletDetailsPageTs'
export default class WalletDetailsPage extends WalletDetailsPageTs {}
</script>

<style lang="less">
@import './WalletDetailsPage.less';
</style>
