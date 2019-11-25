<template>
  <div class="offline-setting-wrapper">
    <form @submit.prevent="validateForm('offline-setting')" @keyup.enter="submit">
      <ul>
        <li>
          <div class="input-title">{{$t('generation_hash')}}</div>
          <div class="default-value">{{$t('current')}}:{{generationHash}}</div>
          <ErrorTooltip fieldName="generationHash" placementOverride="left">
            <input
                    class="radius"
                    data-vv-name="generationHash"
                    v-model="formItems.generationHash"
                    v-validate="validation.generationHash"
                    :data-vv-as="$t('generation_hash')"
                    :placeholder="$t('please_input_generation_hash')"
                    type="text"
            />
          </ErrorTooltip>
        </li>
        <li>
          <div class="input-title">{{$t('mosaicId')}}</div>
          <div class="default-value">{{$t('current')}}:{{networkCurrency.hex}}</div>
          <ErrorTooltip fieldName="mosaicId" placementOverride="left">
            <input
                    class="radius"
                    data-vv-name="mosaicId"
                    v-model="formItems.mosaicId"
                    v-validate="validation.mosaicId"
                    :data-vv-as="$t('mosaicId')"
                    :placeholder="$t('please_input_mosaic_hex')"
                    type="text"
            />
          </ErrorTooltip>
        </li>
        <li>
          <div class="input-title">{{$t('mosaic_divisibility')}}</div>
          <div class="default-value">{{$t('current')}}:{{networkCurrency.divisibility}}</div>
          <ErrorTooltip fieldName="divisibility" placementOverride="left">
            <input
                    class="radius"
                    data-vv-name="divisibility"
                    v-model="formItems.divisibility"
                    v-validate="validation.divisibility"
                    :data-vv-as="$t('divisibility')"
                    :placeholder="$t('please_input_divisibility')"
                    type="text"
            />
          </ErrorTooltip>
        </li>
        <li>
          <div class="input-title">{{$t('mosaicName')}}</div>
          <div class="default-value">{{$t('current')}}:{{networkCurrency.name}}</div>
          <input   :placeholder="$t('Mosaic_alias')" v-model="formItems.mosaicName" type="text">
        </li>
      </ul>
      <span class="submit-button radius" @click="submit">{{$t('confirm')}}</span>
    </form>
  </div>
</template>

<script lang="ts">
    import OfflineSettingTs from './OfflineSettingTs'
    import "./OfflineSetting.less"

    export default class OfflineSetting extends OfflineSettingTs {


    }
</script>
<style scoped lang="less">

</style>
