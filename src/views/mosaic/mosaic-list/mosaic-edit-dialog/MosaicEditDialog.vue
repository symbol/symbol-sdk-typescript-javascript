<template>
  <div class="mosaicEditDialogWrap">
    <Modal
            @keyup.enter.native="submit"
            v-model="show"
            class-name="vertical-center-modal"
            :footer-hide="true"
            :width="1000"
            :transfer="false"
            @on-cancel="mosaicEditDialogCancel">
      <DisabledForms></DisabledForms>
      <div slot="header" class="mosaicEditDialogHeader">
        <span class="title">{{$t('modify_supply')}}</span>
      </div>
      <div class="mosaicEditDialogBody">
        <div class="stepItem1">
          <Form :model="formItems">
            <FormItem :label="$t('mosaic_ID')">
              <p class="mosaicTxt">{{itemMosaic.hex.toString().toUpperCase()}}</p>
            </FormItem>
            <FormItem :label="$t('alias')">
              <p class="mosaicTxt">{{itemMosaic.name ? itemMosaic.name : 'no data'}}</p>
            </FormItem>
            <FormItem :label="$t('existing_supply')">
              <p class="mosaicTxt">{{supply}}</p>
            </FormItem>
            <FormItem class="update_type" :label="$t('change_type')">
              <RadioGroup v-model="formItems.supplyType" @on-change="changeSupply">
                <Radio :label="1" :disabled="!itemMosaic.properties.supplyMutable">{{$t('increase')}}</Radio>
                <Radio :label="0" :disabled="!itemMosaic.properties.supplyMutable">{{$t('cut_back')}}</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem :label="$t('change_amount')">
              <Input v-model="formItems.delta" required
                     type="number"
                     :disabled="!itemMosaic.properties.supplyMutable"
                     :placeholder="$t('please_enter_the_amount_of_change')"
                     @input="changeSupply"
                     :autofocus="true"
              />
            </FormItem>
            <FormItem :label="$t('post_change_supply')">
              <p class="mosaicTxt">{{changedSupply}}</p>
            </FormItem>
            <FormItem :label="$t('fee')" class="fee">
              <Select v-model="formItems.feeSpeed" required>
              <Option v-for="item in defaultFees" :value="item.speed" :key="item.speed">
                {{$t(item.speed)}} {{ `(${item.value} ${networkCurrency.ticker})` }}
              </Option>
              </Select>
            </FormItem>
            <FormItem :label="$t('password')">
              <Input v-model="formItems.password" type="password" required
                     :placeholder="$t('please_enter_your_wallet_password')" />
            </FormItem>
            <FormItem class="button_update">
              <Button type="success" :class="[isCompleteForm?'pointer':'not_allowed']" @click="submit">
                {{$t('update')}}
              </Button>
            </FormItem>
          </Form>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
    import './MosaicEditDialog.less'
    // @ts-ignore
    import {MosaicEditDialogTs} from '@/views/mosaic/mosaic-list/mosaic-edit-dialog/MosaicEditDialogTs.ts'

    export default class MosaicEditDialog extends MosaicEditDialogTs {

    }
</script>

<style scoped>

</style>
