<template>
  <div>
    {{ $t(label) }}
    <Tooltip v-if="hint1 !== ''" placement="right">
      <div slot="content">
        <p v-if="hint1 !== ''">{{ $t(hint1) }}</p>
        <p v-if="hint2 !== ''">{{ $t(hint2) }}</p>
      </div>
      <Icon type="ios-help-circle-outline" class="tip-icon"/>
    </Tooltip>
    <div class="field_container">
      <Tooltip
              :always="errored"
              :disabled="!errored"
              :content="displayedError"
              placement="bottom-start"
      >
        <div class="gray_content" :style="errored ? 'border-color:red' : ''">
          <input
                  class="absolute"
                  :type="fieldType"
                  :placeholder="$t(placeholder)"
                  :data-vv-as="$t(fieldName)"
                  :data-vv-name="fieldName"
                  v-validate="validation"
                  v-model.lazy="formModel[fieldName]"
          />
        </div>
      </Tooltip>
    </div>
  </div>
</template>
<script lang="ts">
    import {FormInputTs} from './FormInputTs'

    export default class FormInput extends FormInputTs {
    }
</script>
<style scoped lang="less">
  @import "FormInput.less";
</style>
