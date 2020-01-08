<template>
  <div class="choose-wallet-sec" @keyup.enter="submit">
    <div class="left-container">
      <div class="dialog-sub-tips">{{$t('Address_to_Interact_With')}}</div>
      <div class="choose-hd-path radius">
        <div class="address-list">
          <div class="table-title">
            <span class="address-id">{{$t('ID')}}</span>
            <span class="address-value">{{$t('Address')}}</span>
            <span class="address-balance">{{$t('Balance')}}</span>
          </div>
          <div class="scroll">
            <div v-for="(a, index) in addressList" :key="index" @click="addAccount(index,a)">
              <div class="table-item pointer" v-if="!(index in selectedAccountMap)">
                <span class="address-id">{{index + 1}}</span>
                <span class="address-value">{{miniAddress(a)}}</span>
                <span v-if="addressMosaicMap[a.plain()]" class="address-balance overflow_ellipsis">
                  <NumberFormatting :numberOfFormatting="addressMosaicMap[a.plain()]" />
                </span>
                <span v-if="!addressMosaicMap[a.plain()]" class="address-balance overflow_ellipsis">
                  N/A
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="right-container ">
      <div class="right-container-title">{{$t('Choose_Wallets')}}</div>
      <div class="address-list-container radius">
        <div class="address-list">
          <div class="table-title">
            <span class="address-id">{{$t('ID')}}</span>
            <span class="address-value">{{$t('Address')}}</span>
            <span class="address-balance overflow_ellipsis">{{$t('Balance')}}</span>
            <span class="remove-icon"></span>
          </div>
          <div class="scroll radius">
            <div v-for="(value,key,index) in selectedAccountMap" @click="removeAccount(key)" :key="key" class="table-item pointer">
              <span class="address-id"> {{ index + 1 }} </span>
              <span class="address-value">{{miniAddress(value)}}</span>
              <span class="address-balance overflow_ellipsis">{{addressMosaicMap[value.plain()]||'N/A'}}</span>
              <span class="remove-icon"><img src="@/common/img/Invisible@2x.png"></span>
            </div>
          </div>
        </div>
      </div>
      <div class="button-container">
        <button class="info-button" @click="$router.back()">{{$t('previous')}}</button>
        <button @click="submit">{{$t('Access_My_Wallet')}}</button>
      </div>
    </div>
  </div>
</template>

<script>
  import WalletChooseTs from "./WalletChooseTs";
  import "./WalletChoose.less";

  export default class WalletChoose extends WalletChooseTs {
  }
</script>

<style scoped lang="less">
</style>
