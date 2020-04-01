<template>
  <FormRow>
    <template v-slot:label>
      {{ $t(label) }}:
    </template>
    <template v-slot:inputs>
      <ValidationProvider
        v-slot="{ errors }"
        vid="form_label_duration"
        :name="$t(label)"
        :rules="validationRule"
        tag="div"
        class="inputs-container"
      >
        <ErrorTooltip :errors="errors">
          <div class="chosenValue-container">
            <input v-model="chosenValue" class="input-style input-size" type="number">
            <span
              v-if="showRelativeTime"
              class="relative-time"
            >{{ $t('Estimated_period_of_validity') }}&nbsp;{{ relativeTime }}</span>
          </div>
        </ErrorTooltip>
      </ValidationProvider>
    </template>
  </FormRow>
</template>

<script lang="ts">
import {DurationInputTs} from './DurationInputTs'
export default class DurationInput extends DurationInputTs {}
</script>
<style lang="less" scoped>
  @import './DurationInput.less';
</style>
