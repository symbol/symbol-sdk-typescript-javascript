<template>
  <div class="aliasTable">
    <Modal :title="aliasListIndex >= 0?$t('unbind'): $t('binding_alias')"
           v-model="show"
           :transfer="false"
           @on-cancel="closeModel"
           class="alias_bind_dialog">

      <div class="input_content">
        <div class="title">{{$t('address')}}</div>
        <div class="input_area">
          <p v-if="aliasListIndex >= 0" class="unLinkP">{{formItems.address}}</p>
          <input type="text" v-model="formItems.address" v-else>
        </div>
      </div>

      <div class="input_content">
        <div class="title">{{$t('alias')}}</div>
        <div class="input_area">
          {{activeNamespace.label}}
        </div>
      </div>

      <div class="input_content">
        <div class="title">{{$t('fee')}}</div>
        <Select
                class="fee-select"
                data-vv-name="fee"
                v-model="formItems.feeSpeed"
                v-validate="'required'"
                :data-vv-as="$t('fee')"
                :placeholder="$t('fee')"
        >
          <Option v-for="item in defaultFees" :value="item.speed" :key="item.speed">
            {{$t(item.speed)}} {{ `(${item.value} ${XEM})` }}
          </Option>
        </Select>
      </div>

      <div class="input_content">
        <div class="title">{{$t('password')}}</div>
        <div class="input_area">
          <input type="password" v-model="formItems.password" :placeholder="$t('please_enter_your_wallet_password')">
        </div>
      </div>

      <div class="button_content">
        <span class="cancel pointer" @click="closeModel">{{$t('cancel')}}</span>
        <span :class="['cancel', 'checkBtn', isCompleteForm?'pointer':'not_allowed']" @click="submit()">{{aliasListIndex >= 0?$t('unbind'):$t('bind')}}</span>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
    import {NamespaceAddressAliasDialogTs} from '@/views/service/namespace/namespace-function/namespace-list/namespace-address-alias-dialog/NamespaceAddressAliasDialogTs.ts'

    export default class NamespaceAddressAliasDialog extends NamespaceAddressAliasDialogTs {

    }
</script>
<style lang="less">
  @import "NamespaceAddressAliasDialog.less";
</style>
