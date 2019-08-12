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
            <Option v-for="item in rootNamespaceList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div>


        <div class="form_item">
          <span class="key">{{$t('parent_namespace')}}</span>
          <span class="value">
              <input type="text" v-model="form.rootNamespaceName" :placeholder="$t('New_root_space')">
              <Select :placeholder="$t('New_root_space')" v-if="isSelectNamespace" v-model="form.rootNamespaceName"
                      class="select">
                  <Option v-for="item in rootNamespaceList" :value="item.value"
                          :key="item.value">{{ item.label }}</Option>
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

        <div class="form_item duration_item">
          <span class="key">{{$t('duration')}}</span>
          <span class="value">
             <input v-model="form.duration" :disabled="isSelectNamespace"
                    :class="[isSelectNamespace?'disabledInput':'']" type="text" @input="changeXEMRentFee"
                    :placeholder="$t('undefined')">
            <span class="end_label">{{$t('duration')}}:{{durationIntoDate}}</span>
         </span>
          <div class="tips">
            {{$t('namespace_duration_tip_1')}}
          </div>
        </div>

        <div class="form_item XEM_rent_fee">
          <span class="key">{{$t('rent')}}</span>
          <span class="value">{{Number(form.duration)}}XEM</span>
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

        <div class="create_button" @click="createTransaction">
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
    import {Message} from "@/config/index"
    import {Component, Vue} from 'vue-property-decorator'
    import {aliasInterface} from "@/interface/sdkNamespace"
    import {formatSeconds, formatAddress} from '@/help/help.ts'
    import {transactionInterface} from "@/interface/sdkTransaction"
    import CheckPWDialog from '@/common/vue/check-password-dialog/CheckPasswordDialog.vue'

    @Component({
        components: {
            CheckPWDialog
        }
    })
    export default class NamespaceTransaction extends Vue {
        durationIntoDate = 0
        multisigPublickey = ''
        showCheckPWDialog = false
        isSelectNamespace = false
        form = {
            duration: 1000,
            rootNamespaceName: '',
            subNamespaceName: '',
            maxFee: 10000000
        }

        rootNamespaceList = [
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

            if (this.form.subNamespaceName != '') {
                await this.createSubNamespace(key).then((subNamespaceTransaction) => {
                    transaction = subNamespaceTransaction
                })
            } else {
                await this.createRootNamespace(key).then((rootNamespaceTransaction) => {
                    transaction = rootNamespaceTransaction
                })
            }
            const signature = account.sign(transaction, this.generationHash)
            transactionInterface.announce({signature, node: this.node}).then((announceResult) => {
                // get announce status
                announceResult.result.announceStatus.subscribe((announceInfo: any) => {
                    console.log(transaction)
                    that.$Message.success(this.$t(Message.SUCCESS))
                    that.initForm()
                })
            })
        }

        createRootNamespace(key) {
            return aliasInterface.createdRootNamespace({
                namespaceName: this.form.rootNamespaceName,
                duration: this.form.duration,
                networkType: this.getWallet.networkType,
                maxFee: this.form.maxFee
            }).then((transaction) => {
                return transaction.result.rootNamespaceTransaction
            })
        }

        createSubNamespace(key) {
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
                duration: 0,
                rootNamespaceName: '',
                subNamespaceName: '',
                maxFee: 0
            }
        }

        showSelectNamespace() {
            this.isSelectNamespace = true
        }

        closeCheckPWDialog() {
            this.showCheckPWDialog = false
        }

        createTransaction() {
            // this.showCheckPWDialog = true
        }

        changeXEMRentFee() {
            const duration = Number(this.form.duration)
            if (Number.isNaN(duration)) {
                this.form.duration = 0
                this.durationIntoDate = 0
                return
            }
            if (duration * 12 >= 60 * 60 * 24 * 365) {
                this.$Message.error(Message.DURATION_MORE_THAN_1_YEARS_ERROR)
                this.form.duration = 0
            }
            this.durationIntoDate = Number(formatSeconds(duration * 12))
        }

        initData() {
            this.changeXEMRentFee()
        }

        created() {
            this.initData()
        }
    }
</script>
<style scoped lang="less">
  @import "NamespaceTransaction.less";
</style>
