<template>
  <div>
    <form action="setExplorerLink" onsubmit="event.preventDefault()" @keyup.enter="setExplorerLink">
      <div class="explorer-link-form-item">
        <FormLabel>{{ $t('set_explorer_link') }}</FormLabel>
        <div class="form-item-line">
          <ErrorTooltip field-name="nodeUrl">
            <AutoComplete
              v-model="chosenExplorerUrl"
              v-validate="validationRules.nodeUrl"
              :placeholder="$t('node')"
              :data-vv-as="$t('node')"
              data-vv-name="nodeUrl"
              :data="defaultExplorerLinkList"
              class="auto-complete"
            />
          </ErrorTooltip>
          <div class="button-container">
            <span class="confirmation-button" @click="setExplorerLink">{{ $t('confirm') }}</span>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { ExplorerUrlSetterTs } from "./ExplorerUrlSetterTs";
import "./ExplorerUrlSetter.less";

export default class ExplorerUrlSetter extends ExplorerUrlSetterTs {}
</script>
