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
              <p class="mosaicTxt">{{mosaic.hex}}</p>
            </FormItem>
            <FormItem :label="$t('alias_selection')">
              <Select v-model="mosaic.aliasName" required>
                <Option :value="item.value" v-for="(item,index) in aliasNameList" :key="index">{{item.label}}</Option>
              </Select>
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
              <Button type="success" @click="updateMosaicAlias">{{$t('bind')}}</Button>
            </FormItem>
          </Form>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
    import './MosaicAliasDialog.less'
    import {Message} from "@/config/index"
    import {walletInterface} from "@/interface/sdkWallet"
    import {aliasInterface} from "@/interface/sdkNamespace"
    import {transactionInterface} from "@/interface/sdkTransaction"
    import {Component, Vue, Prop, Watch} from 'vue-property-decorator'
    import {EmptyAlias} from "nem2-sdk/dist/src/model/namespace/EmptyAlias"
    import {Account, Crypto, AliasActionType, NamespaceId, MosaicId} from "nem2-sdk"
    import {decryptKey} from "@/help/appUtil"

    @Component
    export default class mosaicAliasDialog extends Vue {
        show = false
        mosaic = {
            aliasName: '',
            fee: 50000,
            password: ''
        }
        aliasNameList: any[] = []

        @Prop()
        showMosaicAliasDialog: boolean
        @Prop()
        itemMosaic: any

        get getWallet() {
            return this.$store.state.account.wallet
        }

        get generationHash() {
            return this.$store.state.account.generationHash
        }

        get node() {
            return this.$store.state.account.node
        }

        get namespaceList() {
            return this.$store.state.account.namespace
        }

        mosaicAliasDialogCancel() {
            this.initForm()
            this.$emit('closeMosaicAliasDialog')
        }

        updateMosaicAlias() {
            this.checkNamespaceForm()
        }

        checkInfo() {
            const {mosaic} = this

            if (mosaic.fee === 0) {
                this.$Notice.error({
                    title: '' + this.$t(Message.INPUT_EMPTY_ERROR)
                })
                return false
            }
            if (mosaic.aliasName === '') {
                this.$Notice.error({
                    title: '' + this.$t(Message.INPUT_EMPTY_ERROR)
                })
                return false
            }
            if (mosaic.password === '') {
                this.$Notice.error({
                    title: '' + this.$t(Message.INPUT_EMPTY_ERROR)
                })
                return false
            }
            return true
        }

        checkNamespaceForm() {
            if (!this.checkInfo()) {
                return
            }
            this.decryptKey()
        }

        decryptKey () {
            this.checkPrivateKey(decryptKey(this.getWallet, this.mosaic.password))
        }

        checkPrivateKey(DeTxt) {
            const that = this
            walletInterface.getWallet({
                name: this.getWallet.name,
                networkType: this.getWallet.networkType,
                privateKey: DeTxt.length === 64 ? DeTxt : ''
            }).then(async (Wallet: any) => {
                this.updateMosaic(DeTxt)
            }).catch(() => {
                that.$Notice.error({
                    title: this.$t('password_error') + ''
                })
            })
        }

        async updateMosaic(key) {
            const that = this
            let transaction
            const account = Account.createFromPrivateKey(key, this.getWallet.networkType);
            aliasInterface.mosaicAliasTransaction({
                actionType: AliasActionType.Link,
                namespaceId: new NamespaceId(that.mosaic.aliasName),
                mosaicId: new MosaicId(that.mosaic['hex']),
                networkType: this.getWallet.networkType,
                maxFee: that.mosaic.fee
            }).then((aliasTransaction) => {
                let transaction
                transaction = aliasTransaction.result.aliasMosaicTransaction
                const signature = account.sign(transaction, this.generationHash)
                transactionInterface.announce({signature, node: this.node}).then((announceResult) => {
                    // get announce status
                    console.log(signature)
                    announceResult.result.announceStatus.subscribe((announceInfo: any) => {
                        that.$Notice.success({
                            title: this.$t(Message.SUCCESS) + ''
                        })
                        that.initForm()
                        that.updatedMosaicAlias()
                    })
                })
            })

        }

        updatedMosaicAlias() {
            this.show = false
            this.mosaicAliasDialogCancel()
        }

        initForm() {
            this.mosaic = {
                aliasName: '',
                fee: 50000,
                password: ''
            }
        }

        initData() {
            let list = []
            this.namespaceList.map((item, index) => {
                if (item.alias instanceof EmptyAlias) {
                    list.push(item)
                }
            })
            this.aliasNameList = list
        }

        @Watch('showMosaicAliasDialog')
        onShowMosaicAliasDialogChange() {
            this.show = this.showMosaicAliasDialog
            Object.assign(this.mosaic, this.itemMosaic)
            this.initData()
        }

        @Watch('namespaceList')
        onNamespaceListChange() {
            this.initData()
        }
    }
</script>

<style scoped>

</style>
