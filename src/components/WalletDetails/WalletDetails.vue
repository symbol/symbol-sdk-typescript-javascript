<template>
  <div ref="walletDetailsWrap" class="walletDetailsWrap">
    <div class="Information radius">
      <Row>
        <i-col span="18">
          <h6>{{ $t('Basic_information') }}</h6>
          <div v-if="wallet" class="walletInfo">

            <WalletNameDisplay 
                :wallet="wallet"
                :editable="true"
                @update="hasNameForm = true" />

            <ProtectedPrivateKeyDisplay :wallet="wallet" />

            <!--
            <p>
              <span v-if="isMultisig || isCosignatory" class="tit">{{ $t('Wallet_type') }}</span>
              <span v-if="isMultisig || isCosignatory" class="walletType" @click="$router.push({name: 'multisig.manage'})">
                <Icon v-if="isMultisig" type="md-lock" />
                <Icon v-if="isCosignatory" type="md-contacts" />
              </span>
            </p>
            -->

            <ImportanceScoreDisplay :wallet="wallet" />

            <WalletDetailsDisplay :wallet="wallet" />

          </div>
        </i-col>
        <i-col span="6">

          <WalletContactQR :wallet="wallet" />

        </i-col>
      </Row>
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
  </div>
</template>

<script lang="ts">
import {WalletDetailsTs} from './WalletDetailsTs'
import './WalletDetails.less'

export default class WalletDetails extends WalletDetailsTs {}
</script>