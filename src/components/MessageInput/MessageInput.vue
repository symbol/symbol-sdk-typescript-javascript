<template>
  <div class="remark flex_center">
    <span class="title">{{ $t('message') }}</span>
    <span class="textarea_container flex_center value radius">

      <ErrorTooltip field-name="remarks">
        <textarea
          v-model="value"
          v-validate="validationRules.message"
          class="radius"
          :placeholder="$t('Please_enter_notes')"
          data-vv-name="remarks"
        />
      </ErrorTooltip>

    </span>

  </div>
</template>

<script lang="ts">
import {MessageInputTs} from './MessageInputTs'

export default class MessageInput extends MessageInputTs {}
</script>
