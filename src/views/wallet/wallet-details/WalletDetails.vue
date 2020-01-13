<template>
  <div ref="walletDetailsWrap" class="walletDetailsWrap">
    <div class="Information radius">
      <Row>
        <i-col span="18">
          <h6>{{ $t('Basic_information') }}</h6>
          <div v-if="wallet" class="walletInfo">
            <p>
              <span class="tit">{{ $t('Wallet_name') }}</span>
              <span v-if="wallet" class="walletName">{{ wallet.name }}</span>
              <span class="edit-wallet-name" @click.stop="showUpdateDialog = true"><Icon
                type="md-create"
              /></span>
            </p>

            <p>
              <span class="tit">{{ $t('privatekey') }}</span>
              <span v-if="wallet" class="walletName">*******************************************************</span>
              <span class="edit-wallet-name" @click.stop="changePrivatekeyDialog">
                <Icon type="md-eye" />
              </span>
            </p>

            <p>
              <span v-if="isMultisig || isCosignatory" class="tit">{{ $t('Wallet_type') }}</span>
              <span v-if="isMultisig || isCosignatory" class="walletType" @click="$router.push('multisigManagement')">
                <Icon v-if="isMultisig" type="md-lock" />
                <Icon v-if="isCosignatory" type="md-contacts" />
              </span>
              <span class="tit">{{ $t('importance') }}</span>
              <span v-if="wallet">
                <span v-if="importance !== '0'">
                  {{ importance.substring(0,1) + '.' + importance.substring(1) }}*10
                  <sup>-{{ (importance + '').length - 1 }}</sup>
                </span>
                <span v-else>0</span>
              </span>
            </p>

            <p>
              <span class="tit">{{ $t('Wallet_address') }}</span>
              <span class="walletAddress">{{ wallet.address }}</span>
              <i class="copyIcon" @click="copy(wallet.address)"><img src="@/common/img/wallet/copyIcon.png"></i>
            </p>

            <p>
              <span class="tit">{{ $t('Wallet_public_key') }}</span>
              <span class="walletPublicKey">{{ wallet.publicKey }}</span>
              <i class="copyIcon" @click="copy(wallet.publicKey)"><img
                src="@/common/img/wallet/copyIcon.png"
              ></i>
            </p>

            <p class="link_text">
              <span class="tit">{{ $t('Aliases') }}</span>
              <span class="  alias_add pointer" @click="bindNamespace()" />
              <span class="walletPublicKey">
                <span v-if="!selfAliases.length">-</span>
                <div v-if="selfAliases.length">
                  <span v-for="(alias, index) in selfAliases" :key="index">
                    <span class="aliasLink">
                      <a @click="unbindNamespace(alias)">{{ alias.name }}</a>
                      {{ index < selfAliases.length - 1 ? ' | ' : '' }}
                    </span>
                  </span>
                </div>
              </span>
            </p>
          </div>
        </i-col>
        <i-col span="6">
          <div class="addressQRCode">
            <img :src="qrCode$">
          </div>
          <p class="codeTit">
            {{ $t('Address_QR_code') }}
          </p>
        </i-col>
      </Row>
    </div>
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
  </div>
</template>

<script lang="ts">
import {WalletDetailsTs} from '@/views/wallet/wallet-details/WalletDetailsTs.ts'
import './WalletDetails.less'

export default class WalletDetails extends WalletDetailsTs {

}
</script>

<style scoped lang="less">
</style>
