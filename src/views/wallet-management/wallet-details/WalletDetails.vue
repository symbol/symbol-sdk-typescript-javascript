<template>
  <div class="walletDetailsWrap" ref="walletDetailsWrap">
    <div class="Information">
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
              <i class="updateWalletName"><img src="@/assets/images/wallet-management/editIcon.png"></i>
            </p>
            <p>
              <span class="tit">{{$t('Wallet_address')}}</span>
              <span class="walletAddress">{{getWallet.address}}</span>
              <i class="copyIcon" @click="copy(getWallet.address)"><img
                      src="@/assets/images/wallet-management/copyIcon.png"></i>
            </p>
            <p>
              <span class="tit">{{$t('publickey')}}</span>
              <span class="walletPublicKey">{{getWallet.publicKey}}</span>
              <i class="copyIcon" @click="copy(getWallet.publicKey)"><img
                      src="@/assets/images/wallet-management/copyIcon.png"></i>
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
    <div class="fnAndBackup">
      <h6>{{$t('Function_and_backup')}}</h6>
      <div class="backupDiv clear">
        <div class="Mnemonic left" @click="changeMnemonicDialog">
          <i><img src="@/assets/images/wallet-management/auxiliaries.png"></i>
          <span>{{$t('Export_mnemonic')}}</span>
        </div>
        <div class="privateKey left" @click="changePrivatekeyDialog">
          <i><img src="@/assets/images/wallet-management/privatekey.png"></i>
          <span>{{$t('Export_private_key')}}</span>
        </div>
        <div class="Keystore left" @click="changeKeystoreDialog">
          <i><img src="@/assets/images/wallet-management/keystore.png"></i>
          <span>{{$t('Export_Keystore')}}</span>
        </div>
      </div>
    </div>
    <div class="accountFn" ref="accountFn">
      <div class="accountFnNav">
        <ul class="navList clear">
          <li class="active left">{{$t('Alias_settings')}}</li>
          <li class="left">{{$t('Filter_management')}}</li>
          <li class="left">{{$t('Subaddress_management')}}</li>
          <li class="left">{{$t('Modify_the_private_key_wallet_password')}}</li>
        </ul>
      </div>
      <div class="aliasTable">
        <div class="tableTit">
          <Row>
            <Col span="7">{{$t('namespace')}}</Col>
            <Col span="6">{{$t('validity_period')}}</Col>
            <Col span="4">{{$t('status')}}</Col>
            <Col span="7">{{$t('operating')}}</Col>
          </Row>
        </div>
        <div class="tableCell" v-for="(item,index) in aliasList" :key="index" v-if="aliasList.length>0">
          <Row>
            <Col span="7">girme</Col>
            <Col span="6">2019-11-05</Col>
            <Col span="4">{{$t('binded')}}</Col>
            <Col span="7">
              <div class="tableFn">
                <span class="bind">{{$t('bind')}}</span>
                <span class="unbind active">{{$t('unbind')}}</span>
                <span class="updateTime">{{$t('update')}}</span>
              </div>
            </Col>
          </Row>
        </div>
        <div class="noData" v-if="aliasList.length<=0">
          <i><img src="@/assets/images/wallet-management/no_data.png"></i>
          <p>{{$t('not_yet_open')}}</p>
        </div>
      </div>
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
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import {createQRCode, copyTxt} from '@/utils/tools'
    import MnemonicDialog from '@/views/wallet-management/mnemonic-dialog/MnemonicDialog.vue'
    import PrivatekeyDialog from '@/views/wallet-management/privatekey-dialog/PrivatekeyDialog.vue'
    import KeystoreDialog from '@/views/wallet-management/keystore-dialog/KeystoreDialog.vue'
    import './WalletDetails.less';

    @Component({
        components: {
            MnemonicDialog,
            PrivatekeyDialog,
            KeystoreDialog
        },
    })
    export default class WalletDetails extends Vue {
        showMnemonicDialog: boolean = false
        showPrivatekeyDialog: boolean = false
        showKeystoreDialog: boolean = false
        QRCode: string = ''
        aliasList = []

        get getWallet() {
            return this.$store.state.account.wallet
        }

        get getAddress() {
            return this.getWallet.address
        }

        changeMnemonicDialog() {
            if (!this.getWallet['mnemonicEnCodeObj']['ciphertext']) {
                this.$Message.warning(this.$t('no_mnemonic'));
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
            createQRCode(address).then((data) => {
                this.QRCode = data.url
            })
        }

        copy(txt) {
            copyTxt(txt).then(() => {
                this.$Message.success(this['$t']('successful_copy'));
            })
        }

        onresize() {
            const height = this.$refs['walletDetailsWrap']['clientHeight'] - (this.$refs['accountFn']['offsetTop'] - this.$refs['walletDetailsWrap']['offsetTop'])
            this.$refs['accountFn']['style']['height'] = height + 'px'
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

        mounted() {
            const that = this
            window.addEventListener('resize', function () {
                if (that.$refs['walletDetailsWrap'] && that.$route.name == 'walletDetails') {
                    that.onresize()
                }
            })
            that.onresize()
        }
    }
</script>

<style scoped>

</style>
