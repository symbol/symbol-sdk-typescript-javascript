<template>
  <div class="clearfix">
    <FormLabel> {{ $t('form_label_cosignatory_modifications') }} </FormLabel>
    <div
      v-for="{publicKey, address, addOrRemove} in modifications"
      :key="publicKey"
      class="modification-line-container mx-1"
    >
      <div class="modification-type-container">
        <Icon
          v-if="addOrRemove === 'add'"
          class="modification-type-icon"
          type="md-person-add"
        />
        <Icon
          v-else
          class="modification-type-icon red"
          type="md-remove-circle"
        />
      </div>
      <div class="cosignatory-address-container">
        <span>{{ address }}</span>
      </div>

      <div class="cosignatory-button">
        <button
          class="right-side-round-button round-button red"
          @click="$emit('on-remove-cosignatory-modification', publicKey)"
        >
          <Icon type="md-remove-circle" />
        </button>
      </div>
    </div>

    <div v-if="!modifications.length" class="mx-1 no-data">
      <span class="description-text">{{ $t('no_data') }}</span> 
    </div>
  </div>
</template>

<script lang="ts">
import {CosignatoryModificationsDisplayTs} from './CosignatoryModificationsDisplayTs'

export default class CosignatoryModificationsDisplay extends CosignatoryModificationsDisplayTs {}
</script>

<style lang="less" scoped>
@import './CosignatoryModificationsDisplay.less';
</style>
