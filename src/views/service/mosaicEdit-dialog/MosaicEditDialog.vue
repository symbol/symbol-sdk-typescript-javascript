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
          <Form :model="mosaic">
            <FormItem :label="$t('mosaic_ID')">
              <p class="mosaicTxt">{{mosaic.id}}</p>
            </FormItem>
            <FormItem :label="$t('alias')">
              <p class="mosaicTxt">{{mosaic.aliasName}}</p>
            </FormItem>
            <FormItem :label="$t('existing_supply')">
              <p class="mosaicTxt">{{mosaic.delta}}</p>
            </FormItem>
            <FormItem class="update_type" :label="$t('change_type')">
              <RadioGroup v-model="mosaic.supplyType">
                <Radio :label="$t('increase')"></Radio>
                <Radio :label="$t('cut_back')"></Radio>
              </RadioGroup>
            </FormItem>
            <FormItem :label="$t('change_amount')">
              <Input v-model="mosaic.changeDelta" required
                     :placeholder="$t('please_enter_the_amount_of_change')"></Input>
              <p class="tails">XEM</p>
            </FormItem>
            <FormItem :label="$t('post_change_supply')">
              <p class="mosaicTxt">100.000000XEM</p>
            </FormItem>
            <FormItem :label="$t('fee')">
              <Input v-model="mosaic.fee" required placeholder="0.05"></Input>
              <p class="tails">XEM</p>
            </FormItem>
            <FormItem :label="$t('password')" >
              <Input v-model="mosaic.password" type="password" required
                     :placeholder="$t('please_enter_your_wallet_password')"></Input>
            </FormItem>
            <FormItem class="button_update">
              <Button type="success" @click="updateMosaic"> {{$t('update')}}</Button>
            </FormItem>
          </Form>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
    import {Component, Vue, Prop, Watch} from 'vue-property-decorator';
    import './MosaicEditDialog.less';

    @Component({
        components: {},
    })
    export default class mosaicEditDialog extends Vue {
        show = false
        mosaic = {
            id: '3692FF952D89DD45',
            aliasName: '@cat.currency',
            delta: '100.000000XEM',
            supplyType: '',
            changeDelta: '',
            duration: '',
            fee: '',
            password: ''
        }

        @Prop()
        showMosaicEditDialog: boolean

        mosaicEditDialogCancel() {
            this.$emit('closeMosaicEditDialog')
        }

        updateMosaic() {
            this.show = false
            this.mosaicEditDialogCancel()
            // @ts-ignore
            this.$Notice.success({title: this['$t']('mosaic_operation'), desc: this['$t']('update_completed')});
        }

        @Watch('showMosaicEditDialog')
        onShowMosaicEditDialogChange() {
            this.show = this.showMosaicEditDialog
        }
    }
</script>

<style scoped>

</style>
