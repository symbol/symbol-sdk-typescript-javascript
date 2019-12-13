<template>
  <div class="choose-wallet-sec" @keyup.enter="submit">
    <div class="left-container">
      <div class="dialog-sub-tips">{{$t('Address_to_Interact_With')}}</div>
      <div class="choose-hd-path radius">
        <div class="selection-container">
<!--          <span class="network-type radius">{{$t('CATAPULT')}}</span>-->
<!--          <span class="network-type radius">{{networkName}}</span>-->
        </div>
        <div class="hd-path">
          <!--          <span class="hd-path-title">{{$t('HD_Derivation_Path')}}</span>-->
          <!--          <span class="hd-path-type">{{$t('CATAPULT')}}</span>-->
          <!--          <span class="hd-path-value">(m/44`/0`/0`/0)</span>-->
        </div>
        <div class="address-list">
          <div class="table-title">
            <span class="address-id">{{$t('ID')}}</span>
            <span class="address-value">{{$t('Address')}}</span>
            <span class="address-balance">{{$t('Balance')}}</span>
          </div>
          <div class="scroll">
            <div v-for="(a,index) in addressList" :key="index" @click="addAccount(index,a)">
              <div class="table-item pointer" v-if="!(index in selectedAccountMap)">
                <span class="address-id">{{index}}</span>
                <span class="address-value">{{miniHash(a.plain())}}</span>
                <span class="address-balance overflow_ellipsis">{{addressMosaicMap[a.plain()]||'N/A'}}</span>
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
            <div v-for="(value,key,index) in selectedAccountMap" @click="removeAccount(key)" :key="key" class="table-item">
              <span class="address-id"> {{index}} </span>
              <span class="address-value">{{miniHash(value.plain())}}</span>
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
