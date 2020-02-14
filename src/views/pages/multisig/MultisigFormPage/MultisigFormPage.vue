<template>
  <div class="multisig-form-main-container">
    <div class="left-container">
      <div class="form-section">
        <slot name="form-section" />
      </div>
    </div>
    <div class="right-container">
      <slot name="right-section" />
    </div>
  </div>
</template>
<script>
// external dependencies
import {Component, Vue} from 'vue-property-decorator'

@Component
export default class MultisigFormPage extends Vue {}
</script>

<style lang="less" scoped>
.multisig-form-main-container {
  background-color: lightslategrey;
  display: grid;
  grid-template-columns: 12.7rem auto;
  grid-template-rows: 100%;
  height: 100%;
  overflow: hidden;

  .left-container {
    padding: 0.3rem 0.5rem;
    background-color: white;
  }

  .right-container {
    padding-left: 0.2rem;
  }
}
</style>
