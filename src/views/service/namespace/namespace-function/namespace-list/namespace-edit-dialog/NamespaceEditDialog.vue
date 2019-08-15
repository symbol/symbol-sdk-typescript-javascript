<template>
  <div class="namespaceEditDialogWrap">
    <Modal
            v-model="show"
            class-name="vertical-center-modal"
            :footer-hide="true"
            :width="1000"
            :transfer="false"
            @on-cancel="namespaceEditDialogCancel">
      <div slot="header" class="namespaceEditDialogHeader">
        <span class="title">{{$t('update_namespace')}}</span>
      </div>
      <div class="namespaceEditDialogBody">
        <div class="stepItem1">
          <Form :model="namespace">
            <FormItem :label="$t('space_name')">
              <p class="namespaceTxt">{{currentNamespace.name}}</p>
            </FormItem>
            <FormItem :label="$t('duration')">
              <Input v-model="namespace.duration"
                     number
                     required
                     @input="changeXEMRentFee"
                     :placeholder="$t('enter_the_number_of_blocks_integer')"></Input>
              <p class="tails">{{$t('validity_period')}}：{{durationIntoDate}}</p>
            </FormItem>
            <FormItem :label="$t('fee')">
              <Input v-model="namespace.fee" number required placeholder=""></Input>
              <p class="tails">gas</p>
              <div class="tips">
                {{$t('the_more_you_set_the_cost_the_higher_the_processing_priority')}}
              </div>
            </FormItem>
            <FormItem :label="$t('password')">
              <Input v-model="namespace.password" type="password" required
                     :placeholder="$t('please_enter_your_wallet_password')"></Input>
            </FormItem>
            <FormItem>
              <Button type="success" :class="[isCompleteForm?'pointer':'not_allowed']" @click="updateNamespace"> {{$t('confirm')}}</Button>
            </FormItem>
          </Form>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
    import {NamespaceEditDialogTs} from './NamespaceEditDialogTs'

    export default class NamespaceEditDialog extends NamespaceEditDialogTs {

    }
</script>

<style scoped>

</style>
