<template>
  <div class="rows-scroll-container">
    <FormRow>
      <template v-slot:inputs>
        <div
          v-for="{publicKey, address, addOrRemove} in modifications"
          :key="publicKey"
          class="row-cosignatory-modification-display inputs-container gray-background mx-1"
        >
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
          <div class="cosignatory-address-container">
            <span>{{ address }}</span>
          </div>
          <span class="delete-icon" @click="$emit('on-remove-cosignatory-modification', publicKey)" />
        </div>
      </template>
    </FormRow>
  </div>
</template>

<script lang="ts">
import {CosignatoryModificationsDisplayTs} from './CosignatoryModificationsDisplayTs'

export default class CosignatoryModificationsDisplay extends CosignatoryModificationsDisplayTs {}
</script>
