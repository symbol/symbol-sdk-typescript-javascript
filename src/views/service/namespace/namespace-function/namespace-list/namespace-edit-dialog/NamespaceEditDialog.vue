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
              <p class="namespaceTxt">{{currentNamespaceName}}</p>
            </FormItem>
            <FormItem :label="$t('duration')">
              <Input v-model="namespace.duration" required
                     :placeholder="$t('enter_the_number_of_blocks_integer')"></Input>
              <p class="tails">{{$t('validity_period')}}：0{{$t('time_day')}}</p>
            </FormItem>
            <FormItem :label="$t('fee')">
              <Input v-model="namespace.fee" required placeholder="0.05"></Input>
              <p class="tails">XEM</p>
            </FormItem>
            <FormItem :label="$t('password')">
              <Input v-model="namespace.password" type="password" required
                     :placeholder="$t('please_enter_your_wallet_password')"></Input>
            </FormItem>
            <FormItem>
              <Button type="success" @click="updateNamespace"> {{$t('confirm')}}</Button>
            </FormItem>
          </Form>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
    import {Component, Vue, Prop, Watch} from 'vue-property-decorator';
    import './NamespaceEditDialog.less';
    import Message from "@/message/Message";


    @Component
    export default class namespaceEditDialog extends Vue {
        stepIndex = 0
        show = false
        namespace = {
            name: 'asdwa',
            duration: '',
            fee: '',
            password: ''
        }

        @Prop()
        showNamespaceEditDialog: boolean


        @Prop()
        currentNamespaceName: any


        namespaceEditDialogCancel() {
            this.$emit('closeNamespaceEditDialog')
        }

        updateNamespace() {
            this.show = false
            this.namespaceEditDialogCancel()
            // @ts-ignore
            this.$Notice.success({title: Message.OPERATION_SUCCESS, desc: Message.UPDATE_SUCCESS});
        }

        @Watch('showNamespaceEditDialog')
        onShowNamespaceEditDialogChange() {
            this.show = this.showNamespaceEditDialog
        }
    }
</script>

<style scoped>

</style>
