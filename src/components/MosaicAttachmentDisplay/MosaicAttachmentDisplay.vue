b<template>
  <div class="rows-scroll-container">
    <FormRow v-if="mosaics.length < 1">
      <template v-slot:inputs>
        <div class="row-centered-message">
          <span>
            {{ $t('please_input_mosaic_and_amount') }}
          </span>
        </div>
      </template>
    </FormRow>
    <FormRow
      v-for="(m,index) in mosaics"
      :key="index"
    >
      <template v-slot:inputs>
        <div class="row-mosaic-attachment-display inputs-container gray-background">
          <div class="pl-2">
            <span class="mosaic-name overflow_ellipsis">
              {{ m.name }}
            </span>
          </div>

          <div class="pl-4">
            <MosaicAmountDisplay 
              :id="m.id" 
              :relative-amount="m.amount" 
              :absolute="absolute" 
              :size="'normal'" 
            />
          </div>

          <span class="delete-icon" @click="$emit('delete', m.id)" />
        </div>
      </template>
    </FormRow>
  </div>
</template>

<script lang="ts">
import {MosaicAttachmentDisplayTs} from './MosaicAttachmentDisplayTs'
export default class MosaicAttachmentDisplay extends MosaicAttachmentDisplayTs {}
</script>

