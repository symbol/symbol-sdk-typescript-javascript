<template>
  <FormRow>
    <template v-slot:label>
      <span v-show="isFirstItem">{{ $t('mosaic') }}:</span>
    </template>
    <template v-slot:inputs>
      <div class="row-mosaic-attachment-input inputs-container">
        <MosaicSelector v-model="chosenValue.mosaicHex" :mosaics="mosaics" @input="onChangeMosaic" />
        <AmountInput v-model="relativeAmount" class="pl-2" @input="onChangeAmount" />
        <div v-show="isShowDelete" class="delete-mosaic-container">
          <span class="delete-mosaic-icon" @click="$emit('input-deleted', uid)" />
        </div>
      </div>
    </template>
  </FormRow>
</template>

<script lang="ts">
import { MosaicAttachmentInputTs } from './MosaicAttachmentInputTs'
export default class MosaicAttachmentInput extends MosaicAttachmentInputTs {}
</script>

