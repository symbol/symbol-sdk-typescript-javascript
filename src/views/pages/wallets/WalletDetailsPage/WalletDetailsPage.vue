<template>
  <div class="wallet-detail-outer-container">
    <div class="wallet-detail-inner-container">
      <div class="left-container">
        <div class="wallet-details-grid  mt-3">
          <div class="detail-row text_select">
            <WalletNameDisplay 
              :wallet="currentWallet"
              :editable="true"
            />
          </div>

          <div class="detail-row text_select">
            <ImportanceScoreDisplay :wallet="currentWallet" />
          </div>

          <div class="detail-row text_select">
            <WalletAddressDisplay :wallet="currentWallet" />
          </div>

          <div class="detail-row text_select">
            <WalletPublicKeyDisplay :wallet="currentWallet" />
          </div>

          <div class="detail-row">
            <ProtectedPrivateKeyDisplay :wallet="currentWallet" />
          </div>

          <div class="detail-row text_select">
            <WalletFlagsDisplay :wallet="currentWallet" />
          </div>
        </div>
      </div>
      <div class="right-container">
        <WalletContactQR :wallet="currentWallet" />
      </div>
    </div>

    <div class="wallet-actions-container">
      <WalletLinks :wallet="currentWallet" />
    </div>

    <div class="wallet-actions-container">
      <WalletActions :wallet="currentWallet" />
    </div>
  </div>

  <!-- 

import seedImg from '@/views/resources/img/login/seed.png'
// @ts-ignore
import trezorImg from '@/views/resources/img/login/trezor.png'
// @ts-ignore
import ledgerImg from '@/views/resources/img/login/ledger.png'
{
      image: walletTypeImages.seedImg,
      title: '',
      description: 'Import_Mnemonic_phrase_directly_to_make_an_account',
      route: 'accounts.importAccount.info',
    },
    {
      image: walletTypeImages.trezorImg,
      title: 'Access_Trezor',
      description: 'Access_your_trezor_wallet_to_make_trezor_account',
      route: null,
    },
    {
      image: walletTypeImages.ledgerImg,
      title: 'Access_Ledger',
      description: 'Access_your_ledger_wallet_to_make_ledge_account',
      route: null,
    },

    <div ref="accountFn" class="accountFn radius">
      <div class="accountFnNav">
        <ul class="navList clear">
          <li :class="[ 'left',functionShowList[1] ? 'active' : '' ] " @click="showFunctionIndex(1)">
            <img src="@/common/img/wallet/wallet-detail/walletHarvesting.png">
            {{ $t('Harvesting') }}
          </li>
          <li :class="[ 'left',functionShowList[2] ? 'active' : '','other' ] ">
            <img src="@/common/img/wallet/wallet-detail/WalletDetailsPageFilter.png">
            {{ $t('Filter_management') }}
          </li>
          <li :class="[ 'left',functionShowList[3] ? 'active' : '','other' ] ">
            <img src="@/common/img/wallet/wallet-detail/WalletDetailsPageMetaData.png">
            {{ $t('meta_data') }}
          </li>
        </ul>
      </div>
      <WalletHarvesting v-if="functionShowList[1]" />
    </div>
    -->
<!--
    <PrivatekeyDialog
      v-if="showPrivatekeyDialog"
      :show-privatekey-dialog="showPrivatekeyDialog"
      @closePrivatekeyDialog="showPrivatekeyDialog = false"
    />
    <KeystoreDialog
      v-if="showKeystoreDialog"
      :show-keystore-dialog="showKeystoreDialog"
      @closeKeystoreDialog="showKeystoreDialog = false"
    />
    <Alias
      v-if="showBindDialog"
      :visible="showBindDialog"
      :bind="bind"
      :from-namespace="fromNamespace"
      :mosaic="null"
      :namespace="activeNamespace"
      :address="getAddress"
      @close="showBindDialog = false"
    />
    <TheWalletUpdate
      :show-update-dialog="showUpdateDialog"
      :wallet-to-update="wallet"
      @closeUpdateDialog="showUpdateDialog = false"
      @on-cancel="showUpdateDialog = false"
    />
-->
</template>

<script lang="ts">
import {WalletDetailsPageTs} from './WalletDetailsPageTs'
export default class WalletDetailsPage extends WalletDetailsPageTs {}
</script>

<style lang="less">
@import './WalletDetailsPage.less';
</style>
