<template>
  <div class="namespace_transaction_container">
    <div class="left_switch_type">
      <div class="type_list_item " v-for="(b,index) in typeList">
        <span :class="['name',b.isSelected?'active':'','pointer']" @click="switchType(index)">{{$t(b.name)}}</span>
      </div>
    </div>

    <div class="right_panel">
      <div class="namespace_transaction">
        <div class="form_item">
          <span class="key">{{$t('account')}}</span>
          <span class="value" v-if="typeList[0].isSelected">{{formatAddress(getWallet.address)}}</span>
          <Select v-if="typeList[1].isSelected" :placeholder="$t('publickey')" v-model="multisigPublickey"
                  class="select">
            <Option v-for="item in multisigPublickeyList" :value="item.value" :key="item.value">{{ item.label }}
            </Option>
          </Select>
        </div>


        <div class="form_item">
          <span class="key">{{$t('parent_namespace')}}</span>
          <span class="value">
              <Select :placeholder="$t('select_parent_namespace')" v-model="form.rootNamespaceName" class="select">
                  <Option v-for="item in namespaceList" v-if="item.levels < 3" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
          </span>
        </div>

        <div class="form_item">
          <span class="key">{{$t('Subspace')}}</span>
          <span class="value">
              <input type="text" v-model="form.subNamespaceName" :placeholder="$t('Input_space_name')">
          </span>
          <div class="tips">
            <div>
              {{$t('namespace_tips_key_1')}}
              <span class="red">{{$t('namespace_tips_value_1')}}</span>
            </div>
            <div>
              {{$t('namespace_tips_key_2')}}
              <span class="red">{{$t('namespace_tips_value_2')}}</span>
            </div>
            <div>
              {{$t('namespace_tips_key_3')}}
            </div>
          </div>
        </div>

        <div class="form_item">
          <span class="key">{{$t('fee')}}</span>
          <span class="value">
              <input type="text" v-model="form.maxFee" :placeholder="$t('undefined')">
            <span class="end_label">gas</span>
          </span>
          <div class="tips">
            {{$t('the_more_you_set_the_cost_the_higher_the_processing_priority')}}
          </div>
        </div>

        <div v-if="typeList[0].isSelected" class="create_button" @click="createTransaction">
          {{$t('create')}}
        </div>
      </div>
    </div>
    <CheckPWDialog :showCheckPWDialog="showCheckPWDialog" @closeCheckPWDialog="closeCheckPWDialog"
                   @checkEnd="checkEnd"></CheckPWDialog>

  </div>
</template>

