<template>
  <ValidationObserver
    v-slot="{ handleSubmit }"
    tag="div"
    class="form-line-container"
  >
    <form 
      onsubmit="event.preventDefault()"
      @keyup.enter="handleSubmit(setExplorerLink)"
    >
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
        <div class="button-container">
          <button
            class="button-style validation-button right-side-button"
            @click="handleSubmit(setExplorerLink)"
          >
            {{ $t('confirm') }}
          </button>
        </div>
      </div>
    </form>
  </ValidationObserver>
</template>

<script>
import { ExplorerUrlSetterTs } from './ExplorerUrlSetterTs'
import '@/styles/forms.less'

export default class ExplorerUrlSetter extends ExplorerUrlSetterTs {}
</script>
