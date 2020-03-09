<template>
  <div class="multisig-form-main-container">
    <div class="main-out-container">
      <div class="left-container">
      <div class="form-section">
        <slot name="form-section" />
      </div>
    </div>
    <!-- <div class="right-container xym-outline">
      <slot name="right-section" />
    </div> -->
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
  position: relative;
  height: 100%;
  width: 100%;
  padding: 0.2rem 0 0 0.2rem;
  display: grid;
  grid-template-columns: 12.7rem auto;
  grid-template-rows: 100%;
  .main-out-container{
    position: relative;
    width: 100%;
    height: 100%;
    padding: 0.2rem 0 0.35rem 0.2rem;
  }
  .left-container {
    width: 100%;
    padding: 0.3rem 0.5rem;
    background-color: white;
  }

  .right-container {
    padding-left: 0.2rem;
  }
}
</style>
