<template>
  <FormRow>
    <template v-slot:label>
      {{ $t('message') }}:
    </template>
    <template v-slot:inputs>
      <ValidationProvider
        v-slot="{ errors }"
        mode="lazy"
        vid="message"
        :name="$t('message')"
        :rules="validationRules.message"
        tag="div"
        class="inputs-container"
      >
        <ErrorTooltip :errors="errors">
          <textarea
            v-model="plain"
            class="textarea-size textarea-style"
            :placeholder="$t('Please_enter_notes')"
          />
        </ErrorTooltip>
      </ValidationProvider>
    </template>
  </FormRow>
</template>

<script lang="ts">
import {MessageInputTs} from './MessageInputTs'
export default class MessageInput extends MessageInputTs {}
</script>