<script lang="ts">
    import {Account} from "nem2-sdk"
    import {Message} from "config/index"
    import {formatAddress} from '@/help/help'
    import {Component, Vue} from 'vue-property-decorator'
    import {aliasInterface} from "@/interface/sdkNamespace"
    import {transactionInterface} from "@/interface/sdkTransaction"
    import {bandedNamespace as BandedNamespaceList} from 'config/index'
    import CheckPWDialog from '@/common/vue/check-password-dialog/CheckPasswordDialog.vue'

    @Component({
        components: {
            CheckPWDialog
        }
    })
    export default class subNamespace extends Vue {
        showCheckPWDialog = false
        form = {
            rootNamespaceName: '',
            subNamespaceName: '',
            multisigPublickey: '',
            maxFee: 50000
        }
        durationIntoDate = 0
        multisigPublickey = ''
        multisigPublickeyList = [
            {
                value: 'no data',
                label: 'no data'
            },
        ]

        typeList = [
            {
                name: 'ordinary_account',
                isSelected: true
            }, {
                name: 'multi_sign_account',
                isSelected: false
            }
        ]

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

        formatAddress(address) {
            return formatAddress(address)
        }

        switchType(index) {
            let list = this.typeList
            list = list.map((item) => {
                item.isSelected = false
                return item
            })
            list[index].isSelected = true
            this.typeList = list
        }

        async checkEnd(key) {
            let transaction;
            const that = this;
            const account = Account.createFromPrivateKey(key, this.getWallet.networkType);

            await this.createSubNamespace().then((subNamespaceTransaction) => {
                transaction = subNamespaceTransaction
            })
            const signature = account.sign(transaction, this.generationHash)
            transactionInterface.announce({signature, node: this.node}).then((announceResult) => {
                // get announce status
                announceResult.result.announceStatus.subscribe((announceInfo: any) => {
                    that.$emit('createdNamespace')
                    that.$Notice.success({
                        title: this.$t(Message.SUCCESS) + ''
                    })
                    that.initForm()
                })
            })
        }

        showErrorMessage(message) {
            this.$Notice.destroy()
            this.$Notice.error({
                title: message
            })
        }

        checkForm(): boolean {
            const {rootNamespaceName, maxFee, subNamespaceName, multisigPublickey} = this.form

            if (!rootNamespaceName || !rootNamespaceName.trim()) {
                this.showErrorMessage(this.$t(Message.NAMESPACE_NULL_ERROR))
                return false
            }
            if (rootNamespaceName.length > 16) {
                this.showErrorMessage(this.$t(Message.SUB_NAMESPACE_LENGTH_LONGER_THAN_64_ERROR))
                return false
            }
            //^[a-z].*
            if (!rootNamespaceName.match(/^[a-z].*/)) {
                this.showErrorMessage(this.$t(Message.NAMESPACE_STARTING_ERROR))
                return false
            }
            //^[0-9a-zA-Z_-]*$
            if (!rootNamespaceName.match(/^[0-9a-zA-Z_-]*$/g)) {
                this.showErrorMessage(this.$t(Message.NAMESPACE_FORMAT_ERROR))
                return false
            }
            if (!subNamespaceName || !subNamespaceName.trim()) {
                this.showErrorMessage(this.$t(Message.NAMESPACE_NULL_ERROR))
                return false
            }
            if (subNamespaceName.length > 64) {
                this.showErrorMessage(this.$t(Message.SUB_NAMESPACE_LENGTH_LONGER_THAN_64_ERROR))
                return false
            }
            //^[a-z].*
            if (!subNamespaceName.match(/^[a-z].*/)) {
                this.showErrorMessage(this.$t(Message.NAMESPACE_STARTING_ERROR))
                return false
            }
            //^[0-9a-zA-Z_-]*$
            if (!subNamespaceName.match(/^[0-9a-zA-Z_-]*$/g)) {
                this.showErrorMessage(this.$t(Message.NAMESPACE_FORMAT_ERROR))
                return false
            }
            if ((!Number(maxFee) && Number(maxFee) !== 0) || Number(maxFee) < 0) {
                this.showErrorMessage(this.$t(Message.FEE_LESS_THAN_0_ERROR))
                return false
            }

            //BandedNamespaceList
            const subflag = BandedNamespaceList.every((item) => {
                if (item == subNamespaceName) {
                    this.showErrorMessage(this.$t(Message.NAMESPACE_USE_BANDED_WORD_ERROR))
                    return false
                }
                return true
            })
            return subflag
        }

        createSubNamespace() {
            return aliasInterface.createdSubNamespace({
                parentNamespace: this.form.rootNamespaceName,
                namespaceName: this.form.subNamespaceName,
                networkType: this.getWallet.networkType,
                maxFee: this.form.maxFee
            }).then((transaction) => {
                return transaction.result.subNamespaceTransaction
            })
        }

        initForm() {
            this.form = {
                rootNamespaceName: '',
                subNamespaceName: '',
                multisigPublickey: '',
                maxFee: 50000
            }
        }

        closeCheckPWDialog() {
            this.showCheckPWDialog = false
        }

        createTransaction() {
            if (!this.checkForm()) return
            this.showCheckPWDialog = true
        }

    }
</script>
<style scoped lang="less">
  @import "./SubNamespace.less";
</style>
