<template>
  <div class="spinner">
    <div class="bounce1" />
    <div class="bounce2" />
    <div class="bounce3" />
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator'
import './SpinnerDots.less'

@Component
export default class SpinnerDots extends Vue { }
</script>
