<template>
  <div class="mosaicEditDialogWrap">
    <Modal
            v-model="show"
            class-name="vertical-center-modal"
            :footer-hide="true"
            :width="1000"
            :transfer="false"
            @on-cancel="mosaicEditDialogCancel">
      <div slot="header" class="mosaicEditDialogHeader">
        <span class="title">{{$t('modify_supply')}}</span>
      </div>
      <div class="mosaicEditDialogBody">
        <div class="stepItem1">
          <Form :model="mosaic" v-if="mosaic.hex">
            <FormItem :label="$t('mosaic_ID')">
              <p class="mosaicTxt">{{mosaic.hex.toString().toUpperCase()}}</p>
            </FormItem>
            <FormItem :label="$t('alias')">
              <p class="mosaicTxt">{{mosaic.name}}</p>
            </FormItem>
            <FormItem :label="$t('existing_supply')">
              <p class="mosaicTxt">{{supply}}</p>
            </FormItem>
            <FormItem class="update_type" :label="$t('change_type')">
              <RadioGroup v-model="mosaic.supplyType" @on-change="changeSupply">
                <Radio :label="1" :disabled="!mosaic.supplyMutable">{{$t('increase')}}</Radio>
                <Radio :label="0" :disabled="!mosaic.supplyMutable">{{$t('cut_back')}}</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem :label="$t('change_amount')">
              <Input v-model="mosaic.changeDelta" required
                     type="number"
                     :disabled="!mosaic.supplyMutable"
                     :placeholder="$t('please_enter_the_amount_of_change')"
                     @input="changeSupply"
              ></Input>
              <p class="tails">XEM</p>
            </FormItem>
            <FormItem :label="$t('post_change_supply')">
              <p class="mosaicTxt">{{changedSupply}}XEM</p>
            </FormItem>
            <FormItem :label="$t('fee')">
              <Input v-model="mosaic.fee" required placeholder="50000"></Input>
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
              <Button type="success" :class="[isCompleteForm?'pointer':'not_allowed']" @click="checkMosaicForm"> {{$t('update')}}</Button>
            </FormItem>
          </Form>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
    import './MosaicEditDialog.less'
    import {MosaicEditDialogTs} from '../mosaic-edit-dialog/MosaicEditDialogTs'

    export default class MosaicEditDialog extends MosaicEditDialogTs {

    }
</script>

<style scoped>

</style>
