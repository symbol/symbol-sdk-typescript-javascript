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
          <Form :model="mosaic" v-if="mosaic.hex">
            <FormItem :label="$t('mosaic_ID')">
              <p class="mosaicTxt">{{mosaic.hex.toString().toUpperCase()}}</p>
            </FormItem>
            <FormItem :label="$t('alias')">
              <p class="mosaicTxt">{{mosaic.name}}</p>
            </FormItem>
            <FormItem :label="$t('existing_supply')">
              <p class="mosaicTxt">{{supply}}</p>
            </FormItem>
            <FormItem class="update_type" :label="$t('change_type')">
              <RadioGroup v-model="mosaic.supplyType" @on-change="changeSupply">
                <Radio :label="1" :disabled="!mosaic.supplyMutable">{{$t('increase')}}</Radio>
                <Radio :label="0" :disabled="!mosaic.supplyMutable">{{$t('cut_back')}}</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem :label="$t('change_amount')">
              <Input v-model="mosaic.changeDelta" required
                     type="number"
                     :disabled="!mosaic.supplyMutable"
                     :placeholder="$t('please_enter_the_amount_of_change')"
                     @input="changeSupply"
              ></Input>
              <p class="tails">XEM</p>
            </FormItem>
            <FormItem :label="$t('post_change_supply')">
              <p class="mosaicTxt">{{changedSupply}}XEM</p>
            </FormItem>
            <FormItem :label="$t('fee')">
              <Input v-model="mosaic.fee" required placeholder="50000"></Input>
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
              <Button type="success" @click="checkMosaicForm"> {{$t('update')}}</Button>
            </FormItem>
          </Form>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
    import './MosaicEditDialog.less'
    import {Message} from "@/config/index"
    import {walletInterface} from "@/interface/sdkWallet"
    import {mosaicInterface} from "@/interface/sdkMosaic"
    import {transactionInterface} from "@/interface/sdkTransaction"
    import {Component, Vue, Prop, Watch} from 'vue-property-decorator'
    import {Account, Crypto} from 'nem2-sdk'

    @Component
    export default class mosaicEditDialog extends Vue {
        show = false
        changedSupply = 0
        totalSupply = 9000000000
        mosaic = {
            id: '',
            aliasName: '',
            delta: 0,
            supplyType: 1,
            changeDelta: 0,
            duration: '',
            fee: 50000,
            password: ''
        }

        @Prop()
        showMosaicEditDialog: boolean

        @Prop()
        itemMosaic: any

        get selectedMosaic() {
            return this.itemMosaic
        }

        get supply() {
            return this.mosaic['supply']
        }

        get getWallet() {
            return this.$store.state.account.wallet
        }

        get generationHash() {
            return this.$store.state.account.generationHash
        }

        get node() {
            return this.$store.state.account.node
        }

        mosaicEditDialogCancel() {
            this.initForm()
            this.$emit('closeMosaicEditDialog')
        }

        changeSupply() {
            this.mosaic.changeDelta = Math.abs(this.mosaic.changeDelta)
            let supply = 0
            if (this.mosaic.supplyType === 1) {
                supply = Number(this.mosaic.changeDelta) + Number(this.supply)
                if (supply > this.totalSupply * Math.pow(10, this.mosaic['_divisibility'])) {
                    supply = this.totalSupply * Math.pow(10, this.mosaic['_divisibility'])
                    this.mosaic.changeDelta = supply - this.supply
                }
            } else {
                supply = this.supply - this.mosaic.changeDelta
                if (supply <= 0) {
                    supply = 0
                    this.mosaic.changeDelta = this.supply
                }
            }

            this.changedSupply = supply
        }

        checkInfo() {
            const {mosaic} = this

            if (mosaic.fee === 0) {
                this.$Notice.error({
                    title: '' + this.$t(Message.INPUT_EMPTY_ERROR)
                })
                return false
            }
            if (mosaic.changeDelta === 0) {
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

        checkMosaicForm() {
            if (!this.checkInfo()) {
                return
            }
            this.decryptKey()
        }

        decryptKey() {
            let encryptObj = {
                ciphertext: this.getWallet.ciphertext,
                iv: this.getWallet.iv.data ? this.getWallet.iv.data : this.getWallet.iv,
                key: this.mosaic.password
            }
            this.checkPrivateKey(Crypto.decrypt(encryptObj))
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

        updateMosaic(key) {
            const that = this
            mosaicInterface.mosaicSupplyChange({
                mosaicId: this.mosaic['mosaicId'],
                delta: this.mosaic.changeDelta,
                netWorkType: this.getWallet.networkType,
                MosaicSupplyType: this.mosaic.supplyType,
                maxFee: this.mosaic.fee,
            }).then((changed) => {
                const transaction = changed.result.mosaicSupplyChangeTransaction
                console.log(transaction)
                const account = Account.createFromPrivateKey(key, this.getWallet.networkType)
                const signature = account.sign(transaction, this.generationHash)

                transactionInterface.announce({signature, node: that.node}).then((announceResult) => {
                    // get announce status
                    announceResult.result.announceStatus.subscribe((announceInfo: any) => {
                        console.log(signature)
                        that.updatedMosaic()
                    })
                })
            })
        }

        updatedMosaic() {
            this.show = false
            this.mosaicEditDialogCancel()
            this.$Notice.success({
                title: this['$t']('mosaic_operation') + '',
                desc: this['$t']('update_completed') + ''
            });
        }

        initForm() {
            this.mosaic = {
                id: '',
                aliasName: '',
                delta: 0,
                supplyType: 1,
                changeDelta: 0,
                duration: '',
                fee: 50000,
                password: ''
            }
        }

        @Watch('showMosaicEditDialog')
        onShowMosaicEditDialogChange() {
            this.show = this.showMosaicEditDialog
            Object.assign(this.mosaic, this.selectedMosaic)
        }

        @Watch('selectedMosaic')
        onSelectMosaicChange() {
            Object.assign(this.mosaic, this.selectedMosaic)
        }
    }
</script>

<style scoped>

</style>
