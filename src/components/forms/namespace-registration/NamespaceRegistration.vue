<template>
  <div class="namespaceEditDialogWrap">
    <Modal
      v-model="show"
      class-name="vertical-center-modal"
      :footer-hide="true"
      :width="1000"
      :transfer="false"
      @on-cancel="show = false"
    >
      <DisabledForms />

      <div slot="header" class="namespaceEditDialogHeader">
        <span class="title">{{$t('update_namespace')}}</span>
      </div>

      <div class="namespaceEditDialogBody">
        <div class="stepItem1">
          <form
            action="submit"
            onsubmit="event.preventDefault()"
            @keyup.enter="submit"
            class="form-style"
          >
            <div class="input_content">
              <div class="title">{{ $t('namespace_name') }}</div>
              <div class="input_area no-border">
                <p>{{ currentNamespace.name }}</p>
              </div>
            </div>

            <div class="input_content">
              <div class="title">
                {{ expirationInfo.expired ? $t('Expired_for') : $t('Expires_in') }}
              </div>
              <div class="input_area no-border">
                <p :class="[expirationInfo.expired ? 'red' : '']">
                  {{
                    expirationInfo.expired
                      ? expirationInfo.remainingBeforeExpiration.time.substring(2)
                      : expirationInfo.remainingBeforeExpiration.time
                  }}
                  ({{ 'block' }}{{ expirationInfo.remainingBeforeExpiration.blocks }}
                  <NumberFormatting :numberOfFormatting="formatNumber(currentNamespace.endHeight - namespaceGracePeriodDuration)"></NumberFormatting>
                </p>
              </div>
            </div>

            <div class="input_content">
              <div class="title">{{ $t('New_duration') }}</div>
              <div class="input_area no-border">
                <ErrorTooltip fieldName="newDuration">
                  <input
                    data-vv-name="newDuration"
                    v-model="newExpirationBlock"
                    v-validate="validation.namespaceDuration"
                    :data-vv-as="$t('New_duration')"
                    v-show="false"
                  />
                  <p :class="[newExpirationBlock < currentHeight ? 'red' : '']">
                    {{ newExpiresIn }}
                    ({{ 'block' }}
                    <NumberFormatting :numberOfFormatting=" formatNumber(newExpirationBlock)"></NumberFormatting>
                  </p>
                </ErrorTooltip>
              </div>
            </div>

            <div class="input_content">
              <div class="title">{{ $t('duration') }}</div>
              <div class="input_area">
                <ErrorTooltip fieldName="delta">
                  <input
                    v-focus
                    data-vv-name="delta"
                    v-model="formItems.duration"
                    :data-vv-as="$t('duration')"
                    v-validate="validation.namespaceDuration"
                    :placeholder="$t('enter_the_number_of_blocks_integer')"
                  />
                </ErrorTooltip>
              </div>
            </div>

            <div class="input_content">
              <div class="title">{{$t('fee')}}</div>
              <div class="input_area">
                <Select
                  class="fee-select input_select"
                  data-vv-name="fee"
                  v-model="formItems.feeSpeed"
                  v-validate="'required'"
                  :data-vv-as="$t('fee')"
                  :placeholder="$t('fee')"
                >
                  <Option
                    v-for="item in defaultFees"
                    :value="item.speed"
                    :key="item.speed"
                  >{{$t(item.speed)}} {{ `(${item.value} ${networkCurrency.ticker})` }}</Option>
                </Select>
              </div>
            </div>

            <div class="button_content">
              <span class="bind checkBtn pointer" @click="submit()">{{$t('update')}}</span>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
// @ts-ignore
import { NamespaceRegistrationTs } from '@/components/forms/namespace-registration/NamespaceRegistrationTs.ts';
export default class NamespaceRegistration extends NamespaceRegistrationTs {}
</script>
