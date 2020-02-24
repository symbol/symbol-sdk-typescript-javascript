<template>
  <FormRow>
    <template v-slot:inputs>
      <ValidationProvider
        vid="cosigners"
        :name="$t('cosigners')"
        :rules="'required|is:OK'"
        tag="div"
        class="row-centered-message"
      >
        <input v-show="false" v-model="areInputsValid">
        <span :class="[areInputsValid === 'OK' ? '' : 'red']">
          {{ message }}
        </span>
      </ValidationProvider>
    </template>
  </FormRow>
</template>

<script lang="ts">
import {ApprovalAndRemovalInputDisplayTs} from './ApprovalAndRemovalInputDisplayTs'
export default class ApprovalAndRemovalInputDisplay extends ApprovalAndRemovalInputDisplayTs { }
</script>
