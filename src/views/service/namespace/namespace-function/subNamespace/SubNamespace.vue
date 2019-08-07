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
                        <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
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
              <input type="text"  v-model="form.subNamespaceName" :placeholder="$t('Input_space_name')">
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

                <div class="create_button" @click="createTransaction">
                    {{$t('create')}}
                </div>
            </div>
        </div>
        <CheckPWDialog :showCheckPWDialog="showCheckPWDialog" @closeCheckPWDialog="closeCheckPWDialog" @checkEnd="checkEnd"></CheckPWDialog>

    </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import {formatSeconds, formatAddress} from '@/utils/util.js'
    import Message from "@/message/Message";
    import CheckPWDialog from '@/components/checkPW-dialog/CheckPWDialog.vue'
    import {aliasInterface} from "../../../../../interface/sdkNamespace";
    import {transactionInterface} from "../../../../../interface/sdkTransaction";
    import {Account} from "nem2-sdk";

    @Component({
        components:{
            CheckPWDialog
        }
    })
    export default class subNamespace extends Vue {
        showCheckPWDialog = false
        form = {
            rootNamespaceName: '',
            subNamespaceName:'',
            maxFee:50000
        }
        durationIntoDate = 0
        multisigPublickey = ''
        cityList = [
            {
                value: 'TCTEXC-235TGXD7-OQCHBB-MNU3LS-2GFCB4-2KD75D-5VCN',
                label: 'TCTEXC-5TGXD7-OQCHBB-MNU3LS-2GFCB4-2KD75D-5VCN'
            },
            {
                value: 'TCTEXC-325TGXD7-OQCHBB-MNU3LS-2GFCB4-2KD75D-5VCN',
                label: 'TCTEXC-5TGXD7-OQCHBB-MNU3LS-2GFCB4-2KD75D-5VCN'
            },
            {
                value: 'TCTEXC-23325TGXD7-OQCHBB-MNU3LS-2GFCB4-2KD75D-5VCN',
                label: 'TCTEXC-5TGXD7-OQCHBB-MNU3LS-2GFCB4-2KD75D-5VCN'
            }
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

        get getWallet () {
            return this.$store.state.account.wallet
        }

        get generationHash () {
            return this.$store.state.account.generationHash
        }

        get node () {
            return this.$store.state.account.node
        }

        get namespaceList () {
            return this.$store.state.account.namespace
        }

        formatAddress(address){
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

        async checkEnd(key){
            let transaction;
            const that = this;
            const account = Account.createFromPrivateKey(key, this.getWallet.networkType);

            await this.createSubNamespace().then((subNamespaceTransaction)=>{
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

        createSubNamespace(){
            return aliasInterface.createdSubNamespace({
                parentNamespace: this.form.rootNamespaceName,
                namespaceName: this.form.subNamespaceName,
                networkType: this.getWallet.networkType,
                maxFee: this.form.maxFee
            }).then((transaction)=>{
                return transaction.result.subNamespaceTransaction
            })
        }

        initForm () {
            this.form = {
                rootNamespaceName: '',
                subNamespaceName:'',
                maxFee:50000
            }
        }

        closeCheckPWDialog () {
            this.showCheckPWDialog = false
        }
        createTransaction(){
            this.showCheckPWDialog = true
        }

    }
</script>
<style scoped lang="less">
    @import "SubNamespace.less";
</style>
