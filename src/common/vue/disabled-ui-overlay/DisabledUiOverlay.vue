<template>
  <div class="disabledUiOverlay">
    <Modal
            v-if="show"
            v-model="show"
            class-name="vertical-center-modal"
            :footer-hide="true"
            :transfer="false"
            :closable="false"
            :mask-closable="false"
            >

      <div class="uiDisabledMessage">{{$t(message)}}</div>
    </Modal>

  </div>
</template>

<script lang="ts">
    import "./DisabledUiOverlay.less"
    import {DisabledUiOverlayTs} from '@/common/vue/disabled-ui-overlay/DisabledUiOverlayTs.ts'

    export default class DisabledUiOverlay extends DisabledUiOverlayTs {
    }
</script>

<style scoped>
</style>
