<template>
  <div class="ModalMnemonicBackupWizardWrap">
    <Modal
      v-model="show"
      class-name="vertical-center-modal"
      :footer-hide="true"
      :width="1000"
      :transfer="false"
      @on-cancel="$emit('closeModalMnemonicBackupWizard')"
    >
      <div slot="header" class="ModalMnemonicBackupWizardHeader">
        <span class="title">{{ $t('export_mnemonic') }}</span>
      </div>
      <div class="ModalMnemonicBackupWizardBody">
        <div v-if="stepIndex !== 4" class="steps">
          <img :src="fourStepsPictureList[stepIndex]">
          <div class="steps-text-container">
            <span
              v-for="(title,index) in stringOfSteps"
              :key="index"
              :class="[ 'stepItem',stepIndex >= index ? 'before' : 'after' ]"
            >{{ $t(title) }}</span>
          </div>
        </div>

        <div v-if="stepIndex === 0" class="stepItem1">
          <form
            class="centered"
            onsubmit="event.preventDefault()"
            @keyup.enter="submit"
          >
            <input
              v-model="cipher"
              v-validate="'required'"
              data-vv-name="cipher"
              style="display:none"
            >
            <ErrorTooltip field-name="password">
              <input
                v-model.lazy="password"
                v-focus
                v-validate="validation.previousPassword"
                type="password"
                data-vv-name="password"
                :data-vv-as="$t('password')"
              >
            </ErrorTooltip>
            <div class="buttons_container">
              <Button class="button_arrow" type="success" @click="submit">
                {{ $t('next') }}
                <Icon type="ios-arrow-forward" />
              </Button>
              <input v-if="false" type="text">
            </div>
          </form>
        </div>

        <div v-if="stepIndex === 1" class="stepItem2">
          <div class="step2Txt" @keyup.enter.native="stepIndex = 2">
            <Row>
              <i-col span="9">
                <div class="imgDiv">
                  <div class="step2Img">
                    <img src="@/views/resources/img/wallet/Step2Img.png">
                  </div>
                </div>
              </i-col>
              <i-col span="15">
                <p class="tit">
                  {{ $t('getting_a_mnemonic_equals_ownership_of_a_wallet_asset') }}
                </p>
                <div class="ul1">
                  <p class="ul1Tit">
                    <span class="point" /> {{ $t('backup_mnemonic') }}
                  </p>
                  <p class="ul1Txt">
                    {{ $t('use_paper_and_pen_to_correctly_copy_mnemonics') }}
                  </p>
                </div>
                <div class="ul2">
                  <p class="ul2Tit">
                    <span class="point" /> {{ $t('offline_storage') }}
                  </p>
                  <p class="ul2Txt">
                    {{ $t('keep_it_in_a_safe_place_on_the_isolated_network_mnemonics') }}
                  </p>
                </div>
              </i-col>
            </Row>
          </div>
          <div class="buttons_container">
            <Button
              v-focus class="button_arrow" type="success"
              @click="stepIndex = 2"
            >
              {{ $t('next') }}
              <Icon type="ios-arrow-forward" />
            </Button>
          </div>
        </div>

        <div v-if="stepIndex === 2" class="stepItem3">
          <p class="tit">
            {{ $t('please_accurately_copy_the_safety_backup_mnemonic') }}
          </p>
          <div class="mnemonicWords">
            {{ mnemonic }}
          </div>
          <div class="buttons_container" @keyup.enter.native="stepIndex = 3">
            <Button class="button_arrow" type="success" @click="copyMnemonic">
              {{ $t('copy_mnemonic') }}
            </Button>
            <Button class="button_arrow" type="success" @click="stepIndex = 5">
              {{ $t('display_mnemonic_QR_code') }}
            </Button>
            <Button v-focus type="success" @click="stepIndex = 3">
              {{ $t('next') }}
              <Icon type="ios-arrow-forward" />
            </Button>
          </div>
        </div>

        <div v-if="stepIndex === 3" class="stepItem4">
          <p class="tit">
            {{ $t('please_click_on_the_mnemonic_in_order_to_confirm_that_you_are_backing_up_correctly') }}
          </p>
          <MnemonicVerification
            :mnemonic-words-list="mnemonic.split(' ')"
            @verificationSuccess="$emit('closeModalMnemonicBackupWizard')"
            @toPreviousPage="stepIndex = 2"
          />
        </div>

        <div v-if="stepIndex === 4" class="stepItem5">
          <div class="backupImg">
            <img src="@/views/resources/img/wallet/exportSuccess.png">
          </div>
          <p class="backupTxt">
            {{ $t('the_mnemonic_order_is_correct_and_the_backup_is_successful') }}
          </p>
          <div class="buttons_container">
            <Button class="button_arrow" type="success" @click="$emit('closeModalMnemonicBackupWizard')">
              {{ $t('confirm') }}
            </Button>
          </div>
        </div>
        <div v-if="stepIndex === 5" class="stepItem6">
          <div class="backupImg">
            <img :src="qrCode$">
          </div>
          <div class="buttons_container">
            <Button class="button_arrow" type="success" @click="stepIndex = 2">
              {{ $t('back') }}
            </Button>
            <Button class="button_arrow" type="success">
              <a
                :href="qrCode$"
                download="qrCode.png"
              >
                {{ $t('Download') }}

              </a>
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
import {ModalMnemonicBackupWizardTs} from './ModalMnemonicBackupWizardTs'
import './ModalMnemonicBackupWizard.less'

export default class ModalMnemonicBackupWizard extends ModalMnemonicBackupWizardTs {}
</script>
