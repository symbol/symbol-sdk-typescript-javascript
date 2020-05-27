<template>
  <div class="create-profile-wrapper radius">
    <div class="inner-container">
      <p class="create-profile-box">
        {{ $t('generate_a_new_profile') }}
      </p>
      <div class="step-bar-container">
        <img :src="$route.meta.icon" />
        <div class="step-text-container">
          <span v-for="(text, index) in StepBarTitleList" :key="index" :class="getStepClassName(index)">{{
            $t(text)
          }}</span>
        </div>
      </div>
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import CreateProfileTs from './CreateProfileTs'
import './CreateProfile.less'

export default class CreateProfile extends CreateProfileTs {}
</script>
