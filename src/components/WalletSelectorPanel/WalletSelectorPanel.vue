<template>
  <div class="wallet-switch-container">
    <div class="wallet-switch-header-container">
      <div class="wallet-switch-header-left-container">
        <h1 class="section-title">
          {{ $t('Wallet_management') }}
        </h1>
      </div>
    </div>
    <div class="wallet-switch-body-container scroll">
      <Spin v-show="isLoading" fix />
      <div
        v-for="(item, index) in currentWallets"
        v-show="!isLoading"
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
              <MosaicAmountDisplay
                :id="networkMosaic"
                :relative-amount="balances[item.address]"
                :size="'bigger'"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="wallet-switch-footer-container">
      <span class="add-wallet pointer" @click="hasAddWalletModal = true">
        <Icon type="md-add-circle" />{{ $t('button_add_wallet') }}
      </span>
      <div class="wallet-switch-header-right-container" @click="hasMnemonicExportModal = true">
        <span>
          <img src="@/views/resources/img/back-up.png" alt="">
        </span>
        <span class="back-up pointer">{{ $t('backup_mnemonic') }}</span>
      </div>
      <ModalFormSubWalletCreation
        v-if="hasAddWalletModal"
        :visible="hasAddWalletModal"
        @close="hasAddWalletModal = false"
      />

      <ModalMnemonicExport
        v-if="hasMnemonicExportModal"
        :visible="hasMnemonicExportModal"
        @close="hasMnemonicExportModal = false"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { WalletSelectorPanelTs } from './WalletSelectorPanelTs'
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
