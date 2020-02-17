<template>
  <div class="form-line-container">
    <FormLabel>{{ $t('parent_namespace') }}</FormLabel>
    <ValidationProvider
      v-slot="{ errors }"
      mode="lazy"
      vid="chosenValue"
      :name="$t('namespace_name')"
      :rules="'required'"
      tag="div"
      class="inline-container"
    >
      <ErrorTooltip :errors="errors">
        <div class="full-width-item-container">
          <Select
            v-model="chosenValue"
            class="select-size select-style"
            :placeholder="$t('Select_a_namespace')"
          >
            <Option
              v-for="(info) in namespaces"
              :key="getName(info)"
              :value="getName(info)"
            >
              {{ getName(info) }}
            </Option>
          </Select>
        </div>
      </errortooltip>
    </ValidationProvider>
  </div>
</template>

<script lang="ts">
import { NamespaceSelectorTs } from './NamespaceSelectorTs'
export default class NamespaceSelector extends NamespaceSelectorTs {}
</script>
