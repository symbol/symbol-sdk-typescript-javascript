<template>
  <div v-if="active" class="multisig_ban_container">
    <Alert type="error">
      {{ $t(alertMessage) }}
    </Alert>
    <div class="is_multisig un_click radius" />
  </div>
</template>

<script lang="ts">
import {DisabledFormOverlayTs} from '@/components/DisabledFormOverlay/DisabledFormOverlayTs.ts'
import "./DisabledFormOverlay.less";

export default class DisabledFormOverlay extends DisabledFormOverlayTs {}
</script>
