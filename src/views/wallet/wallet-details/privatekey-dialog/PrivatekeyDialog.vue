<template>
  <div class="privatekeyDialogWrap">
    <Modal
      v-model="show"
      class-name="vertical-center-modal"
      :footer-hide="true"
      :width="1000"
      :transfer="false"
      @on-cancel="$emit('closePrivatekeyDialog')"
    >
      <div slot="header" class="privatekeyDialogHeader">
        <span class="title">{{ $t('export_private_key') }}</span>
      </div>
      <div class="privatekeyDialogBody">
        <div v-if="stepIndex !== 4" class="steps">
          <img :src="threeStepsPictureList[stepIndex]">
          <div class="steps-text-container">
            <span
              v-for="(title,index) in stringOfSteps"
              :key="index"
              :class="[ 'stepItem',stepIndex >= index ? 'before' : 'after' ]"
            >{{ $t(title) }}</span>
          </div>
        </div>
        <div v-if="stepIndex === 0" class="stepItem1">
          <form action="submit" onsubmit="event.preventDefault()" @keyup.enter="exportPrivatekey">
            <Input
              v-model.lazy="password"
              v-focus
              v-validate="validation.walletPassword"
              type="password"
              data-vv-name="password"
              :data-vv-as="$t('password')"
              :placeholder="$t('please_enter_your_wallet_password')"
            />
            <input
              v-show="false" v-model="wallet" v-validate
              disabled data-vv-name="wallet"
            >
            <Button type="success" class="button_arrow" @click="exportPrivatekey">
              {{ $t('next') }}
              <Icon type="ios-arrow-round-forward" />
            </Button>
          </form>
        </div>

        <div v-if="stepIndex === 1" class="stepItem2">
          <div class="step2Txt" @keyup.enter.native="exportPrivatekey">
            <Row>
              <i-col span="9">
                <div class="imgDiv">
                  <div class="step2Img">
                    <img src="@/common/img/wallet/Step2Img.png">
                  </div>
                </div>
              </i-col>
              <i-col span="15">
                <p
                  class="tit"
                >
                  {{ $t('Obtaining_a_private_key_equals_ownership_of_the_wallet_asset') }}
                </p>
                <div class="ul1">
                  <p class="ul1Tit">
                    <span class="point" />
                    {{ $t('backup_private_key') }}
                  </p>
                  <p class="ul1Txt">
                    {{ $t('use_paper_and_pen_to_correctly_copy_the_private_key') }}
                  </p>
                </div>
                <div class="ul2">
                  <p class="ul2Tit">
                    <span class="point" />
                    {{ $t('offline_storage') }}
                  </p>
                  <p
                    class="ul2Txt"
                  >
                    {{ $t('keep_it_in_a_safe_place_on_the_isolated_network_private_key') }}
                  </p>
                </div>
              </i-col>
            </Row>
          </div>
          <Button
            v-focus type="success" class="button_arrow"
            @click="exportPrivatekey"
          >
            {{ $t('next') }}
            <Icon type="ios-arrow-round-forward" />
          </Button>
        </div>

        <div v-if="stepIndex === 2" class="stepItem3" @keyup.enter.native="exportPrivatekey">
          <p class="tit">
            {{ $t('please_accurately_copy_the_secure_backup_private_key') }}
          </p>
          <p
            class="txt"
          >
            {{ $t('do_not_save_to_email_notepad_web_chat_etc') }}
          </p>
          <p class="tit">
            {{ $t('do_not_use_network_transmission') }}
          </p>
          <p
            class="txt"
          >
            {{ $t('Do_not_transmit_through_network_tools_once_acquired_by_hackers') }}
          </p>
          <p class="tit">
            {{ $t('password_management_tool_save') }}
          </p>
          <p class="txt">
            {{ $t('it_is_recommended_to_use_password_management_tool_management') }}
          </p>
          <div class="privateKeyCode">
            {{ privateKey }}
          </div>
          <div class="buttons_container">
            <Button
              type="success"
              class="buttons button_arrow"
              @click="copyPrivatekey"
            >
              {{ $t('copy_private_key') }}
            </Button>
            <Button
              v-focus
              type="success"
              class="buttons button_arrow"
              @click="exportPrivatekey"
            >
              {{ $t('display_private_key_QR_code') }}
            </Button>
          </div>
        </div>
        <div v-if="stepIndex === 3" class="stepItem4">
          <div class="QRCodeImg">
            <img :src="qrCode$">
          </div>
          <div class="buttons_container">
            <Button
              type="success"
              class="buttons button_arrow"
              @click="stepIndex = 2"
            >
              {{ $t('display_private_key') }}
            </Button>
            <Button
              v-focus
              type="success"
              class="buttons button_arrow"
            >
              <a :href="qrCode$" download="qrCode.png">{{ $t('Download') }}</a>
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
import './PrivatekeyDialog.less'
// @ts-ignore
import { PrivatekeyDialogTs } from '@/views/wallet/wallet-details/privatekey-dialog/PrivatekeyDialogTs.ts'

export default class PrivatekeyDialog extends PrivatekeyDialogTs {}
</script>

<style scoped>
</style>
