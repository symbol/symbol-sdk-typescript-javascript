<template>
  <div class="check-deploy-dialog-wrap">
    <Modal
      v-model="show"
      class-name="vertical-center-modal"
      :footer-hide="true"
      :transfer="false"
      @on-cancel="show = false"
    >
      <div slot="header" class="check-deploy-dialog-header">
        <span class="title">{{ $t(harvestingTitleList[currentTabIndex - 1]) }}</span>
      </div>
      <div class="check-deploy-dialog-body">
        <div class="step-item">
          <div class="progress radius" :style="{background:'url(' + harvestingStepBarList[currentTabIndex - 1] + ')'}">
            <span
              v-for="(text,index) in harvestingStepList"
              :key="index"
              :class="getStepTextClassName(index + 1)"
            >{{ $t(text) }}</span>
          </div>

          <div v-if="currentTabIndex === harvestingSteps.AccountLink" class="stepItem1">
            <ProxySetting
              @backClicked="show = false"
              @nextClicked="currentTabIndex = harvestingSteps.PersistentDelegationRequest"
            />
          </div>

          <div v-if="currentTabIndex === harvestingSteps.PersistentDelegationRequest" class="stepItem2">
            <NetworkSetting
              @backClicked="currentTabIndex = harvestingSteps.AccountLink"
              @nextClicked="currentTabIndex = harvestingSteps.ActivateRemote"
            />
          </div>

          <div v-if="currentTabIndex === harvestingSteps.ActivateRemote" class="stepItem3">
            <DelegateRequests
              @backClicked="currentTabIndex = harvestingSteps.PersistentDelegationRequest"
              @nextClicked="show = false;"
            />
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>


<script lang="ts">
import {DelegatedDialogTs} from '@/components/forms/delegated-dialog/DelegatedDialogTs.ts'

export default class DelegatedDialog extends DelegatedDialogTs {
}
</script>

<style scoped>
</style>
