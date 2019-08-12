<template>
  <div class="walletDetailsWrap" ref="walletDetailsWrap">
    <div class="Information radius">
      <Row>
        <Col span="18">
          <h6>{{$t('Basic_information')}}</h6>
          <div class="walletInfo">
            <p>
              <span class="tit">{{$t('Wallet_type')}}</span>
              <span class="walletType">{{getWallet.isMultisig ? $t('Public_account'):$t('Private_account')}}</span>
            </p>
            <p>
              <span class="tit">{{$t('Wallet_name')}}</span>
              <span class="walletName">{{getWallet.name}}</span>
              <!--              <i class="updateWalletName"><img src="@/common/img/wallet/editIcon.png"></i>-->
            </p>
            <p>
              <span class="tit">{{$t('Wallet_address')}}</span>
              <span class="walletAddress">{{getWallet.address}}</span>
              <i class="copyIcon" @click="copy(getWallet.address)"><img
                      src="@/common/img/wallet/copyIcon.png"></i>
            </p>
            <p>
              <span class="tit">{{$t('publickey')}}</span>
              <span class="walletPublicKey">{{getWallet.publicKey}}</span>
              <i class="copyIcon" @click="copy(getWallet.publicKey)"><img
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
          <li :class="['left',functionShowList[1]?'active':''] " @click="showFunctionIndex(1)">
            {{$t('Filter_management')}}
          </li>
          <!--          <li class="left">{{$t('Subaddress_management')}}</li>-->
          <li :class="['left',functionShowList[2]?'active':''] " @click="showFunctionIndex(2)">
            {{$t('Modify_the_private_key_wallet_password')}}
          </li>
        </ul>
      </div>
      <WalletAlias v-if="functionShowList[0]"></WalletAlias>
      <WalletFilter v-if="functionShowList[1]"></WalletFilter>
      <WalletUpdatePassword v-if="functionShowList[2]"></WalletUpdatePassword>
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
    import {createQRCode, copyTxt} from '@/help/help'
    import {Component, Vue, Watch} from 'vue-property-decorator'
    import WalletAlias from './wallet-function/wallet-alias/WalletAlias.vue'
    import WalletFilter from './wallet-function/wallet-filter/WalletFilter.vue'
    import KeystoreDialog from '@/views/wallet/keystore-dialog/KeystoreDialog.vue'
    import MnemonicDialog from '@/views/wallet/mnemonic-dialog/MnemonicDialog.vue'
    import PrivatekeyDialog from '@/views/wallet/privatekey-dialog/PrivatekeyDialog.vue'
    import WalletUpdatePassword from './wallet-function/wallet-update-password/WalletUpdatePassword.vue'

    @Component({
        components: {
            MnemonicDialog,
            PrivatekeyDialog,
            KeystoreDialog,
            WalletAlias,
            WalletFilter,
            WalletUpdatePassword
        },
    })
    export default class WalletDetails extends Vue {
        aliasList = []
        QRCode: string = ''
        showMnemonicDialog: boolean = false
        showKeystoreDialog: boolean = false
        showPrivatekeyDialog: boolean = false
        functionShowList = [true, false, false]

        get getWallet() {
            return this.$store.state.account.wallet
        }

        get getAddress() {
            return this.getWallet.address
        }

        showFunctionIndex(index) {
            this.functionShowList = [false, false, false]
            this.functionShowList[index] = true
        }

        changeMnemonicDialog() {
            if (!this.getWallet['mnemonicEnCodeObj']['ciphertext']) {
                this.$Notice.warning({
                    title: this.$t('no_mnemonic') + ''
                })
                return
            }
            this.showMnemonicDialog = true
        }

        closeMnemonicDialog() {
            this.showMnemonicDialog = false
        }

        changePrivatekeyDialog() {
            this.showPrivatekeyDialog = true
        }

        closePrivatekeyDialog() {
            this.showPrivatekeyDialog = false
        }

        changeKeystoreDialog() {
            this.showKeystoreDialog = true
        }

        closeKeystoreDialog() {
            this.showKeystoreDialog = false
        }

        setQRCode(address) {
            createQRCode(address).then((data:{url}) => {
                this.QRCode = data.url
            })
        }

        copy(txt) {
            copyTxt(txt).then(() => {
                this.$Notice.success({
                    title: this['$t']('successful_copy') + ''
                });
            })
        }

        init() {
            this.setQRCode(this.getAddress)
        }

        @Watch('getAddress')
        onGetAddressChange() {
            this.init()
        }

        created() {
            this.init()
        }
    }
</script>

<style scoped lang="less">
  @import "WalletDetails.less";
</style>
