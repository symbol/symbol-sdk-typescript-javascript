<template>
  <div>
    <MosaicSelector :mosaics="mosaics"
                    v-model="selectedMosaic"
                    @input="onChangeMosaic" />

    <AmountInput v-model="relativeAmount"
                 @input="onChangeAmount" />

    <ButtonAdd @click="onClickAdd"
               :disabled="!canClickAdd" />
  </div>
</template>

<script lang="ts">
import {MosaicAttachmentInputTs} from './MosaicAttachmentInputTs'
import './MosaicAttachmentInput.less'

export default class MosaicAttachmentInput extends MosaicAttachmentInputTs {}
</script>

