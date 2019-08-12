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
                            <Button type="success" @click="updateNamespace"> {{$t('confirm')}}</Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        </Modal>
    </div>
</template>

<script lang="ts">
    import './NamespaceEditDialog.less'
    import {Message} from "@/config/index"
    import {Account, Crypto} from 'nem2-sdk'
    import {walletInterface} from "@/interface/sdkWallet"
    import {aliasInterface} from "@/interface/sdkNamespace"
    import {formatSeconds, formatAddress} from '@/help/help.ts'
    import {transactionInterface} from "@/interface/sdkTransaction"
    import {Component, Vue, Prop, Watch} from 'vue-property-decorator'
    import {createRootNamespace, decryptKey} from "@/help/appUtil";

    @Component
    export default class namespaceEditDialog extends Vue {
        show = false
        stepIndex = 0
        durationIntoDate = 0
        namespace = {
            name: '',
            duration: 0,
            fee: 50000,
            password: ''
        }

        @Prop()
        showNamespaceEditDialog: boolean


        @Prop()
        currentNamespace: any

        get getWallet () {
            return this.$store.state.account.wallet
        }

        get generationHash () {
            return this.$store.state.account.generationHash
        }

        get node () {
            return this.$store.state.account.node
        }

        namespaceEditDialogCancel() {
            this.initForm()
            this.$emit('closeNamespaceEditDialog')
        }

        updateNamespace() {
            this.checkNamespaceForm()
        }

        changeXEMRentFee() {
            const duration = Number(this.namespace.duration)
            if (Number.isNaN(duration)) {
                this.namespace.duration = 0
                this.durationIntoDate = 0
                return
            }
            if (duration * 12 >= 60 * 60 * 24 * 365) {
                this.$Message.error(Message.DURATION_MORE_THAN_1_YEARS_ERROR)
                this.namespace.duration = 0
            }
            this.durationIntoDate = Number(formatSeconds(duration * 12))
        }
        checkInfo() {
            const {namespace} = this

            if (namespace.fee === 0) {
                this.$Notice.error({
                    title: '' + this.$t(Message.INPUT_EMPTY_ERROR)
                })
                return false
            }
            if (namespace.duration === 0) {
                this.$Notice.error({
                    title: '' + this.$t(Message.INPUT_EMPTY_ERROR)
                })
                return false
            }
            if (namespace.password === '') {
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
            this.checkPrivateKey(decryptKey(this.getWallet, this.namespace.password))
        }

        checkPrivateKey (DeTxt) {
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
        async updateMosaic (key) {
            const that =this
            let transaction
            const account = Account.createFromPrivateKey(key, this.getWallet.networkType);
            await createRootNamespace(this.currentNamespace.name, this.namespace.duration,
                this.getWallet.networkType, this.namespace.fee).then((rootNamespaceTransaction)=>{
                transaction = rootNamespaceTransaction
                const signature = account.sign(transaction, this.generationHash)
                transactionInterface.announce({signature, node: this.node}).then((announceResult) => {
                    // get announce status
                    announceResult.result.announceStatus.subscribe((announceInfo: any) => {
                        that.$Notice.success({
                            title: this.$t(Message.SUCCESS) + ''
                        })
                        that.initForm()
                        that.updatedNamespace()
                    })
                })
            })
        }

        updatedNamespace () {
            this.show = false
            this.namespaceEditDialogCancel()
        }

        initForm () {
            this.namespace = {
                name: '',
                duration: 0,
                fee: 50000,
                password: ''
            }
            this.durationIntoDate = 0
        }

        @Watch('showNamespaceEditDialog')
        onShowNamespaceEditDialogChange() {
            this.show = this.showNamespaceEditDialog
        }
    }
</script>

<style scoped>

</style>
