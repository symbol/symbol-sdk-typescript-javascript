<template>
  <div class="form-line-container">
    <div class="mosaic_list_container radius">
      <span class="mosaic_name overflow_ellipsis">{{ $t('mosaic') }}</span>
      <span class="mosaic_amount overflow_ellipsis">{{ $t('amount') }}</span>
      <div class="scroll">
        <div v-if="mosaics.length < 1" class="no_data">
          {{ $t('please_input_mosaic_and_amount') }}
        </div>
        <div v-else class="mosaic_list_item_container scroll">
          <div
            v-for="(m,index) in mosaics"
            :key="index"
            class="mosaic_list_item radius"
          >
            <span class="mosaic_name overflow_ellipsis">
              {{ m.name }}
            </span>
            <span class="mosaic_amount overflow_ellipsis">
              <MosaicAmountDisplay :id="m.id" :relative-amount="m.amount" :absolute="absolute" :size="'normal'" />
            </span>
            <span class="icon_delete" @click="$emit('delete', m.id)" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {MosaicAttachmentDisplayTs} from './MosaicAttachmentDisplayTs'
import './MosaicAttachmentDisplay.less'

export default class MosaicAttachmentDisplay extends MosaicAttachmentDisplayTs {}
</script>

