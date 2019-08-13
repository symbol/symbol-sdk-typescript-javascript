<template>

  <div>
    <div class="keystore">
      <div class="describle">{{$t('keyStore_describle')}}</div>
      <ul>
        <li>
          {{$t('keystore_string')}}
          <div class="tips">
            {{$t('keystore_describle_import')}}
          </div>
          <div class="gray_content">
            <Select v-model="file" :placeholder="$t('please_choose')">
              <Option v-for="item in fileList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </div>
          <div class="gray_content textarea">
            <textarea class="absolute" :placeholder="$t('keystore_text')"/>
          </div>
        </li>
        <li>
          {{$t('set_password')}}
          <div class="tips">
            {{$t('keystore_describle_text')}}
          </div>
          <div class="gray_content">
            <input class="absolute" type="password" :placeholder="$t('please_set_your_password')">
          </div>
        </li>
      </ul>


    </div>
    <div class="bottom_button ">
      <span class="back left pointer" @click="toBack"> {{$t('back')}}</span>
      <span class="import right" @click="checkForm">{{$t('import')}}</span>
    </div>
  </div>

</template>

<script lang="ts">
    import {WalletImportKeystoreTs} from './WalletImportKeystoreTs'

    export default class WalletImportKeystore extends WalletImportKeystoreTs {

    }
</script>
<style scoped lang="less">
  @import "WalletImportKeystore.less";
</style>
