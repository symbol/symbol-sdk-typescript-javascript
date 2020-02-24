<template>
  <FormRow>
    <template v-slot:label>
      {{ $t(label) }}:
    </template>
    <template v-slot:inputs>
      <ValidationProvider
        v-slot="{ errors }"
        mode="lazy"
        vid="chosenValue"
        :name="$t('form_label_namespace_name')"
        :rules="'required'"
        tag="div"
        class="inputs-container select-container"
      >
        <ErrorTooltip :errors="errors">
          <Select
            v-model="chosenValue"
            class="select-size select-style"
            :placeholder="$t('Select_a_namespace')"
          >
            <Option
              v-for="(namespaceInfo) in namespaces"
              :key="getName(namespaceInfo)"
              :value="getName(namespaceInfo)"
            >
              {{ getName(namespaceInfo) }}
            </Option>
          </Select>
        </errortooltip>
      </ValidationProvider>
    </template>
  </FormRow>
</template>

<script lang="ts">
import { NamespaceSelectorTs } from './NamespaceSelectorTs'
export default class NamespaceSelector extends NamespaceSelectorTs {}
</script>
