<template>
  <div class="mosaicUnAliasDialogWrap">
    <Modal
            v-model="show"
            class-name="vertical-center-modal"
            :footer-hide="true"
            :width="1000"
            :transfer="false"
            @on-cancel="mosaicAliasDialogCancel">
      <div slot="header" class="mosaicAliasDialogHeader">
        <span class="title">{{$t('unbind')}}</span>
      </div>
      <div class="mosaicAliasDialogBody">
        <div class="stepItem1">
          <Form :model="formItems">
            <FormItem :label="$t('mosaic_ID')">
              <p class="mosaicTxt">{{activeNamespace.aliasTarget}}</p>
            </FormItem>
            <FormItem :label="$t('unbind_alias')">
              <p class="mosaicTxt">{{activeNamespace.label}}</p>
            </FormItem>
            <FormItem :label="$t('fee')">
              <Select
                      class="fee-select"
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
            </FormItem>
            <FormItem :label="$t('password')">
              <Input v-model="formItems.password" type="password" required
                     :placeholder="$t('please_enter_your_wallet_password')"></Input>
            </FormItem>
            <FormItem class="button_update">
              <Button type="success" @click="submit">{{$t('unbind')}}</Button>
            </FormItem>
          </Form>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
    import './NamespaceUnAliasDialog.less'
    import {NamespaceUnAliasDialogTs} from '@/views/service/namespace/namespace-function/namespace-list/namespace-unAlias-dialog/NamespaceUnAliasDialogTs.ts'

    export default class NamespaceUnAliasDialog extends NamespaceUnAliasDialogTs {

    }
</script>

<style scoped>

</style>
