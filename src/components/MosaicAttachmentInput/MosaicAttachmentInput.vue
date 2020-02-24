<template>
  <FormRow>
    <template v-slot:label>
      {{ $t('asset_type') }}:
    </template>
    <template v-slot:inputs>
      <ValidationObserver 
        v-slot="{ handleSubmit }"
        class="row-mosaic-attachment-input inputs-container"
        tag="div"
      >
        <MosaicSelector
          v-model="selectedMosaic"
          :mosaics="mosaics"
          @input="onChangeMosaic"
        />
        <AmountInput
          v-model="relativeAmount"
          class="pl-2 pr-2"
        />
        <ButtonAdd
          :disabled="!canClickAdd"
          class="button-add align-right"
          @click="handleSubmit(onClickAdd)"
        />
      </ValidationObserver>
    </template>
  </FormRow>
</template>

<script lang="ts">
import {MosaicAttachmentInputTs} from './MosaicAttachmentInputTs'
export default class MosaicAttachmentInput extends MosaicAttachmentInputTs {}
</script>

