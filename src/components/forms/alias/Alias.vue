<template>
  <div class="aliasTable" @keyup.enter="submit">
    <Modal
           v-model="show"
           :transfer="false"
           @on-cancel="show = false"
           class="alias_bind_dialog">
      <div slot="header" class="bindHeader">
        <span class="title" v-if= bind >{{$t('bind')}}</span>
        <span class="title" v-else>{{$t('unbind')}}</span>
      </div>
      <DisabledForms></DisabledForms>
      <div v-if="!bind" class="unbind_text">
        <span >{{$t('unbind')}}</span>
        <span class="color_text">{{target}}</span>
        <span class="from-span">{{$t('fromWhere')}}</span>
        <span class="color_text">{{alias}}</span>
      </div>
      <div v-if="bind && !fromNamespace" class="input_content">
        <div class="title">{{ address ? $t('address') : $t('mosaic') }}</div>
        <div class="input_area">
          <p>{{ target }}</p>
        </div>
      </div>

      <div v-if="bind && fromNamespace" class="input_content">
        <div class="title">{{ $t('namespace') }}</div>
        <div class="input_area">
          <p>{{ namespace.name }}</p>
        </div>
      </div>

      <div v-if="bind && fromNamespace && !restrictedBindType"
          class="input_content">
        <div class="title">{{ $t('Alias_type') }}</div>
        <RadioGroup v-model="bindType" class="input_radio">
          <Radio :label="bindTypes.address" />
          <Radio :label="bindTypes.mosaic" />
        </RadioGroup>
      </div>

      <div v-if="bind && fromNamespace && bindType === bindTypes.address" class="input_content">
        <div class="title">{{ $t('address') }}</div>
        <div class="input_area">
          <input v-model="target" :placeholder="$t('address')">
        </div>
      </div>

      <div v-if="bind && fromNamespace && bindType === bindTypes.mosaic"
          class="input_content">
        <div class="title">{{ $t('mosaic') }}</div>
        <Select
                class="fee-select input_select"
                data-vv-name="mosaic"
                v-model="target"
                v-validate="'required'"
                :data-vv-as="$t('mosaic')"
                :placeholder="$t('mosaic')"
        >
          <Option
            v-for="(hex, index) in linkableMosaics"
            :value="hex"
            :key="`${index}${hex}`"
          >
            {{ hex }}
          </Option>
        </Select>
      </div>

      <div v-if="bind && !fromNamespace"
          class="input_content">
        <div class="title">{{ $t('namespace') }}</div>
        <Select
                class="fee-select input_select"
                data-vv-name="namespace"
                v-model="alias"
                v-validate="'required'"
                :data-vv-as="$t('namespace')"
                :placeholder="$t('namespace')"
        >
          <Option
            v-for="(name, index) in linkableNamespaces"
            :value="name"
            :key="`${index}${name}`"
          >
            {{ name }}
          </Option>
        </Select>
      </div>

      <div class="input_content">
        <div class="title">{{$t('fee')}}</div>
        <Select
                class="fee-select input_select"
                data-vv-name="fee"
                v-model="formItems.feeSpeed"
                v-validate="'required'"
                :data-vv-as="$t('fee')"
                :placeholder="$t('fee')"
        >
          <Option v-for="item in defaultFees" :value="item.speed" :key="item.speed">
            {{$t(item.speed)}} {{ `(${item.value} ${networkCurrency.ticker})` }}
          </Option>
        </Select>
      </div>
     
      <div class="button_content">
        <span class="cancel pointer" @click="show = false">{{$t('cancel')}}</span>
        <span class="bind checkBtn pointer" @click="submit()">{{bind ? $t('bind') : $t('unbind')}}</span>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
    import {AliasTs} from './AliasTs'
    export default class Alias extends AliasTs {}
</script>
<style lang="less">
  @import "Alias.less";
</style>
