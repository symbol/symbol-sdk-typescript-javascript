<template>
  <div v-if="!disabled" class="round-button remove-button" @click="$emit('click')">
    <Icon type="md-remove-circle" />
  </div>
</template>

<script lang="ts">
import {Component, Vue, Prop} from 'vue-property-decorator'

@Component
export default class ButtonRemove extends Vue {
  @Prop({ default: false }) disabled: boolean
}
</script>
