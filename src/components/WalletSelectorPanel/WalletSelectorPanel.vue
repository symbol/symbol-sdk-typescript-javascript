<template>
  <div class="walletSwitchWrap">
    <div class="walletSwitchHead">
      <p class="tit">
        {{ $t('Wallet_management') }}
      </p>
      <!--
      <p class="back-up pointer" @click="displayMnemonicDialog">
        {{ $t('backup_mnemonic') }}
      </p>
      -->
    </div>

    <div ref="walletScroll" class="walletList scroll">
      <div v-for="(item, index) in currentWallets" :key="index" class="wallet_scroll_item">
        <div
          ref="walletsDiv"
          :class="{
            'walletItem': true,
            'radius': true,
            'walletItem_bg_0': isActiveWallet(item),
            'walletItem_bg_2': !isActiveWallet(item),
          }"
          @click="currentWalletIdentifier = item.identifier"
        >
          <Row>
            <i-col span="15">
              <div>
                <p class="walletName">
                  {{ item.name }}
                </p>
                <p class="walletAmount overflow_ellipsis">
                  <div class="amount">
                    <AmountDisplay :amount="networkMosaicBalance" />
                  </div>
                  <div>{{ networkMosaicTicker }}</div>
                </p>
              </div>
            </i-col>
            <i-col span="9">
              <div @click.stop>
                <div class="walletTypeTxt">
                  {{ item.isMultisig? $t('Multisig') : '' }}
                </div>
                <div class="options">
                  <span class="mosaics">
                    <Icon type="logo-buffer" />
                  </span>
                  <!--
                  <span class="delete" @click="onClickDelete(item)">
                    <Icon type="md-trash" />
                  </span>
                  -->
                </div>
              </div>
            </i-col>
          </Row>
        </div>
      </div>
    </div>

    <div class="walletMethod">
      <button type="button" 
              class="button-style validation-button right-side-button plus-button" 
              @click="hasAddWalletModal = true">
        <Icon type="md-add-circle" />
        <span>&nbsp{{ $t('button_add_wallet') }}</span>
      </button>
    </div>

    <ModalFormSubWalletCreation
      v-if="hasAddWalletModal"
      :visible="hasAddWalletModal"
      @close="hasAddWalletModal = false" />

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

.plus-button {
  height: 0.35rem !important;
  padding: 0 0.3rem;
  margin: auto;
}
</style>