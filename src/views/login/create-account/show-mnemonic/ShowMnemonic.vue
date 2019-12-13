<template>
  <div class="create-mnemonic-sec" @keyup.enter="submit('verifyMnemonic')">
    <p class="set-title">{{$t('Backup_mnemonic')}}</p>
    <div class="create-mnemonic-col">
      <div class="create-mnemonic-left">
        <div class="mnemonic-container">
          <div class="show-mnemonic" v-if="!showMnemonic">
            <img src="@/common/img/invisible.png"/>
            <button @click="showMnemonic = true">{{$t('Display_mnemonic')}}</button>
          </div>
          <div class="mnemonic-list" v-else>
            <span v-for="m in mnemonicWordsList">{{m}}</span>
          </div>
        </div>

        <div class="button-container">
          <button @click="submit('finished')" class="info-button">{{$t('Back')}}</button>
          <button @click="submit('verifyMnemonic')">{{$t('Verify_backup_mnemonics')}}</button>
        </div>
      </div>
      <div class="create-mnemonic-right">
        <p class="text1">{{$t('Tips')}}</p>
        <p class="text">{{$t('Don_not_disclose')}}</p>
        <p class="text">{{$t('Please_write_your_supporting_words')}}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
    import ShowMnemonicTs from "./ShowMnemonicTs";

    export default class ShowMnemonic extends ShowMnemonicTs {
    }
</script>

<style scoped lang="less">
  @import "ShowMnemonic.less";
</style>
