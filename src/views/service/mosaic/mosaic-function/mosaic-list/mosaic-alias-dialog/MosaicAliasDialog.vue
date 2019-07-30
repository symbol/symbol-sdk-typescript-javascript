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
          <Form :model="mosaic">
            <FormItem :label="$t('mosaic_ID')">
              <p class="mosaicTxt">{{mosaic.id}}</p>
            </FormItem>
            <FormItem :label="$t('alias_selection')">
              <Select v-model="mosaic.aliasName" required>
                <Option :value="item.value" v-for="(item,index) in aliasNameList" :key="index">{{item.label}}</Option>
              </Select>
              <div class="selectAliasNameIcon"></div>
            </FormItem>
            <FormItem :label="$t('fee')">
              <Input v-model="mosaic.fee" required placeholder="0.05"></Input>
              <p class="tails">XEM</p>
            </FormItem>
            <FormItem :label="$t('password')">
              <Input v-model="mosaic.password" type="password" required
                     :placeholder="$t('please_enter_your_wallet_password')"></Input>
            </FormItem>
            <FormItem class="button_update">
              <Button type="success" @click="updateMosaicAlias">{{$t('bind')}}</Button>
            </FormItem>
          </Form>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
    import {Component, Vue, Prop, Watch} from 'vue-property-decorator';
    import './MosaicAliasDialog.less';

    @Component({
        components: {},
    })
    export default class mosaicAliasDialog extends Vue {
        show = false
        mosaic = {
            id: '3692FF952D89DD45',
            aliasName: '',
            fee: '',
            password: ''
        }
        aliasNameList: any[] = [
            {value: 'asd', label: 'asd'},
            {value: '123', label: '123'},
        ]

        @Prop()
        showMosaicAliasDialog: boolean

        mosaicAliasDialogCancel() {
            this.$emit('closeMosaicAliasDialog')
        }

        updateMosaicAlias() {
            this.show = false
            this.mosaicAliasDialogCancel()
            // @ts-ignore
            this.$Notice.success({title: this['$t']('mosaic_alias_operation'), desc: this['$t']('binding_success')});
        }

        @Watch('showMosaicAliasDialog')
        onShowMosaicAliasDialogChange() {
            this.show = this.showMosaicAliasDialog
        }
    }
</script>

<style scoped>

</style>
