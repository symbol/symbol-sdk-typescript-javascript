<template>
  <div class="approval-removal-container">
    <div class="half-split-container">
      <FormLabel>
        <template>{{ $t('form_label_min_approval') }}</template>
      </FormLabel>

      <FormLabel>
        <template>{{ $t('form_label_min_removal') }}</template>
      </FormLabel>
    </div>
    <div class="half-split-container">
      <FormLabel>
        <template v-slot:label-description>
          {{ $t('form_label_description_min_approval') }}
        </template>
      </FormLabel>

      <FormLabel>
        <template v-slot:label-description>
          {{ $t('form_label_description_min_removal') }}
        </template>
      </FormLabel>
    </div>

    <div class="half-split-container">
      <slot />
    </div>

    <ValidationProvider
      vid="cosigners"
      :name="$t('cosigners')"
      class="new-status-display-container mx-1"
      :rules="'required|is:OK'"
      tag="div"
    >
      <input v-show="false" v-model="areInputsValid">
      <span :class="[ 'description-text', areInputsValid === 'OK' ? '' : 'red' ]">
        {{ message }}
      </span>
    </ValidationProvider>
  </div>
</template>

<script lang="ts">
import {ApprovalAndRemovalInputDisplayTs} from './ApprovalAndRemovalInputDisplayTs'
export default class ApprovalAndRemovalInputDisplay extends ApprovalAndRemovalInputDisplayTs { }
</script>

<style lang="less" scoped>
.approval-removal-container {
  width: 6rem;
}

.new-status-display-container {
  text-align: center;
}
</style>
