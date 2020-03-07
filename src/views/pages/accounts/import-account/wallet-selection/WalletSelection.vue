<template>
  <div class="wallet-selection-container" @keyup.enter="submit">
    <div class="left-container">
      <div class="dialog-sub-tips">
        {{ $t('Address_to_Interact_With') }}
      </div>
      <div class="choose-hd-path radius scroll">
        <div class="address-list">
          <div class="table-title">
            <span class="address-id">{{ $t('ID') }}</span>
            <span class="address-value">{{ $t('Address') }}</span>
            <span class="address-balance">{{ $t('Balance') }}</span>
          </div>
          <div>
            <div
              v-for="(a, index) in addressesList"
              :key="index"
              @click="onAddAddress(index)"
            >
              <div v-if="!(selectedAccounts.includes(index))" class="table-item pointer">
                <span class="address-id">{{ index + 1 }}</span>
                <span class="address-value">{{ formatters.miniAddress(a) }}</span>
                <span v-if="addressMosaicMap[a.plain()]" class="address-balance overflow_ellipsis">
                  <MosaicAmountDisplay
                    :id="networkMosaic"
                    :relative-amount="addressMosaicMap[a.plain()]"
                  />
                </span>
                <span v-else class="address-balance overflow_ellipsis">
                  N/A
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="right-container ">
      <div class="right-container-title">
        {{ $t('Choose_Wallets') }}
      </div>
      <div class="address-list-container radius scroll">
        <div class="address-list">
          <div class="table-title">
            <span class="address-id">{{ $t('ID') }}</span>
            <span class="address-value">{{ $t('Address') }}</span>
            <span class="address-balance overflow_ellipsis">{{ $t('Balance') }}</span>
            <span class="remove-icon" />
          </div>
          <div class="radius">
            <div
              v-for="index in selectedAccounts" :key="index" class="table-item pointer"
              @click="onRemoveAddress(index)"
            >
              <span class="address-id"> {{ index + 1 }} </span>
              <span class="address-value">{{ formatters.miniAddress(addressesList[index]) }}</span>
              <span v-if="addressMosaicMap[addressesList[index].plain()]" class="address-balance overflow_ellipsis">
                <MosaicAmountDisplay
                  :id="networkMosaic"
                  :relative-amount="addressMosaicMap[addressesList[index].plain()]"
                />
              </span>
              <span v-else class="address-balance overflow_ellipsis">
                N/A
              </span>
              <span class="remove-icon"><img src="@/views/resources/img/Invisible@2x.png"></span>
            </div>
          </div>
        </div>
      </div>
      <div class="button-container flex-container">
        <button class="button-style info-button back-button" @click="$router.back()">
          {{ $t('previous') }}
        </button>
        <button class="button-style validation-button" @click="submit">
          {{ $t('Access_My_Wallet') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import WalletSelectionTs from './WalletSelectionTs'
import './WalletSelection.less'

export default class WalletSelection extends WalletSelectionTs {}
</script>
