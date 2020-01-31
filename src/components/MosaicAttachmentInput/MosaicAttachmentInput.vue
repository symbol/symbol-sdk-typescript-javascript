<template>
  <div>
    <MosaicSelector :mosaics="mosaics"
                    v-model="selectedMosaic" />

    <AmountInput v-model="relativeAmount" />
    
    <ButtonAdd @click="onClickAdd"
               :disabled="!formItems.selectedMosaicHex || undefined === formItems.relativeAmount" />
  </div>
</template>

<script lang="ts">
import {MosaicAttachmentInputTs} from './MosaicAttachmentInputTs'
import './MosaicAttachmentInput.less'

export default class MosaicAttachmentInput extends MosaicAttachmentInputTs {}
</script>

