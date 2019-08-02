<template>
  <div class="update_wallet_password">

    <div class="left_input left">

      <div class="input_content">
        <span>{{$t('old_password')}}</span>
        <input type="password" v-model="prePassword" :placeholder="$t('please_enter_the_original_password')">
      </div>

      <div class="input_content">
        <span>{{$t('new_password')}}</span>
        <input type="password" v-model="newPassword" :placeholder="$t('please_enter_a_new_password')">
      </div>

      <div class="input_content">
        <span>{{$t('Confirm_the_password')}}</span>
        <input type="password" v-model="repeatPassword" :placeholder="$t('please_enter_your_new_password_again')">
      </div>


      <div class="confirm_update pointer" @click="confirmUpdate">
        {{$t('confirm')}}
      </div>
    </div>

    <div class="right_tips left">

      <div class="tip_title">{{$t('tips')}}：</div>
      <div class="tip_content">
        {{$t('This_password_will_be_used_for_all_transactions_in_your_wallet_account_Please_remember_your_password_and_keep_it_safe')}}
      </div>
      <div class="tip_content">
        {{$t('The_password_setting_requirement_is_not_less_than_six_digits_The_more_complicated_the_recommendation_the_better_the_security_of_your_wallet')}}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import Message from '@/message/Message'

    @Component
    export default class WalletUpdatePassword extends Vue {
        prePassword = ''
        newPassword = ''
        repeatPassword = ''


        checkInfo() {
            const {prePassword, newPassword, repeatPassword} = this

            if (prePassword == '') {
                this.$Message.error(this.$t(Message.INPUT_EMPTY_ERROR))
                return false
            }
            if (newPassword == '') {
                this.$Message.error(this.$t(Message.INPUT_EMPTY_ERROR))
                return false
            }
            if (repeatPassword == '') {
                this.$Message.error(this.$t(Message.INPUT_EMPTY_ERROR))
                return false
            }
            if (newPassword !== repeatPassword) {
                this.$Message.error(this.$t(Message.INCONSISTENT_PASSWORD_ERROR))
                return false
            }
            return true
        }

        confirmUpdate() {
            const {prePassword, newPassword, repeatPassword} = this
            if (!this.checkInfo()) {
                return
            }
        }
    }
</script>
<style scoped lang="less">
  @import "WalletUpdatePassword.less";
</style>
