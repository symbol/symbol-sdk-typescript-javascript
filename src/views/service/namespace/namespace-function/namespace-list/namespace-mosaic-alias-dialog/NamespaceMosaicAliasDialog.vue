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
          <Form :model="formItem">
            <FormItem :label="$t('namespace')">
              <p class="mosaicTxt">{{formItem.label}}</p>
            </FormItem>
            <FormItem :label="$t('mosaic')">
              <Select v-model="formItem.mosaicHex" required>
                <Option :value="item.value" v-for="(item,index) in unlinkMosaicList" :key="index">{{item.label}}
                </Option>
              </Select>
            </FormItem>
            <FormItem :label="$t('fee')">
              <Input v-model="formItem.fee" number required placeholder=""></Input>
<!--              <p class="tails">gas</p>-->
              <div class="tips">
                {{$t('the_more_you_set_the_cost_the_higher_the_processing_priority')}}
              </div>
            </FormItem>
            <FormItem :label="$t('password')">
              <Input v-model="formItem.password" type="password" required
                     :placeholder="$t('please_enter_your_wallet_password')"></Input>
            </FormItem>
            <FormItem class="button_update">
              <Button type="success" :class="[isCompleteForm?'pointer':'not_allowed']" @click="submit">{{$t('bind')}}
              </Button>
            </FormItem>
          </Form>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
    import './NamespaceMosaicAliasDialog.less'
    // @ts-ignore
    import {NamespaceMosaicAliasDialogTs} from '@/views/service/namespace/namespace-function/namespace-list/namespace-mosaic-alias-dialog/NamespaceMosaicAliasDialogTs.ts'

    export default class NamespaceMosaicAliasDialog extends NamespaceMosaicAliasDialogTs {

    }
</script>

<style scoped>

</style>
