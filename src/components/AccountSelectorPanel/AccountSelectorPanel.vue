<template>
  <div class="account-switch-container">
    <div class="account-switch-header-container">
      <div class="account-switch-header-left-container">
        <h1 class="section-title">
          {{ $t('account_management') }}
        </h1>
      </div>
    </div>
    <div v-auto-scroll="'active-background'" class="account-switch-body-container scroll">
      <div
        v-for="(item, index) in currentAccounts"
        :key="index"
        :class="['account-tile', isActiveAccount(item) ? 'active-background' : 'inactive-background', 'pointer']"
        @click="currentAccountIdentifier = item.id"
      >
        <div class="account-tile-inner-container">
          <div class="account-tile-upper-container">
            <div class="account-name">
              <span>{{ item.name }}</span>
            </div>
          </div>

          <div class="account-tile-lower-container">
            <div class="account-amount">
              <MosaicAmountDisplay :absolute-amount="balances[item.address]" :size="'bigger'" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="account-switch-footer-container">
      <span class="add-account pointer" @click="hasAddAccountModal = true">
        <Icon type="md-add-circle" />{{ $t('button_add_account') }}
      </span>
      <div class="account-switch-header-right-container" @click="hasMnemonicExportModal = true">
        <span>
          <img src="@/views/resources/img/back-up.png" alt="" />
        </span>
        <span class="back-up pointer">{{ $t('backup_mnemonic') }}</span>
      </div>
      <ModalFormSubAccountCreation
        v-if="hasAddAccountModal"
        :visible="hasAddAccountModal"
        @close="hasAddAccountModal = false"
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
import { AccountSelectorPanelTs } from './AccountSelectorPanelTs'
import './AccountSelectorPanel.less'

export default class AccountSelectorPanel extends AccountSelectorPanelTs {}
</script>

<style lang="less" scoped>
.walletMethod {
  text-align: center;
}

.button-add-account {
  height: 0.35rem !important;
  padding: 0 0.3rem;
  margin: auto;
}
</style>
