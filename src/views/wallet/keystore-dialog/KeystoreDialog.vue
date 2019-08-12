<template>
  <div class="keystoreDialogWrap">
    <Modal
            v-model="show"
            class-name="vertical-center-modal"
            :footer-hide="true"
            :width="1000"
            :transfer="false"
            @on-cancel="keystoreDialogCancel">
      <div slot="header" class="keystoreDialogHeader">
        <span class="title">{{$t('export')}} Keystore</span>
      </div>
      <div class="keystoreDialogBody">
        <div class="steps" v-if="stepIndex != 4">
          <span :class="['stepItem',stepIndex == 0?'active':'']">{{$t('input_password')}}</span>
          <span :class="['stepItem',stepIndex == 1?'active':'']">{{$t('backup_prompt')}}</span>
          <span :class="['stepItem',stepIndex == 2||stepIndex == 3?'active':'']">{{$t('backup')}} Keystore</span>
        </div>
        <div class="stepItem1" v-if="stepIndex == 0">
          <Form :model="wallet">
            <FormItem>
              <Input v-model="wallet.password" required :placeholder="$t('please_enter_your_wallet_password')"></Input>
            </FormItem>
            <FormItem>
              <Button type="success" class="disabled" @click="exportKeystore">{{$t('next')}}
                <Icon type="ios-arrow-round-forward"/>
              </Button>
            </FormItem>
          </Form>
        </div>
        <div class="stepItem2" v-if="stepIndex == 1">
          <div class="step2Txt">
            <Row>
              <Col span="8">
                <div class="imgDiv clear">
                  <div class="step2Img">
                    <img src="@/common/img/wallet/Step2Img.png">
                  </div>
                </div>
              </Col>
              <Col span="16">
                <div class="step2Remind">
                  <p class="tit">{{$t('obtaining_a_Keystore_password_is_equal_to_owning_a_wallet_asset')}}</p>
                  <div class="ul1">
                    <p class="ul1Tit"><span class="point"></span> {{$t('backup')}}Keystore</p>
                    <p class="ul1Txt">
                      {{$t('Please_back_up_the_Keystore_properly_If_your_phone_is_lost_stolen_or_damaged')}}</p>
                  </div>
                  <div class="ul2">
                    <p class="ul2Tit"><span class="point"></span> {{$t('offline_storage')}}</p>
                    <p class="ul2Txt">{{$t('keep_it_in_a_safe_place_on_the_isolated_network')}}</p>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
          <Button type="success" @click="exportKeystore">{{$t('next')}}
            <Icon type="ios-arrow-round-forward"/>
          </Button>
        </div>
        <div class="stepItem3" v-if="stepIndex == 2">
          <Row>
            <Col span="15">
              <div class="keystoreCode">
                {"crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"5eb58323f39467d9a4b7c14b76fb2154"},"ciphertext":"571cba91c56605a5ac115918be84b454333ccb600310a0bf3dec25ff778e04b9","kdf":"pbkdf2","kdfparams":{"c":10240,"dklen":32,"prf":"hmac-sha256","salt":"a417c49dbeb3bbec79cfbf3cda545e47b4ce150f4e32b7d4c3de34b4c9b4a496"},"mac":"ee97c769b3fde908a5e59689de6226107d098e27b0508cde8449143008c1f6c1"},"id":"e6ba80f1-fd2b-407c-9ef6-cec880ce481e","version":3,"address":"d18ad549395b1c03c05ec4375ed99c9737e51594"}
              </div>
            </Col>
            <Col span="9">
              <p class="tit">{{$t('please_safely_back_up_the_Keystore')}}</p>
              <p class="txt">
                {{$t('do_not_save_to_email_notepad_web_chat_etc_It_is_very_dangerous_Please_don_use_network_transmission')}}</p>
              <p class="tit">{{$t('do_not_use_network_transmission')}}</p>
              <p class="txt">
                {{$t('Do_not_transmit_through_network_tools_once_acquired_by_hackers_will_cause_irreparable_asset_losses_It_is_recommended_that_the_offline_device_be_transmitted_by_scanning_the_QR_code')}}</p>
              <p class="tit">{{$t('password_management_tool_save')}}</p>
              <p class="txt">{{$t('it_is_recommended_to_use_password_management_tool_management')}}</p>
            </Col>
          </Row>
          <Row :gutter="80">
            <Col span="12">
              <Button type="success" @click="copyKeystore">{{$t('copy')}} Keystore</Button>
            </Col>
            <Col span="8">
              <Button type="success" @click="exportKeystore">{{$t('Display_Keystore_QR_code')}}</Button>
            </Col>
          </Row>
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
                <Button type="success" @click="toPrevPage">{{$t('Show_Keystore')}}</Button>
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
    import './KeystoreDialog.less'
    import {Message} from "@/config/index"
    import {createQRCode, copyTxt} from '@/help/help'
    import {Component, Vue, Prop, Watch} from 'vue-property-decorator'

    @Component
    export default class keystoreDialog extends Vue {
        stepIndex = 0
        show = false
        QRCode = ''
        wallet = {
            password: '',
            keystore: ''
        }

        @Prop()
        showKeystoreDialog: boolean

        keystoreDialogCancel() {
            this.$emit('closeKeystoreDialog')
            setTimeout(() => {
                this.stepIndex = 0
            }, 300)
        }

        exportKeystore() {
            // TODO
            return
            switch (this.stepIndex) {
                case 0 :
                    this.stepIndex = 1
                    break;
                case 1 :
                    this.stepIndex = 2
                    break;
                case 2 :
                    this.stepIndex = 3
                    break;
            }
        }

        toPrevPage() {
            this.stepIndex = 2
        }

        copyKeystore() {
            copyTxt(this.wallet.keystore).then((data) => {
                this.$Notice.success({
                    title: this.$t(Message.COPY_SUCCESS) + ''
                });
            })
        }

        saveQRCode() {

        }

        @Watch('showKeystoreDialog')
        onShowKeystoreDialogChange() {
            this.show = this.showKeystoreDialog
        }

        created() {
            createQRCode('TCTEXC-5TGXD7-OQCHBB-MNU3LS-2GFCB4-2KD75D-5VCN').then((data: { url }) => {
                this.QRCode = data.url
            })
        }
    }
</script>

<style scoped>

</style>
