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
              <Select v-model="mosaic.aliasName" required :placeholder="$t('alias_selection')">
                <Option :value="item.value" v-for="(item,index) in aliasNameList" :key="index">{{item.label}}</Option>
              </Select>
              <div class="selectAliasNameIcon"></div>
            </FormItem>
            <FormItem :label="$t('fee')">
              <Input v-model="mosaic.fee" required placeholder="0.05"></Input>
              <p class="tails">XEM</p>
            </FormItem>
            <FormItem class="button_update">
              <Button type="success" @click="updateMosaicAlias">{{$t('bind')}}</Button>
            </FormItem>
          </Form>
        </div>
      </div>
    </Modal>
    <CheckPWDialog :showCheckPWDialog="showCheckPWDialog" @closeCheckPWDialog="closeCheckPWDialog"
                   @checkEnd="checkEnd"></CheckPWDialog>
  </div>
</template>

<script lang="ts">
    import {Address, AliasActionType, MosaicId, NamespaceId, Account} from "nem2-sdk"
    import './MosaicAliasDialog.less'
    import Message from '@/message/Message'
    import {aliasInterface} from "@/interface/sdkNamespace"
    import {Component, Vue, Prop, Watch} from 'vue-property-decorator'
    import CheckPWDialog from '@/components/checkPW-dialog/CheckPWDialog.vue'

    @Component({
        components: {
            CheckPWDialog
        },
    })
    export default class mosaicAliasDialog extends Vue {
        showCheckPWDialog = false
        show = false
        mosaic = {
            id: '',
            aliasName: '',
            fee: 10000000
        }
        aliasNameList: any[] = [{
            value: 'no data',
            lable: 'no data'

        }]

        get getWallet() {
            return this.$store.state.account.wallet
        }


        @Prop()
        showMosaicAliasDialog: boolean


        @Prop()
        currentMosaic


        mosaicAliasDialogCancel() {
            this.$emit('closeMosaicAliasDialog')
        }

        showCheckDialog() {
            this.showCheckPWDialog = true
        }

        closeCheckPWDialog() {
            this.showCheckPWDialog = false
        }

        checkEnd(privatekey) {
            if (!privatekey) {
                this.$Notice.destroy()
                this.$Notice.error({
                    title: this.$t(Message.WRONG_PASSWORD_ERROR) + ''
                })
                return
            }
            this.moasicAliasTransaction(privatekey)
        }

        moasicAliasTransaction(privatekey) {
            const {currentMosaic} = this
            const {id, aliasName, fee} = this.mosaic
            const {networkType} = this.$store.state.account.wallet
            const {generationHash, node} = this.$store.state.account
            const account = Account.createFromPrivateKey(privatekey, networkType)
            aliasInterface.mosaicAliasTransaction({
                actionType: AliasActionType.Link,
                namespaceId: new NamespaceId(aliasName),
                mosaicId: currentMosaic.mosaicId,
                networkType: networkType,
                maxFee: Number(fee),
                node: node,
                account: account,
                generationHash: generationHash,
            })
            //success
            this.$Notice.success({title: '' + this['$t']('binding_success')});
            this.show = false
            this.mosaicAliasDialogCancel()
        }

        checkForm(): boolean {
            const {id, aliasName, fee} = this.mosaic

            if (id.length !== 16) {
                this.showErrorMessage(this.$t(Message.MOSAIC_ID_FORMAT_ERROR))
                return
            }
            if (!aliasName || 'no data' == aliasName) {
                this.showErrorMessage(this.$t(Message.ALIAS_NAME_FORMAT_ERROR))
                return
            }

            if ((!Number(fee) && Number(fee) !== 0) || Number(fee) < 0) {
                this.showErrorMessage(this.$t(Message.FEE_LESS_THAN_0_ERROR))
                return false
            }

            return true
        }

        showErrorMessage(message) {
            this.$Notice.destroy()
            this.$Notice.error({
                title: message
            })
        }

        updateMosaicAlias() {
            if (!this.checkForm()) return
            this.showCheckDialog()
        }

        async getMyNamespaces() {
            const {node} = this.$store.state.account
            const that = this
            await aliasInterface.getNamespacesFromAccount({
                address: Address.createFromRawAddress(this.getWallet.address),
                url: node
            }).then((namespacesFromAccount) => {
                let list = []
                let namespace = {}
                namespacesFromAccount.result.namespaceList
                    .sort((a, b) => {
                        return a['namespaceInfo']['depth'] - b['namespaceInfo']['depth']
                    }).map((item, index) => {
                    if (!namespace.hasOwnProperty(item.namespaceInfo.id.toHex())) {
                        namespace[item.namespaceInfo.id.toHex()] = item.namespaceName
                    } else {
                        return
                    }
                    let namespaceName = ''
                    item.namespaceInfo.levels.forEach((item, index) => {
                        namespaceName += namespace[item.id.toHex()] + '.'
                    })
                    if(item.namespaceInfo.alias.type == 1) return
                    namespaceName = namespaceName.slice(0, namespaceName.length - 1)
                    const newObj = {
                        ...item,
                        value: namespaceName,
                        label: namespaceName,
                        levels: item.namespaceInfo.levels.length,
                        name: namespaceName,
                        duration: item.namespaceInfo.endHeight.compact(),
                    }

                    list.push(newObj)
                })
                that.aliasNameList = list
                console.log(list)
                this.$store.commit('SET_NAMESPACE', list)
            })
        }

        @Watch('showMosaicAliasDialog')
        onShowMosaicAliasDialogChange() {
            this.show = this.showMosaicAliasDialog
        }

        @Watch('currentMosaic')
        onCurrentMosaicChange() {
            this.mosaic.id = this.currentMosaic.hex
        }


        created() {
            this.getMyNamespaces()
            // this.mosaic.id =
        }
    }
</script>

<style scoped>

</style>
