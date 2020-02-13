<template>
  <div class="wallet-switch-container">
    <div class="wallet-switch-header-container">
      <div class="wallet-switch-header-left-container">
        <h1 class="section-title">
          {{ $t('Wallet_management') }}
        </h1>
      </div>
      <div class="wallet-switch-header-right-container">
        <span class="back-up pointer">
          {{ $t('backup_mnemonic') }}
          <!-- @click="displayMnemonicDialog" -->
        </span>
      </div>
    </div>

    <div class="wallet-switch-body-container scroll">
      <div
        v-for="(item, index) in currentWallets"
        :key="index"
        :class="[
          'wallet-tile',
          isActiveWallet(item) ? 'active-background' : 'inactive-background',
          'pointer',
        ]"
        @click="currentWalletIdentifier = item.identifier"
      >
        <div class="wallet-tile-inner-container">
          <div class="wallet-tile-upper-container">
            <div class="wallet-name">
              <span>{{ item.name }}</span>
            </div>
          </div>

          <div class="wallet-tile-lower-container">
            <div class="wallet-amount">
              <MosaicAmountDisplay :relative-amount="addressesBalances[item.address]"
                                  :id="networkMosaic"
                                  :size="'bigger'" />
            </div>
            <div class="wallet-icons">
              <span class="wallet-icon">
                {{ item.isMultisig ? $t('Multisig') : '' }}
              </span>
              <span class="wallet-icon">
                icon
                <!-- @TODO: seed / privateKey -->
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="wallet-switch-footer-container">
      <button
        type="button" 
        class="button-add-wallet button-style validation-button"
        @click="hasAddWalletModal = true"
      >
        <Icon type="md-add-circle" />
        &nbsp;{{ $t('button_add_wallet') }}
      </button>
    </div>

    <ModalFormSubWalletCreation
      v-if="hasAddWalletModal"
      :visible="hasAddWalletModal"
      @close="hasAddWalletModal = false"
    />
  </div>
</template>

<script lang="ts">
import {WalletSelectorPanelTs} from './WalletSelectorPanelTs'
import './WalletSelectorPanel.less'

export default class WalletSelectorPanel extends WalletSelectorPanelTs {}
</script>

<style lang="less" scoped>
.walletMethod {
  text-align: center;
}

.button-add-wallet {
  height: 0.35rem !important;
  padding: 0 0.3rem;
  margin: auto;
}
</style>
