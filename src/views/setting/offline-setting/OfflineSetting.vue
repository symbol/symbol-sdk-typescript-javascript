<template>
  <div class="offline-setting-wrapper">
    <form onsubmit="event.preventDefault()" @keyup.enter="submit">
      <ul>
        <li>
          <div class="input-title">{{$t('generation_hash')}}</div>
          <div class="default-value">
            {{$t('current')}}:{{
              NetworkProperties ? NetworkProperties.generationHash : 'N/A'
            }}
          </div>
          <ErrorTooltip fieldName="generationHash" placementOverride="left">
            <input
                    class="radius"
                    data-vv-name="generationHash"
                    v-model="generationHash"
                    v-validate="validation.generationHash"
                    :data-vv-as="$t('generation_hash')"
                    :placeholder="$t('please_input_generation_hash')"
                    type="text"
            />
          </ErrorTooltip>
        </li>
        <li>
          <div class="input-title">{{$t('mosaicId')}}</div>
          <div class="default-value">
            {{$t('current')}}:{{this.activeAccount.networkCurrency.hex}}
          </div>
          <ErrorTooltip fieldName="mosaicId" placementOverride="left">
            <input
                    class="radius"
                    data-vv-name="mosaicId"
                    v-model="networkCurrency.hex"
                    v-validate="validation.mosaicId"
                    :data-vv-as="$t('mosaicId')"
                    :placeholder="$t('please_input_mosaic_hex')"
                    type="text"
            />
          </ErrorTooltip>
        </li>
        <li>
          <div class="input-title">{{$t('mosaic_divisibility')}}</div>
          <div class="default-value">
            {{$t('current')}}:{{this.activeAccount.networkCurrency.divisibility}}
          </div>
          <ErrorTooltip fieldName="divisibility" placementOverride="left">
            <input
                    class="radius"
                    data-vv-name="divisibility"
                    v-model="networkCurrency.divisibility"
                    v-validate="validation.divisibility"
                    :data-vv-as="$t('divisibility')"
                    :placeholder="$t('please_input_divisibility')"
                    type="text"
            />
          </ErrorTooltip>
        </li>
        <li>
          <div class="input-title">{{$t('Mosaic_name')}}</div>
          <div class="default-value">
            {{$t('current')}}:{{this.activeAccount.networkCurrency.name}}
          </div>
          <input
            :placeholder="$t('Mosaic_alias')"
            v-model="networkCurrency.name"
            type="text"
          >
        </li>

        <li>
          <div class="input-title">{{$t('Ticker')}}</div>
          <div class="default-value">
            {{$t('current')}}:{{this.activeAccount.networkCurrency.ticker}}
          </div>
          <input
            :placeholder="$t('Mosaic_alias')"
            v-model="networkCurrency.ticker"
            type="text"
          >
        </li>
      </ul>
      <span class="submit-button radius" @click="submit">{{$t('confirm')}}</span>
    </form>
  </div>
</template>

<script lang="ts">
    import OfflineSettingTs from './OfflineSettingTs'
    import "./OfflineSetting.less"
    export default class OfflineSetting extends OfflineSettingTs { }
</script>
