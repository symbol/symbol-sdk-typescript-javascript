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

              <span class="tit">{{$t('importance')}}</span>
              <span v-if="wallet">
                <span v-if="importance != 0">
                  {{importance.substring(0,1)+'.'+importance.substring(1)}}*10
                  <sup>{{(importance+'').length-1}}</sup>
                </span>
                <span v-else>0</span>
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
              <span class="tit">{{$t('Wallet_public_key')}}</span>
              <span class="walletPublicKey">{{wallet.publicKey}}</span>
              <i class="copyIcon" @click="copy(wallet.publicKey)"><img
                      src="@/common/img/wallet/copyIcon.png"></i>
            </p>
            <p class="link_text">
              <span class="tit">{{$t('alias')}}</span>
              <span class="  alias_add pointer" @click="bindNamespace()"/>
              <span class="walletPublicKey">
                <span v-if='!selfAliases.length'>-</span>
                <div v-if='selfAliases.length'>
                  <span
                          v-for="(alias, index) in selfAliases"
                          :key="index"
                  >
                    <span class="aliasLink">
                      <a
                              @click="unbindNamespace(alias)"
                      >{{alias.name}}</a>
                      {{index < selfAliases.length - 1 ? ' | ' : ''}}
                    </span>
                  </span>
                </div>
              </span>
            </p>
          </div>
        </Col>
        <Col span="6">
          <div class="addressQRCode">
            <img :src="qrCode$">
          </div>
          <p class="codeTit">{{$t('Address_QR_code')}}</p>
        </Col>
      </Row>
    </div>
    <div class="fnAndBackup radius">
      <h6>{{$t('Function_and_backup')}}</h6>
      <div class="backupDiv clear">
        <div class="Mnemonic pointer left" @click="changeMnemonicDialog">
          <i><img src="@/common/img/wallet/auxiliaries.png"></i>
          <span>{{$t('Export_mnemonic')}}</span>
        </div>
        <div class="privateKey pointer left" @click="changePrivatekeyDialog">
          <i><img src="@/common/img/wallet/privatekey.png"></i>
          <span>{{$t('Export_private_key')}}</span>
        </div>
        <div class="Keystore pointer left" @click="changeKeystoreDialog">
          <i><img src="@/common/img/wallet/keystore.png"></i>
          <span>{{$t('Export_Keystore')}}</span>
        </div>
      </div>
    </div>
    <div class="accountFn radius" ref="accountFn">
      <div class="accountFnNav">
        <ul class="navList clear">
          <!--          <li :class="['left',functionShowList[0]?'active':''] " @click="showFunctionIndex(0)">-->
          <!--            <img src="@/common/img/wallet/wallet-detail/walletAddressBook.png">-->
          <!--            {{$t('contact_list')}}-->
          <!--          </li>-->
          <!--restrict-->
          <li :class="['left',functionShowList[1]?'active':''] " @click="showFunctionIndex(1)">
            <img src="@/common/img/wallet/wallet-detail/walletHarvesting.png">
            {{$t('Harvesting')}}
          </li>
          <li :class="['left',functionShowList[2]?'active':'','other'] ">
            <img src="@/common/img/wallet/wallet-detail/walletDetailsFilter.png">
            {{$t('Filter_management')}}
          </li>
          <li :class="['left',functionShowList[3]?'active':'','other'] ">
            <img src="@/common/img/wallet/wallet-detail/walletDetailsMetaData.png">
            {{$t('meta_data')}}
          </li>
        </ul>
      </div>
      <!--      <AddressBook v-if="functionShowList[0]"></AddressBook>-->
      <WalletHarvesting v-if="functionShowList[1]"></WalletHarvesting>
      <!--      <WalletFilter v-if="functionShowList[1]"></WalletFilter>-->
    </div>
    <MnemonicDialog v-if="showMnemonicDialog"
                    :showMnemonicDialog="showMnemonicDialog"
                    @closeMnemonicDialog="closeMnemonicDialog"/>
    <PrivatekeyDialog
            v-if="showPrivatekeyDialog"
            :showPrivatekeyDialog="showPrivatekeyDialog"
            @closePrivatekeyDialog="showPrivatekeyDialog=false"/>
    <KeystoreDialog
            v-if="showKeystoreDialog"
            :showKeystoreDialog="showKeystoreDialog"
            @closeKeystoreDialog="showKeystoreDialog=false"/>
    <Alias
            v-if="showBindDialog"
            :visible='showBindDialog'
            :bind="bind"
            :fromNamespace="fromNamespace"
            :mosaic="null"
            :namespace="activeNamespace"
            :address="getAddress"
            @close="showBindDialog = false"
    />
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
