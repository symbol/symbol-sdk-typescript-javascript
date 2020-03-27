<template>
  <div>
    <FormRow 
      v-if="!(multisig && multisig.cosignatories.length) && !addModifications.length && !removeModifications.length"
    >
      <template v-slot:inputs>
        <div>
          <div class="row-cosignatory-modification-display inputs-container empty-message mx-1">
            <span>{{ $t('message_empty_cosignatories') }}</span>
          </div>
        </div>
      </template>
    </FormRow>

    <div class="rows-scroll-container mt-0">
      <!-- COSIGNATORIES -->
      <FormRow v-if="cosignatories && cosignatories.length">
        <template v-slot:inputs>
          <div
            v-for="({publicKey, address}, index) in cosignatories"
            :key="index"
            :class="[ 
              'row-cosignatory-modification-display',
              'inputs-container',
              'accent-pink-background',
              'pl-2',
              'pr-2',
              'mx-1',
            ]"
          >
            <div class="cosignatory-address-container">
              <span>{{ address }}</span>
            </div>
            <span v-if="modifiable" class="delete-icon" @click="onRemoveCosignatory(publicKey)" />
            <span v-else>&nbsp;</span>
          </div>
        </template>
      </FormRow>

      <!-- REMOVED COSIGNATORIES -->
      <FormRow v-if="modifiable && removeModifications.length">
        <template v-slot:label>
          {{ $t('form_label_removed_cosignatories') }}
        </template>
        <template v-slot:inputs>
          <div
            v-for="({publicKey, address}, index) in removeModifications"
            :key="index"
            :class="[
              'row-cosignatory-modification-display',
              'inputs-container',
              'mx-1',
              'pl-2',
              'pr-2',
              'red-background',
            ]"
          >
            <div class="cosignatory-address-container">
              <span class="cosignatory-removed">{{ address }}</span>
            </div>
            <span class="delete-icon" @click="onUndoRemoveModification(publicKey)" />
          </div>
        </template>
      </FormRow>

      <!-- ADDED COSIGNATORIES -->
      <FormRow v-if="modifiable && addModifications.length">
        <template v-slot:label>
          {{ $t('form_label_new_cosignatories') }}
        </template>
        <template v-slot:inputs>
          <div
            v-for="({publicKey, address}, index) in addModifications"
            :key="index"
            :class="[
              'row-cosignatory-modification-display',
              'inputs-container',
              'mx-1',
              'pl-2',
              'pr-2',
              'green-background',
            ]"
          >
            <div class="cosignatory-address-container">
              <span>{{ address }}</span>
            </div>
            <span class="delete-icon" @click="onRemoveModification(publicKey)" />
          </div>
        </template>
      </FormRow>

      <AddCosignatoryInput
        v-if="isAddingCosignatory"
        @added="onAddCosignatory"
      />
      <div v-if="!isAddingCosignatory" class="row-cosignatory-modification-display inputs-container link mx-1">
        <a href="#" @click="isAddingCosignatory = true">{{ $t('form_label_add_cosignatory') }}</a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {MultisigCosignatoriesDisplayTs} from './MultisigCosignatoriesDisplayTs'

export default class MultisigCosignatoriesDisplay extends MultisigCosignatoriesDisplayTs {}
</script>
