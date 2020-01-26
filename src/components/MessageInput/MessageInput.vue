<template>
  <ErrorTooltip field-name="remarks">
    <textarea
      v-model="value"
      v-validate="validationRules.message"
      class="radius"
      :placeholder="$t('Please_enter_notes')"
      data-vv-name="remarks"
    />
  </ErrorTooltip>
</template>

<script lang="ts">
import {MessageInputTs} from './MessageInputTs'
import './MessageInput.less'

export default class MessageInput extends MessageInputTs {}
</script>
