<template>
  <div class="walletSwitchWrap">
    <div class="walletSwitchHead">
      <p class="tit">
        {{ $t('Wallet_management') }}
      </p>
      <p class="back-up pointer" @click="displayMnemonicDialog">
        {{ $t('backup_mnemonic') }}
      </p>
    </div>

    <div ref="walletScroll" class="walletList scroll">
      <div v-for="(item, index) in walletList" :key="index" class="wallet_scroll_item">
        <div
          ref="walletsDiv"
          :class="[ 'walletItem', getWalletStyle(item), 'radius' ]"
          @click="switchWallet(item.address)"
        >
          <Row>
            <i-col span="15">
              <div>
                <p class="walletName">
                  {{ item.name }}
                </p>
                <p class="walletAmount overflow_ellipsis">
                  <NumberFormatting :number-of-formatting="getBalanceFromAddress(item)" />
                  <span class="tails">{{ networkCurrency.ticker }}</span>
                </p>
              </div>
            </i-col>
            <i-col span="9">
              <div @click.stop>
                <div class="walletTypeTxt">
                  {{ isMultisig(item.address) ? $t('Public_account') : '' }}
                </div>
                <div class="options">
                  <span class="mosaics">
                    <Icon type="logo-buffer" />
                    <NumberFormatting
                      :number-of-formatting="item.numberOfMosaics
                        ? formatNumber(item.numberOfMosaics ) : 0"
                    />
                  </span>
                  <span class="delete" @click="deleteWallet(item)">
                    <Icon type="md-trash" />
                  </span>
                </div>
              </div>
            </i-col>
          </Row>
        </div>
      </div>
    </div>

    <div class="walletMethod">
      <Row>
        <i-col span="12">
          <div class="createBtn pointer" @click="showWalletAdd = true">
            {{ $t('from_seed') }}
          </div>
        </i-col>
        <i-col span="12">
          <div class="importBtn pointer" @click="$emit('toImport')">
            {{ $t('from_privatekey') }}
          </div>
        </i-col>
      </Row>
    </div>

    <TheWalletAdd
      v-if="showWalletAdd"
      :visible="showWalletAdd"
      @close="showWalletAdd = false"
    />

    <MnemonicDialog
      v-if="showMnemonicDialog"
      :show-mnemonic-dialog="showMnemonicDialog"
      @closeMnemonicDialog="showMnemonicDialog = false"
    />

    <TheWalletDelete
      v-if="showDeleteDialog"
      :show-check-p-w-dialog="showDeleteDialog"
      :wallet-to-delete="walletToDelete"
      @closeCheckPWDialog="showDeleteDialog = false"
      @on-cancel="showDeleteDialog = false"
    />
  </div>
</template>

<script lang="ts">
import './WalletSwitch.less'
import {WalletSwitchTs} from '@/views/wallet/wallet-switch/WalletSwitchTs.ts'

export default class WalletSwitch extends WalletSwitchTs {
}
</script>

<style scoped>
</style>
