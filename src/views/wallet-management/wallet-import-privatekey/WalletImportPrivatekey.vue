<template>
  <div>
    <div class="privatekey">
      <div class="describle">{{$t('the_private_key_is_a_string_of_256_bit_random_strings_which_is_the_absolute_control_of_the_account_Please_keep_it_safe')}}</div>
      <ul>
        <li>
          {{$t('private_key_string')}}
          <div class="tips">
            {{$t('Please_paste_the_private_key_string_in_the_input_box_below')}}
          </div>
          <div class="gray_content textarea">
            <textarea class="absolute" :placeholder="$t('Paste_the_private_key_string_in_the_input_box')"/>
          </div>
        </li>
        <li>
          {{$t('set_password')}}
          <div class="tips">
            {{$t('This_password_is_a_private_key_password_and_will_be_used_when_you_pay')}}
          </div>
          <div class="gray_content">
            <input class="absolute" type="text" :placeholder="$t('please_set_your_password')">
          </div>
        </li>
        <li>
          {{$t('confirm_password')}}
          <div class="gray_content">
            <input class="absolute" type="text" :placeholder="$t('please_enter_your_wallet_password_again')">
          </div>
        </li>
      </ul>


    </div>
    <div class="bottom_button ">
      <span class="back left"> {{$t('back')}}</span>
      <span class="import right">{{$t('import')}}</span>
    </div>
  </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    @Component
    export default class WalletImportPrivatekey extends Vue {


    }
</script>
<style scoped lang="less">
@import "WalletImportPrivatekey.less";
</style>
