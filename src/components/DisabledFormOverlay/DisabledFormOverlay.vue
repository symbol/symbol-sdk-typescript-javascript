<template>
  <div v-if="false" class="multisig_ban_container">
    <!-- @TODO: restaure when Network Currency initialization works
    <div v-if="alert" class="multisig_ban_container">  -->
    <Alert type="error">
      {{ $t(alert) }}
    </Alert>
    <div class="is_multisig un_click radius" />
  </div>
</template>

<script lang="ts">
import {DisabledFormOverlayTs} from '@/components/DisabledFormOverlay/DisabledFormOverlayTs.ts'
import "./DisabledFormOverlay.less";

export default class DisabledFormOverlay extends DisabledFormOverlayTs {}
</script>
