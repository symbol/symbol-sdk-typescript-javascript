<template>
  <div v-if="!disabled" class="round-button" @click="$emit('click')">
    <Icon type="md-add-circle" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class ButtonAdd extends Vue {
  @Prop({ default: false }) disabled: boolean
}
</script>
