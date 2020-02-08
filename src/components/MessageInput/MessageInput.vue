<template>
  <div class="form-line-container">
    <FormLabel>{{ $t('message') }}</FormLabel>
    <div class="inline-container">
      <ValidationProvider
        v-slot="{ errors }"
        mode="lazy"
        vid="message"
        :name="$t('message')"
        :rules="validationRules.message"
        tag="div"
        class="full-width-item-container"
      >
        <ErrorTooltip :errors="errors">
          <textarea
            v-model="plain"
            class="full-width-item-container textarea-size textarea-style"
            :placeholder="$t('Please_enter_notes')"
          />
        </ErrorTooltip>
      </ValidationProvider>
    </div>
  </div>
</template>

<script lang="ts">
import {MessageInputTs} from './MessageInputTs'
export default class MessageInput extends MessageInputTs {}
</script>
