<template>
  <div v-if="!disabled" class="add_mosaic_button radius" @click="$emit('click')">
    <slot name="label"></slot>
  </div>
  <div v-else class="add_mosaic_button radius" disabled="disabled">
    <slot name="label"></slot>
  </div>
</template>

<script lang="ts">
import {ButtonAddTs} from './ButtonAddTs'
import './ButtonAdd.less'

export default class ButtonAdd extends ButtonAddTs {}
</script>
