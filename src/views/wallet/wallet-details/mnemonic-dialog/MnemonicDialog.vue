<template>
  <div class="mnemonicDialogWrap">
    <Modal
            v-model="show"
            class-name="vertical-center-modal"
            :footer-hide="true"
            :width="1000"
            :transfer="false"
            @on-cancel="$emit('closeMnemonicDialog')">
      <div slot="header" class="mnemonicDialogHeader">
        <span class="title">{{$t('export_mnemonic')}}</span>
      </div>
      <div class="mnemonicDialogBody">
        <div class="steps" v-if="stepIndex != 4">
          <span :class="['stepItem',stepIndex == 0?'active':'']">{{$t('input_password')}}</span>
          <span :class="['stepItem',stepIndex == 1?'active':'']">{{$t('backup_prompt')}}</span>
          <span :class="['stepItem',stepIndex == 2||stepIndex == 5?'active':'']">{{$t('backup_mnemonic')}}</span>
          <span :class="['stepItem',stepIndex == 3?'active':'']">{{$t('confirm_backup')}}</span>
        </div>

        <div class="stepItem1" v-if="stepIndex == 0">
          <form
            @submit.prevent="validateForm('mnemonic-dialog')" 
            @keyup.enter="submit"
            class="centered"
          >
            <input
              v-model="cipher"
              data-vv-name="cipher"
              v-validate="'required'"
              style="display:none"
            />
            <ErrorTooltip fieldName="password">
              <input
                v-focus
                v-model="password"
                type="password"
                :placeholder="$t('please_enter_your_wallet_password')"
                data-vv-name="password"
                v-validate="standardFields.previousPassword.validation"
                :data-vv-as="$t('password')"
              />
            </ErrorTooltip>
            <div class="buttons_container">
              <Button class="button_arrow" type="success" @click="submit">
                {{$t('next')}}
                <Icon  type="ios-arrow-forward" />
              </Button>
              <input v-if="false" type="text">
            </div>
          </form>
        </div>

        <div class="stepItem2" v-if="stepIndex == 1">
          <div class="step2Txt" @keyup.enter.native="stepIndex = 2">
            <Row>
              <Col span="9">
                <div class="imgDiv">
                  <div class="step2Img">
                    <img src="@/common/img/wallet/Step2Img.png">
                  </div>
                </div>
              </Col>
              <Col span="15">
                <p class="tit">{{$t('getting_a_mnemonic_equals_ownership_of_a_wallet_asset')}}</p>
                <div class="ul1">
                  <p class="ul1Tit"><span class="point"></span> {{$t('backup_mnemonic')}}</p>
                  <p class="ul1Txt">
                    {{$t('use_paper_and_pen_to_correctly_copy_mnemonics_If_your_phone_is_lost_stolen_or_damaged_mnemonic_will_restore_your_assets')}}</p>
                </div>
                <div class="ul2">
                  <p class="ul2Tit"><span class="point"></span> {{$t('offline_storage')}}</p>
                  <p class="ul2Txt">{{$t('keep_it_in_a_safe_place_on_the_isolated_network_mnemonics')}}</p>
                </div>
              </Col>
            </Row>
          </div>
          <div class="buttons_container">
            <Button v-focus class="button_arrow" type="success" @click="stepIndex = 2">
              {{$t('next')}}
              <Icon  type="ios-arrow-forward" />
            </Button>
          </div>
        </div>

        <div class="stepItem3" v-if="stepIndex == 2" >
          <p class="tit">{{$t('please_accurately_copy_the_safety_backup_mnemonic')}}</p>
          <div class="mnemonicWords text_select">{{mnemonic}}</div>
          <div class="buttons_container" @keyup.enter.native="stepIndex = 3">
            <Button class="button_arrow" type="success" @click="copyMnemonic">
              {{$t('copy_mnemonic')}}
            </Button>
            <Button class="button_arrow" type="success" @click="stepIndex = 5">
              {{$t('display_mnemonic_QR_code')}}
            </Button>
            <Button type="success" v-focus @click="stepIndex = 3">
              {{$t('next')}}
              <Icon  type="ios-arrow-forward" />
            </Button>
          </div>
        </div>

        <div class="stepItem4" v-if="stepIndex == 3">
          <p class="tit">
            {{$t('please_click_on_the_mnemonic_in_order_to_confirm_that_you_are_backing_up_correctly')}}
          </p>
          <MnemonicVerification
                  :mnemonicWordsList="mnemonic.split(' ')"
                  @verificationSuccess="$emit('closeMnemonicDialog')"
                  @toPreviousPage="stepIndex = 2"/>
        </div>

        <div class="stepItem5" v-if="stepIndex == 4">
          <div class="backupImg">
            <img src="@/common/img/wallet/exportSuccess.png">
          </div>
          <p class="backupTxt">{{$t('the_mnemonic_order_is_correct_and_the_backup_is_successful')}}</p>
          <div class="buttons_container">
            <Button class="button_arrow" type="success" @click="$emit('closeMnemonicDialog')">
              {{$t('confirm')}}
            </Button>
          </div>
        </div>

        <div class="stepItem6" v-if="stepIndex == 5">
          <div class="backupImg">
            <img :src="QRCode">
          </div>
          <div class="buttons_container">
            <Button class="button_arrow" type="success" @click="stepIndex = 2">
              {{$t('back')}}
            </Button>
            <Button class="button_arrow" type="success">
              <a
                      :href="QRCode"
                      download="qrCode.png"
              >
                {{$t('Download')}}

              </a>
            </Button>
          </div>
        </div>
      </div>

    </Modal>
  </div>
</template>

<script lang="ts">
    import '@/views/wallet/wallet-details/mnemonic-dialog/MnemonicDialog.less'
    import {MnemonicDialogTs} from "@/views/wallet/wallet-details/mnemonic-dialog/MnemonicDialogTs.ts"

    export default class MnemonicDialog extends MnemonicDialogTs {

    }
</script>

<style scoped>

</style>
