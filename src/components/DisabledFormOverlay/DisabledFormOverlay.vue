<template>
  <div v-if="alert.length" class="multisig_ban_container">
    <Alert type="error">
      {{ $t(alert) }}
    </Alert>
    <div class="is_multisig un_click radius" />
  </div>
</template>

<script lang="ts">
import {DisabledFormOverlayTs} from './DisabledFormOverlayTs'
import "./DisabledFormOverlay.less";

export default class DisabledFormOverlay extends DisabledFormOverlayTs {}
</script>
