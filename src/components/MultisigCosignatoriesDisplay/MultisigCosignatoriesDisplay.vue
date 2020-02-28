<template>
  <div class="rows-scroll-container mt-0">
    <!-- COSIGNATORIES -->
    <FormRow v-if="cosignatories && cosignatories.length">
      <template v-slot:inputs>
        <div
          v-for="({publicKey, address}, index) in cosignatories"
          :key="index"
          class="row-cosignatory-modification-display inputs-container accent-pink-background mx-1 text_select"
        >
          <div :class="{
            'cosignatory-address-container': true,
          }">
            <span>{{ address }}</span>
          </div>
          <span v-if="modifiable" class="delete-icon" @click="onRemoveCosignatory(publicKey)" />
          <span v-else>&nbsp;</span>
        </div>
      </template>
    </FormRow>
    <FormRow v-else-if="!addModifications.length && !removeModifications.length">
      <template v-slot:inputs>
        <div class="row-cosignatory-modification-display inputs-container empty-message mx-1">
          <span>{{$t('message_empty_cosignatories')}}</span>
        </div>
      </template>
    </FormRow>

    <!-- REMOVED COSIGNATORIES -->
    <FormRow v-if="modifiable && removeModifications.length">
      <template v-slot:label>{{ $t('form_label_removed_cosignatories') }}</template>
      <template v-slot:inputs>
        <div
          v-for="({publicKey, address, addOrRemove}, index) in removeModifications"
          :key="index"
          :class="{
            'row-cosignatory-modification-display': true,
            'inputs-container': true,
            'mx-1': true,
            'text_select': true,
            'red-background': true,
          }"
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
      <template v-slot:label>{{ $t('form_label_new_cosignatories') }}</template>
      <template v-slot:inputs>
        <div
          v-for="({publicKey, address, addOrRemove}, index) in addModifications"
          :key="index"
          :class="{
            'row-cosignatory-modification-display': true,
            'inputs-container': true,
            'mx-1': true,
            'text_select': true,
            'green-background': true,
          }"
        >
          <div class="cosignatory-address-container">
            <span>{{ address }}</span>
          </div>
          <span class="delete-icon" @click="onRemoveModification(publicKey)" />
        </div>
      </template>
    </FormRow>

    <div class="ml-2">
      <AddCosignatoryInput v-if="isAddingCosignatory || !currentMultisigInfo"
        @added="onAddCosignatory"
      />
    </div>

    <div class="row-cosignatory-modification-display inputs-container link mx-1">
      <a href="#" @click="isAddingCosignatory = true">{{ $t('label_add_cosignatory') }}</a>
    </div>
  </div>
</template>

<script lang="ts">
import {MultisigCosignatoriesDisplayTs} from './MultisigCosignatoriesDisplayTs'

export default class MultisigCosignatoriesDisplay extends MultisigCosignatoriesDisplayTs {}
</script>
