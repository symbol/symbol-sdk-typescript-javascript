<template>
  <div class="offline-setting-wrapper">
    <form onsubmit="event.preventDefault()" @keyup.enter="submit">
      <ul>
        <li>
          <div class="input-title">
            {{ $t('generation_hash') }}
          </div>
          <div class="default-value">
            {{ $t('current') }}:{{
              NetworkProperties ? NetworkProperties.generationHash : 'N/A'
            }}
          </div>
          <ErrorTooltip field-name="generationHash" placement-override="left">
            <input
              v-model="generationHash"
              v-validate="validation.generationHash"
              class="radius"
              data-vv-name="generationHash"
              :data-vv-as="$t('generation_hash')"
              :placeholder="$t('please_input_generation_hash')"
              type="text"
            >
          </ErrorTooltip>
        </li>
        <li>
          <div class="input-title">
            {{ $t('mosaicId') }}
          </div>
          <div class="default-value">
            {{ $t('current') }}:{{ activeAccount.networkCurrency.hex }}
          </div>
          <ErrorTooltip field-name="mosaicId" placement-override="left">
            <input
              v-model="networkCurrency.hex"
              v-validate="validation.mosaicId"
              class="radius"
              data-vv-name="mosaicId"
              :data-vv-as="$t('mosaicId')"
              :placeholder="$t('please_input_mosaic_hex')"
              type="text"
            >
          </ErrorTooltip>
        </li>
        <li>
          <div class="input-title">
            {{ $t('mosaic_divisibility') }}
          </div>
          <div class="default-value">
            {{ $t('current') }}:{{ activeAccount.networkCurrency.divisibility }}
          </div>
          <ErrorTooltip field-name="divisibility" placement-override="left">
            <input
              v-model="networkCurrency.divisibility"
              v-validate="validation.divisibility"
              class="radius"
              data-vv-name="divisibility"
              :data-vv-as="$t('divisibility')"
              :placeholder="$t('please_input_divisibility')"
              type="text"
            >
          </ErrorTooltip>
        </li>
        <li>
          <div class="input-title">
            {{ $t('Mosaic_name') }}
          </div>
          <div class="default-value">
            {{ $t('current') }}:{{ activeAccount.networkCurrency.name }}
          </div>
          <input
            v-model="networkCurrency.name"
            :placeholder="$t('Mosaic_alias')"
            type="text"
          >
        </li>

        <li>
          <div class="input-title">
            {{ $t('Ticker') }}
          </div>
          <div class="default-value">
            {{ $t('current') }}:{{ activeAccount.networkCurrency.ticker }}
          </div>
          <input
            v-model="networkCurrency.ticker"
            :placeholder="$t('Mosaic_alias')"
            type="text"
          >
        </li>
      </ul>
      <span class="submit-button radius" @click="submit">{{ $t('confirm') }}</span>
    </form>
  </div>
</template>

<script lang="ts">
import OfflineSettingTs from './OfflineSettingTs'
import './OfflineSetting.less'
export default class OfflineSetting extends OfflineSettingTs { }
</script>
