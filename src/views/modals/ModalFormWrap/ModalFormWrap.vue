<template>
  <div class="container">
    <Modal v-model="show" :title="`${$t(title)}`" class-name="modal-container">
      <slot name="form" />
      <div slot="footer" class="modal-form-wrap-footer" />
    </Modal>
  </div>
</template>

<script lang="ts">
// external dependencies
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class ModalFormWrap extends Vue {
  /**
   * Modal title
   * @type {string}
   */
  @Prop({ default: '' }) title: string
  
  /**
   * Modal visibility state from parent
   * @type {string}
   */
  @Prop({ default: false }) visible: boolean

  /**
   * Internal visibility state
   * @type {boolean}
   */
  public get show(): boolean {
    return this.visible
  }

  /**
   * Emits close event
   */
  public set show(val) {
    if (!val) {
      this.$emit('close')
    }
  }
}
</script>
