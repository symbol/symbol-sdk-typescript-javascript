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
          <Form :model="mosaic">
            <FormItem :label="$t('mosaic_ID')">
              <p class="mosaicTxt">{{mosaic.hex}}</p>
            </FormItem>
            <FormItem :label="$t('binding_alias')">
              <p class="mosaicTxt">{{mosaic.name}}</p>
            </FormItem>
            <FormItem :label="$t('fee')">
              <Input v-model="mosaic.fee" number required placeholder=""></Input>
              <p class="tails">gas</p>
              <div class="tips">
                {{$t('the_more_you_set_the_cost_the_higher_the_processing_priority')}}
              </div>
            </FormItem>
            <FormItem :label="$t('password')">
              <Input v-model="mosaic.password" type="password" required
                     :placeholder="$t('please_enter_your_wallet_password')"></Input>
            </FormItem>
            <FormItem class="button_update">
              <Button type="success" @click="updateMosaicAlias">{{$t('unbind')}}</Button>
            </FormItem>
          </Form>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
    import './MosaicUnAliasDialog.less'
    import {MosaicUnAliasDialogTs} from './MosaicUnAliasDialogTs'

    export default class MosaicUnAliasDialog extends MosaicUnAliasDialogTs {

    }
</script>

<style scoped>

</style>
