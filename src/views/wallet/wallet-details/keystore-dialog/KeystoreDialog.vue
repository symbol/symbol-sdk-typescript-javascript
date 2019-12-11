<template>
  <div class="keystoreDialogWrap">
    <Modal v-model="show"
           class-name="vertical-center-modal"
           :footer-hide="true"
           :width="1000"
           :transfer="false"
           @on-cancel="$emit('closeKeystoreDialog')"
    >
      <div slot="header" class="keystoreDialogHeader">
        <span class="title">{{$t('export')}} Keystore</span>
      </div>
      <div class="keystoreDialogBody">
        <div class="steps" v-if="stepIndex != 4">
          <span :class="['stepItem',stepIndex == 0?'active':'']">{{$t('input_password')}}</span>
          <span :class="['stepItem',stepIndex == 1?'active':'']">{{$t('backup_prompt')}}</span>
          <span :class="['stepItem',stepIndex == 2||stepIndex == 3?'active':'']"
          >{{$t('backup')}} Keystore</span>
        </div>

        <div class="stepItem1" v-if="stepIndex == 0">
          <form action="submit" onsubmit="event.preventDefault()" @keyup.enter="exportKeystore">
            <Input v-focus
                   v-model.lazy="password"
                   type="password"
                   v-validate="validation.walletPassword"
                   data-vv-name="password"
                   :data-vv-as="$t('password')"
                   :placeholder="$t('please_enter_your_wallet_password')"
            />
            <input v-show="false" v-model="wallet" v-validate disabled data-vv-name="wallet"/>
            <Button type="success" class="button_arrow" @click="exportKeystore">
              {{$t('next')}}
              <Icon type="ios-arrow-forward"/>
            </Button>
          </form>
        </div>

        <div class="stepItem2" v-if="stepIndex == 1" @keyup.enter.native="exportKeystore">
          <div class="step2Txt">
            <Row>
              <Col span="8">
                <div class="imgDiv clear">
                  <div class="step2Img">
                    <img src="@/common/img/wallet/Step2Img.png"/>
                  </div>
                </div>
              </Col>
              <Col span="16">
                <div class="step2Remind">
                  <p
                          class="tit"
                  >{{$t('obtaining_a_Keystore_password_is_equal_to_owning_a_wallet_asset')}}</p>
                  <div class="ul1">
                    <p class="ul1Tit">
                      <span class="point"></span>
                      {{$t('backup')}}Keystore
                    </p>
                    <p
                            class="ul1Txt"
                    >{{$t('Please_back_up_the_Keystore_properly_If_your_phone_is_lost_stolen_or_damaged')}}</p>
                  </div>
                  <div class="ul2">
                    <p class="ul2Tit">
                      <span class="point"></span>
                      {{$t('offline_storage')}}
                    </p>
                    <p class="ul2Txt">{{$t('keep_it_in_a_safe_place_on_the_isolated_network')}}</p>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
          <Button type="success" v-focus class="button_arrow" @click="exportKeystore">
            {{$t('next')}}
            <Icon type="ios-arrow-forward"/>
          </Button>
        </div>

        <div class="stepItem3" v-if="stepIndex == 2">
          <Row>
            <Col span="15">
              <div class="keystoreCode">{{keystoreText}}</div>
            </Col>
            <Col span="9">
              <p class="tit">{{$t('please_safely_back_up_the_Keystore')}}</p>
              <p
                      class="txt"
              >
                {{$t('do_not_save_to_email_notepad_web_chat_etc_It_is_very_dangerous_Please_don_use_network_transmission')}}</p>
              <p class="tit">{{$t('do_not_use_network_transmission')}}</p>
              <p
                      class="txt"
              >
                {{$t('Do_not_transmit_through_network_tools_once_acquired_by_hackers_will_cause_irreparable_asset_losses_It_is_recommended_that_the_offline_device_be_transmitted_by_scanning_the_QR_code')}}</p>
              <p class="tit">{{$t('password_management_tool_save')}}</p>
              <p class="txt">{{$t('it_is_recommended_to_use_password_management_tool_management')}}</p>
              <Button
                      type="success"
                      class="button_arrow"
                      @click="copyKeystore"
              >{{$t('copy')}} Keystore
              </Button>
            </Col>
          </Row>
        </div>

        <div class="stepItem4" v-if="stepIndex == 3">
          <div class="QRCodeImg">
            <img :src="QRCode"/>
            <div class="imgBorder"></div>
          </div>
          <div class="btns">
            <Row :gutter="80">
              <Col span="7">&nbsp;</Col>
              <Col span="5">
                <Button type="success" @click="stepIndex = 2">{{$t('Show_Keystore')}}</Button>
              </Col>
              <Col span="5">
                <Button type="success">{{$t('Download')}}</Button>
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
    import "./KeystoreDialog.less";
    //@ts-ignore
    import {KeystoreDialogTs} from "@/views/wallet/wallet-details/keystore-dialog/KeystoreDialogTs.ts";

    export default class KeystoreDialog extends KeystoreDialogTs {
    }
</script>

<style scoped>
</style>
