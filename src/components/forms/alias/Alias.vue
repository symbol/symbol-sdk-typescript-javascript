<template>
  <div class="aliasTable">
    <Modal v-model="show" :transfer="false" @on-cancel="show = false" class="alias_bind_dialog">
      <form action="submit" onsubmit="event.preventDefault()" @keyup.enter="submit">
        <div slot="header" class="bindHeader">
          <span class="title" v-if="bind">{{$t('bind')}}</span>
          <span class="title" v-else>{{$t('unbind')}}</span>
        </div>
        <DisabledForms />
        <div v-if="!bind" class="unbind_text">
          <span>{{$t('unbind')}}</span>
          <span class="color_text">{{target}}</span>
          <span class="from-span">{{$t('fromWhere')}}</span>
          <span class="color_text">{{alias}}</span>
        </div>
        <div v-if="bind && !fromNamespace" class="input_content">
          <div class="title justify_text">{{ address ? $t('address') : $t('mosaic') }}</div>
          <div class="input_area">
            <p>{{ target }}</p>
          </div>
        </div>

        <div v-if="bind && fromNamespace" class="input_content">
          <div class="title justify_text">{{ $t('namespace') }}</div>
          <div class="input_area">
            <p>{{ namespace.name }}</p>
          </div>
        </div>

        <div v-if="bind && fromNamespace && !restrictedBindType" class="input_content">
          <div class="title justify_text">{{ $t('Alias_type') }}</div>
          <RadioGroup v-model="bindType" class="input_radio">
            <Radio :label="BindTypes.ADDRESS" />
            <Radio :label="BindTypes.MOSAIC" />
          </RadioGroup>
        </div>

        <div v-if="bind && fromNamespace && bindType === BindTypes.ADDRESS" class="input_content">
          <div class="title justify_text">{{ $t('address') }}</div>
          <div class="input_area">
            <ErrorTooltip fieldName="address" class="flex-8" placementOverride="top">
              <input
                v-model="target"
                :placeholder="$t('address')"
                data-vv-name="address"
                v-validate="validation.address"
                :data-vv-as="$t('address')"
              />
            </ErrorTooltip>
          </div>
        </div>

        <div v-if="bind && fromNamespace && bindType === BindTypes.MOSAIC" class="input_content">
          <div class="title justify_text">{{ $t('mosaic') }}</div>
          <ErrorTooltip fieldName="mosaicId" class="flex-8" placementOverride="top">
            <Select
              v-model="target"
              class="fee-select input_select"
              data-vv-name="mosaicId"
              v-validate="'required'"
              :data-vv-as="$t('mosaic')"
              :placeholder="$t('mosaic')"
            >
              <Option
                v-for="(hex, index) in linkableMosaics"
                :value="hex"
                :key="`${index}${hex}`"
              >{{ hex }}</Option>
            </Select>
          </ErrorTooltip>
        </div>

        <div v-if="bind && !fromNamespace" class="input_content">
          <div class="title justify_text">{{ $t('namespace') }}</div>

          <ErrorTooltip fieldName="namespace" class="flex-8" placementOverride="top">
            <Select class="fee-select input_select"
              data-vv-name="namespace"
              v-model="alias"
              v-validate="'required'"
              :data-vv-as="$t('namespace')"
              :placeholder="$t('namespace')" >
              <Option
                v-for="(name, index) in linkableNamespaces"
                :value="name"
                :key="`${index}${name}`"
              >{{ name }}</Option>
            </Select>
          </ErrorTooltip>
        </div>

        <div class="input_content">
          <div class="title justify_text">{{$t('fee')}}</div>
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

        <div class="button_content">
          <span class="radius cancel pointer" @click="show = false">{{$t('cancel')}}</span>
          <span class="radius bind checkBtn pointer" @click="submit()">{{bind ? $t('bind') : $t('unbind')}}</span>
        </div>
        <input
          v-show="false"
          v-model="currentAccount"
          v-validate
          disabled
          data-vv-name="currentAccount"
        />
      </form>
    </Modal>
  </div>
</template>

<script lang="ts">
import { AliasTs } from '@/components/forms/alias/AliasTs.ts';
export default class Alias extends AliasTs {}
</script>
<style lang="less">
@import "Alias.less";
</style>
