<template>
  <div class="privatekeyDialogWrap" >
    <Modal
            v-model="show"
            class-name="vertical-center-modal"
            :footer-hide="true"
            :width="1000"
            :transfer="false"
            @on-cancel="$emit('closePrivatekeyDialog')">
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
          <Form :model="wallet" @keyup.enter.native="exportPrivatekey" onsubmit="event.preventDefault()">
            <FormItem >
              <Input v-model="wallet.password"
                     type="password"
                     :autofocus="true"
                     required
                     :placeholder="$t('please_enter_your_wallet_password')"></Input>
            </FormItem>
            <input v-if="false" type="text">
            <FormItem>
              <Button type="success" class="button_arrow" @click="exportPrivatekey">
                {{$t('next')}}
                <Icon type="ios-arrow-round-forward"/>
              </Button>
            </FormItem>
            <input v-if="false" type="text">
          </Form>
        </div>

        <div class="stepItem2" v-if="stepIndex == 1">
          <div class="step2Txt" @keyup.enter.native="exportPrivatekey">
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
          <Button v-focus type="success" class="button_arrow" @click="exportPrivatekey">{{$t('next')}}
            <Icon type="ios-arrow-round-forward"/>
          </Button>
        </div>

        <div class="stepItem3" v-if="stepIndex == 2" @keyup.enter.native="exportPrivatekey">
          <p class="tit">{{$t('please_accurately_copy_the_secure_backup_private_key')}}</p>
          <p class="txt">
            {{$t('do_not_save_to_email_notepad_web_chat_etc_It_is_very_dangerous_Please_don_use_network_transmission')}}</p>
          <p class="tit">{{$t('do_not_use_network_transmission')}}</p>
          <p class="txt">
            {{$t('Do_not_transmit_through_network_tools_once_acquired_by_hackers_will_cause_irreparable_asset_losses_It_is_recommended_that_the_offline_device_be_transmitted_by_scanning_the_QR_code')}}</p>
          <p class="tit">{{$t('password_management_tool_save')}}</p>
          <p class="txt">{{$t('it_is_recommended_to_use_password_management_tool_management')}}</p>
          <div class="privateKeyCode">{{wallet.privatekey }}</div>
          <div class="buttons_container">
            <Button type="success" class="buttons button_arrow" @click="copyPrivatekey">{{$t('copy_private_key')}}
            </Button>
            <Button type="success" v-focus class="buttons button_arrow" @click="exportPrivatekey">
              {{$t('display_private_key_QR_code')}}
            </Button>
          </div>
        </div>
        <div class="stepItem4" v-if="stepIndex == 3">
          <div class="QRCodeImg">
            <img :src="qrCode$">
          </div>
          <div class="btns">
            <Row :gutter="80">
              <Col span="7">&nbsp;</Col>
              <Col span="5">
                <Button type="success" @click="toPrevPage">{{$t('display_private_key')}}</Button>
              </Col>
              <Col span="5">
                <Button type="success">
                  <a
                          :href="qrCode$"
                          download="qrCode.png"
                  >
                    {{$t('Download')}}
                  </a>
                </Button>
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
    import './PrivatekeyDialog.less'
    //@ts-ignore
    import {PrivatekeyDialogTs} from '@/views/wallet/wallet-details/privatekey-dialog/PrivatekeyDialogTs.ts'

    export default class PrivatekeyDialog extends PrivatekeyDialogTs {

    }
</script>

<style scoped>

</style>
