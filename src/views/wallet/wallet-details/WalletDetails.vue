<template>
  <div class="walletDetailsWrap" ref="walletDetailsWrap">
    <div class="Information radius">
      <Row>
        <Col span="18">
          <h6>{{$t('Basic_information')}}</h6>
          <div v-if="wallet" class="walletInfo">
            <p>
              <span class="tit">{{$t('Wallet_type')}}</span>
              <span class="walletType" v-if="wallet">
                {{isMultisig ? $t('Public_account'):$t('Private_account')}}
              </span>
            </p>
            <p>
              <span class="tit" v-if="wallet&&wallet.path">{{$t('path')}}</span>
              <span>
                {{wallet.path}}
              </span>
            </p>
            <p>
              <span class="tit">{{$t('Wallet_name')}}</span>
              <span class="walletName" v-if="wallet">{{wallet.name}}</span>
            </p>
            <p>
              <span class="tit">{{$t('Wallet_address')}}</span>
              <span class="walletAddress">{{wallet.address}}</span>
              <i class="copyIcon" @click="copy(wallet.address)"><img
                      src="@/common/img/wallet/copyIcon.png"></i>
            </p>
            <p>
              <span class="tit">{{$t('publickey')}}</span>
              <span class="walletPublicKey">{{wallet.publicKey}}</span>
              <i class="copyIcon" @click="copy(wallet.publicKey)"><img
                      src="@/common/img/wallet/copyIcon.png"></i>
            </p>
          </div>
        </Col>
        <Col span="6">
          <div class="addressQRCode">
            <img :src="QRCode">
          </div>
          <p class="codeTit">{{$t('Address_QR_code')}}</p>
        </Col>
      </Row>
    </div>
    <div class="fnAndBackup radius">
      <h6>{{$t('Function_and_backup')}}</h6>
      <div class="backupDiv clear">
        <div class="Mnemonic left" @click="changeMnemonicDialog">
          <i><img src="@/common/img/wallet/auxiliaries.png"></i>
          <span>{{$t('Export_mnemonic')}}</span>
        </div>
        <div class="privateKey left" @click="changePrivatekeyDialog">
          <i><img src="@/common/img/wallet/privatekey.png"></i>
          <span>{{$t('Export_private_key')}}</span>
        </div>
        <div class="Keystore left" @click="changeKeystoreDialog">
          <i><img src="@/common/img/wallet/keystore.png"></i>
          <span>{{$t('Export_Keystore')}}</span>
        </div>
      </div>
    </div>
    <div class="accountFn radius" ref="accountFn">
      <div class="accountFnNav">
        <ul class="navList clear">
          <li :class="['left',functionShowList[0]?'active':''] " @click="showFunctionIndex(0)">
            {{$t('Alias_settings')}}
          </li>
          <!--restrict-->
          <!--          <li :class="['left',functionShowList[1]?'active':''] " @click="showFunctionIndex(1)">-->
          <!--            {{$t('Filter_management')}}-->
          <!--          </li>-->
        </ul>
      </div>
      <WalletAlias v-if="functionShowList[0]"></WalletAlias>
      <!--      <WalletFilter v-if="functionShowList[1]"></WalletFilter>-->
    </div>
    <MnemonicDialog :showMnemonicDialog="showMnemonicDialog"
                    @closeMnemonicDialog="closeMnemonicDialog"></MnemonicDialog>
    <PrivatekeyDialog :showPrivatekeyDialog="showPrivatekeyDialog"
                      @closePrivatekeyDialog="closePrivatekeyDialog"></PrivatekeyDialog>
    <KeystoreDialog :showKeystoreDialog="showKeystoreDialog"
                    @closeKeystoreDialog="closeKeystoreDialog"></KeystoreDialog>
  </div>
</template>

<script lang="ts">
    //@ts-ignore
    import {WalletDetailsTs} from '@/views/wallet/wallet-details/WalletDetailsTs.ts'

    export default class WalletDetails extends WalletDetailsTs {

    }
</script>

<style scoped lang="less">
  @import "WalletDetails.less";
</style>
