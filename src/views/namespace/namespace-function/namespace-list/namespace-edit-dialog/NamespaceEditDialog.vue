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
      <MultisigBanCover></MultisigBanCover>

      <div class="namespaceEditDialogBody">
        <div class="stepItem1">
          <Form :model="formItems">
            <FormItem :label="$t('namespace_name')">
              <p class="namespaceTxt">{{currentNamespace.label}}</p>
            </FormItem>
            <FormItem :label="$t('duration')">
              <Input v-model="formItems.duration"
                     number
                     required
                     @input="changeXEMRentFee"
                     :placeholder="$t('enter_the_number_of_blocks_integer')" />
              <p class="tails">{{$t('validity_period')}}：{{durationIntoDate}}</p>
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
                     :placeholder="$t('please_enter_your_wallet_password')" />
            </FormItem>
            <FormItem>
              <Button type="success" :class="[isCompleteForm?'pointer':'not_allowed']" @click="submit">
                {{$t('confirm')}}
              </Button>
            </FormItem>
          </Form>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
    // @ts-ignore
    import {NamespaceEditDialogTs} from '@/views/namespace/namespace-function/namespace-list/namespace-edit-dialog/NamespaceEditDialogTs.ts'

    export default class NamespaceEditDialog extends NamespaceEditDialogTs {

    }
</script>

<style scoped>

</style>
