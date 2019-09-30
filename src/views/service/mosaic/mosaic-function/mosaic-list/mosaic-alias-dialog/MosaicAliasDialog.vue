<template>
  <div class="mosaicAliasDialogWrap">
    <Modal
            v-model="show"
            class-name="vertical-center-modal"
            :footer-hide="true"
            :width="1000"
            :transfer="false"
            @on-cancel="mosaicAliasDialogCancel">
      <div slot="header" class="mosaicAliasDialogHeader">
        <span class="title">{{$t('binding_alias')}}</span>
      </div>
      <div class="mosaicAliasDialogBody">
        <div class="stepItem1">
          <Form :model="formItems">
            <FormItem :label="$t('mosaic_ID')">
              <p class="mosaicTxt">{{itemMosaic.hex}}</p>
            </FormItem>
            <FormItem :label="$t('alias_selection')">
              <Select v-model="formItems.aliasName" required>
                <Option :value="item.value" v-for="(item, index) in aliasNameList" :key="index">{{item.label}}</Option>
              </Select>
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
                  {{$t(item.speed)}} {{ `(${item.value} ${XEM})` }}
                </Option>
              </Select>
            </FormItem>
            <FormItem :label="$t('password')">
              <Input v-model="formItems.password" type="password" required
                     :placeholder="$t('please_enter_your_wallet_password')" />
            </FormItem>
            <FormItem class="button_update">
              <Button type="success" :class="[isCompleteForm?'pointer':'not_allowed']" @click="submit">{{$t('bind')}}</Button>
            </FormItem>
          </Form>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
    import './MosaicAliasDialog.less'
    // @ts-ignore
    import {MosaicAliasDialogTs} from '@/views/service/mosaic/mosaic-function/mosaic-list/mosaic-alias-dialog/MosaicAliasDialogTs.ts'

    export default class MosaicAliasDialog extends MosaicAliasDialogTs {

    }
</script>

<style scoped>

</style>
