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
<!--            <p>-->
<!--              <span class="tit" v-if="wallet&&wallet.path">{{$t('path')}}</span>-->
<!--              <span>-->
<!--                {{wallet.path}}-->
<!--              </span>-->
<!--            </p>-->
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
              <span class="tit">{{$t('alias')}}</span>
              <!--              <span class=" alias_delete pointer"></span>-->
              <span class="  alias_add pointer" @click="isShowBindDialog=true"></span>

              <span class="walletPublicKey">{{getSelfAlias.join(',')||'-'}}</span>
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
        <!--TODO -->
        <div class="other un_click left" @click="">
          <i><img src="@/common/img/wallet/wallet-detail/walletDetailsFilter.png"></i>
          <span>{{$t('Filter_management')}}</span>
        </div>

        <div class="other un_click left" @click="">
          <i><img src="@/common/img/wallet/wallet-detail/walletDetailsMetaData.png"></i>
          <span>{{$t('meta_data')}}</span>
        </div>
      </div>
    </div>
    <div class="accountFn radius" ref="accountFn">
      <div class="accountFnNav">
        <ul class="navList clear">
          <li class="left" @click="showFunctionIndex(0)">
            {{$t('contact_list')}}
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
                    @closeMnemonicDialog="closeMnemonicDialog"/>
    <PrivatekeyDialog :showPrivatekeyDialog="showPrivatekeyDialog"
                      @closePrivatekeyDialog="closePrivatekeyDialog"/>
    <KeystoreDialog :showKeystoreDialog="showKeystoreDialog"
                    @closeKeystoreDialog="closeKeystoreDialog"/>
    <TheBindForm :isShowBindDialog='isShowBindDialog'
                 @closeBindDialog="closeBindDialog"/>
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
