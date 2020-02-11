<template>
  <div>
    <FormLabel>{{ $t('set_explorer_link') }}</FormLabel>
    <div class="inline-container">
      <ValidationProvider
        v-slot="{ errors }"
        mode="lazy"
        vid="explorerUrl"
        :name="$t('Explorer_Url')"
        :rules="validationRules.url"
        tag="div"
        class="full-width-item-container"
      >
        <ErrorTooltip :errors="errors">
          <AutoComplete
            v-model="chosenExplorerUrl"
            :placeholder="$t('node')"
            :data="defaultExplorerLinkList"
            class="auto-complete-size auto-complete-style"
          />
        </ErrorTooltip>
      </ValidationProvider>
    </div>
  </div>
</template>

<script>
import {ExplorerUrlSetterTs} from './ExplorerUrlSetterTs'
export default class ExplorerUrlSetter extends ExplorerUrlSetterTs {}
</script>
