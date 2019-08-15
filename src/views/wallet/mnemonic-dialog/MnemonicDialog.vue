<template>
  <div class="mnemonicDialogWrap">
    <Modal
            v-model="show"
            class-name="vertical-center-modal"
            :footer-hide="true"
            :width="1000"
            :transfer="false"
            @on-cancel="mnemonicDialogCancel">
      <div slot="header" class="mnemonicDialogHeader">
        <span class="title">{{$t('export_mnemonic')}}</span>
      </div>
      <div class="mnemonicDialogBody">
        <div class="steps" v-if="stepIndex != 4">
          <span :class="['stepItem',stepIndex == 0?'active':'']">{{$t('input_password')}}</span>
          <span :class="['stepItem',stepIndex == 1?'active':'']">{{$t('backup_prompt')}}</span>
          <span :class="['stepItem',stepIndex == 2?'active':'']">{{$t('backup_mnemonic')}}</span>
          <span :class="['stepItem',stepIndex == 3?'active':'']">{{$t('confirm_backup')}}</span>
        </div>

        <div class="stepItem1" v-if="stepIndex == 0">
          <Form :model="wallet">
            <FormItem>
              <Input v-model="wallet.password" type="password" required
                     :placeholder="$t('please_enter_your_wallet_password')"></Input>
            </FormItem>
            <FormItem>
              <div class="buttons_container">
                <Button type="success" @click="exportMnemonic">
                  {{$t('next')}}
                  <Icon class="next" type="ios-arrow-round-forward"/>
                </Button>
              </div>
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
            <Button type="success" @click="exportMnemonic">
              {{$t('next')}}
              <Icon class="next" type="ios-arrow-round-forward"/>
            </Button>

          </div>
        </div>

        <div class="stepItem3" v-if="stepIndex == 2">
          <p class="tit">{{$t('please_accurately_copy_the_safety_backup_mnemonic')}}</p>
          <p class="mnemonicWords">{{mnemonic}}</p>
          <div class="buttons_container">
            <Button type="success" @click="exportMnemonic">
              {{$t('next')}}
              <Icon class="next" type="ios-arrow-round-forward"/>
            </Button>

          </div>
        </div>

        <div class="stepItem4" v-if="stepIndex == 3">
          <p class="tit">
            {{$t('please_click_on_the_mnemonic_in_order_to_confirm_that_you_are_backing_up_correctly')}}</p>
          <div class="sureMnemonicWords" ref="mnemonicWordDiv"></div>
          <p class="mnemonicWords">
            <span v-for="(item, index) in mnemonicRandomArr" @click="sureWord(index)" :key="index">{{item}}</span>
          </p>
          <div class="buttons_container">
            <Button type="success" class="preButton" @click="toPrePage()">
              <Icon class="pre" type="ios-arrow-round-back"/>
              {{$t('previous')}}
            </Button>


            <Button type="success" @click="exportMnemonic">
              {{$t('next')}}
              <Icon class="next" type="ios-arrow-round-forward"/>
            </Button>

          </div>
        </div>

        <div class="stepItem5" v-if="stepIndex == 4">
          <div class="backupImg">
            <img src="@/common/img/wallet/exportSuccess.png">
          </div>
          <p class="backupTxt">{{$t('the_mnemonic_order_is_correct_and_the_backup_is_successful')}}</p>
          <div class="buttons_container">
            <Button type="success" @click="toPrePage()">
              <Icon class="pre" type="ios-arrow-round-back"/>
              {{$t('previous')}}
            </Button>


            <Button type="success" @click="exportMnemonic">
              {{$t('next')}}
              <Icon class="next" type="ios-arrow-round-forward"/>
            </Button>

          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
    import './MnemonicDialog.less'
    import {MnemonicDialogTs} from "./MnemonicDialogTs"

    export default class MnemonicDialog extends MnemonicDialogTs {

    }
</script>

<style scoped>

</style>
