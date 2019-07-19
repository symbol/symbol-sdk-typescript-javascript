<template>
  <div>
    <div class="mnemonic">
      <div class="describle">{{$t('mnemonic_describle')}}</div>
      <ul>
        <li>
          {{$t('input_mnemonic')}}
          <div class="tips">
            {{$t('enter_12_words_please_pay_attention_to_the_order_separated_by_a_space_between_each_word')}}
          </div>
          <div class="gray_content textarea">
            <textarea class="absolute"/>
          </div>
        </li>
        <li>
          {{$t('set_password')}}
          <div class="tips">
            {{$t('mnemonic_describle_tips')}}
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
    export default class WalletImportMnemonic extends Vue {


    }
</script>
<style scoped lang="less">
  @import "WalletImportMnemonic";
</style>
