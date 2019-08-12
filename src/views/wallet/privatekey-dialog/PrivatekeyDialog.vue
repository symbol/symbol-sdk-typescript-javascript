<template>
  <div class="privatekeyDialogWrap">
    <Modal
            v-model="show"
            class-name="vertical-center-modal"
            :footer-hide="true"
            :width="1000"
            :transfer="false"
            @on-cancel="privatekeyDialogCancel">
      <div slot="header" class="privatekeyDialogHeader">
        <span class="title">{{$t('export_private_key')}}</span>
      </div>
      <div class="privatekeyDialogBody">
        <div class="steps" v-if="stepIndex != 4">
          <span :class="['stepItem',stepIndex == 0?'active':'']">{{$t('input_password')}}</span>
          <span :class="['stepItem',stepIndex == 1?'active':'']">{{$t('backup_prompt')}}</span>
          <span :class="['stepItem',stepIndex == 2||stepIndex == 3?'active':'']">{{$t('backup_private_key')}}</span>
        </div>
        <div class="stepItem1" v-if="stepIndex == 0">
          <Form :model="wallet">
            <FormItem>
              <Input v-model="wallet.password" type="password" required
                     :placeholder="$t('please_enter_your_wallet_password')"></Input>
            </FormItem>
            <FormItem>
              <Button type="success" @click="exportPrivatekey">{{$t('next')}}
                <Icon type="ios-arrow-round-forward"/>
              </Button>
            </FormItem>
          </Form>
        </div>
        <div class="stepItem2" v-if="stepIndex == 1">
          <div class="step2Txt">
            <Row>
              <Col span="9">
                <div class="imgDiv">
                  <div class="step2Img">
                    <img src="@/common/img/wallet/Step2Img.png">
                  </div>
                </div>
              </Col>
              <Col span="15">
                <p class="tit">{{$t('Obtaining_a_private_key_equals_ownership_of_the_wallet_asset')}}</p>
                <div class="ul1">
                  <p class="ul1Tit"><span class="point"></span> {{$t('backup_private_key')}}</p>
                  <p class="ul1Txt">{{$t('use_paper_and_pen_to_correctly_copy_the_private_key')}}</p>
                </div>
                <div class="ul2">
                  <p class="ul2Tit"><span class="point"></span> {{$t('offline_storage')}}</p>
                  <p class="ul2Txt">{{$t('keep_it_in_a_safe_place_on_the_isolated_network_private_key')}}</p>
                </div>
              </Col>
            </Row>
          </div>
          <Button type="success" @click="exportPrivatekey">{{$t('next')}}
            <Icon type="ios-arrow-round-forward"/>
          </Button>
        </div>
        <div class="stepItem3" v-if="stepIndex == 2">
          <p class="tit">{{$t('please_accurately_copy_the_secure_backup_private_key')}}</p>
          <p class="txt">
            {{$t('do_not_save_to_email_notepad_web_chat_etc_It_is_very_dangerous_Please_don_use_network_transmission')}}</p>
          <p class="tit">{{$t('do_not_use_network_transmission')}}</p>
          <p class="txt">
            {{$t('Do_not_transmit_through_network_tools_once_acquired_by_hackers_will_cause_irreparable_asset_losses_It_is_recommended_that_the_offline_device_be_transmitted_by_scanning_the_QR_code')}}</p>
          <p class="tit">{{$t('password_management_tool_save')}}</p>
          <p class="txt">{{$t('it_is_recommended_to_use_password_management_tool_management')}}</p>
          <div class="privateKeyCode">{{wallet.privatekey }}</div>
          <Button type="success" @click="exportPrivatekey">{{$t('display_private_key_QR_code')}}</Button>
        </div>
        <div class="stepItem4" v-if="stepIndex == 3">
          <div class="QRCodeImg">
            <img :src="QRCode">
            <div class="imgBorder"></div>
          </div>
          <div class="btns">
            <Row :gutter="80">
              <Col span="7">&nbsp;</Col>
              <Col span="5">
                <Button type="success" @click="toPrevPage">{{$t('display_private_key')}}</Button>
              </Col>
              <Col span="5">
                <Button type="success" @click="saveQRCode">{{$t('copy_QR_code')}}</Button>
              </Col>
              <Col span="7">&nbsp;</Col>
            </Row>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
    import {Crypto} from 'nem2-sdk'
    import './PrivatekeyDialog.less'
    import {createQRCode} from '@/help/help'
    import {walletInterface} from "@/interface/sdkWallet"
    import {Component, Vue, Prop, Watch} from 'vue-property-decorator'

    @Component
    export default class privatekeyDialog extends Vue {
        QRCode = ''
        show = false
        stepIndex = 0
        wallet = {
            password: '',
            privatekey: ''
        }

        @Prop()
        showPrivatekeyDialog: boolean

        get getWallet() {
            return this.$store.state.account.wallet
        }

        privatekeyDialogCancel() {
            this.wallet = {
                password: '',
                privatekey: ''
            }
            this.$emit('closePrivatekeyDialog')
            setTimeout(() => {
                this.stepIndex = 0
            }, 300)
        }

        exportPrivatekey() {
            switch (this.stepIndex) {
                case 0 :
                    if (!this.checkInput()) return
                    let saveData = {
                        ciphertext: this.getWallet.ciphertext,
                        iv: this.getWallet.iv.data ? this.getWallet.iv.data : this.getWallet.iv,
                        key: this.wallet.password
                    }
                    const DeTxt = Crypto.decrypt(saveData)
                    walletInterface.getWallet({
                        name: this.getWallet.name,
                        networkType: this.getWallet.networkType,
                        privateKey: DeTxt.length === 64 ? DeTxt : ''
                    }).then(async (Wallet: any) => {
                        this.stepIndex = 1
                        this.wallet.password = ''
                        this.stepIndex = 1
                        this.wallet.privatekey = DeTxt.toString().toUpperCase()
                    }).catch(() => {
                        this.$Notice.error({
                            title: this.$t('password_error') + ''
                        })
                    })
                    break;
                case 1 :
                    this.createQRCode()
                    this.stepIndex = 2
                    break;
                case 2 :
                    this.stepIndex = 3
                    break;
            }
        }

        checkInput() {
            if (!this.wallet.password || this.wallet.password == '') {
                this.$Notice.error({
                    title: '' + this.$t('please_set_your_wallet_password')
                })
                return false
            }
            return true
        }

        toPrevPage() {
            this.stepIndex = 2
        }

        saveQRCode() {

        }

        createQRCode() {
            createQRCode(this.wallet.privatekey).then((data:{url}) => {
                this.QRCode = data.url
            })
        }

        @Watch('showPrivatekeyDialog')
        onShowPrivatekeyDialogChange() {
            this.show = this.showPrivatekeyDialog
        }
    }
</script>

<style scoped>

</style>
