<template>
  <div class="wallet-detail-outer-container">
    <div class="wallet-detail-inner-container">
      <div class="left-container">
        <span class="left-container-title">{{ $t('Basic_information') }}</span>
        <div class="wallet-details-grid  mt-3">
          <div class="detail-row">
            <WalletNameDisplay 
              :wallet="wallet"
              :editable="true"
              @update="hasNameForm = true"
            />
          </div>

          <div class="detail-row">
            <ImportanceScoreDisplay :wallet="wallet" />
          </div>

          <div class="detail-double-row">
            <WalletDetailsDisplay :wallet="wallet" />
          </div>

          <div class="detail-row">
            <ProtectedPrivateKeyDisplay :wallet="wallet" />
          </div>
        <!--
            <p>
              <span v-if="isMultisig || isCosignatory" class="tit">{{ $t('Wallet_type') }}</span>
              <span v-if="isMultisig || isCosignatory" class="walletType" @click="$router.push({name: 'multisig.manage'})">
                <Icon v-if="isMultisig" type="md-lock" />
                <Icon v-if="isCosignatory" type="md-contacts" />
              </span>
            </p>
            -->
        </div>
      </div>
      <div class="right-container">
        <WalletContactQR :wallet="wallet" />
      </div>
    </div>
  </div>

  <!-- 
    <div ref="accountFn" class="accountFn radius">
      <div class="accountFnNav">
        <ul class="navList clear">
          <li :class="[ 'left',functionShowList[1] ? 'active' : '' ] " @click="showFunctionIndex(1)">
            <img src="@/common/img/wallet/wallet-detail/walletHarvesting.png">
            {{ $t('Harvesting') }}
          </li>
          <li :class="[ 'left',functionShowList[2] ? 'active' : '','other' ] ">
            <img src="@/common/img/wallet/wallet-detail/walletDetailsFilter.png">
            {{ $t('Filter_management') }}
          </li>
          <li :class="[ 'left',functionShowList[3] ? 'active' : '','other' ] ">
            <img src="@/common/img/wallet/wallet-detail/walletDetailsMetaData.png">
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
import {WalletDetailsTs} from './WalletDetailsTs'
export default class WalletDetails extends WalletDetailsTs {}
</script>

<style lang="less" scoped>
@import './WalletDetails.less';
</style>
