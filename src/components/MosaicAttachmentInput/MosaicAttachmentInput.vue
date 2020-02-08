<template>
  <div class="form-line-container mosaic-attachment-input">
    <FormLabel>{{ $t('asset_type') }}</FormLabel>
    <ValidationObserver v-slot="{ handleSubmit }" tag="div">
      <div class="inline-container">
        <div class="half-width-item-container">
          <MosaicSelector
            v-model="selectedMosaic"
            :mosaics="mosaics"
            @input="onChangeMosaic"
          />
        </div>

        <div class="half-width-item-container">
          <AmountInput
            v-model="relativeAmount"
            class="right-item"
          />
        </div>

        <ButtonAdd
          :disabled="!canClickAdd"
          class="button-add"
          @click="handleSubmit(onClickAdd)"
        />
      </div>
    </ValidationObserver>
  </div>
</template>

<script lang="ts">
import {MosaicAttachmentInputTs} from './MosaicAttachmentInputTs'
export default class MosaicAttachmentInput extends MosaicAttachmentInputTs {}
</script>

