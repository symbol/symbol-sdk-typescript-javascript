<template>
  <div class="mosaic_transaction_container">
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
            <Option v-for="item in publickeyList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div>


        <div class="form_item">
          <span class="key">{{$t('supply')}}</span>
          <span class="value">
            <input v-model="formItem.supply" type="text" :placeholder="$t('undefined')">
            <span class="number_controller">
                <img @click="addSupplyAmount " class="pointer"
                     src="@/assets/images/monitor/market/marketAmountUpdateArrow.png"/>
                <img @click="cutSupplyAmount" class="pointer"
                     src="@/assets/images/monitor/market/marketAmountUpdateArrow.png"/>
            </span>
           </span>
        </div>

        <div class="form_item">
          <span class="key">{{$t('severability')}}</span>
          <span class="value">
            <input v-model="formItem.divisibility" type="text" :placeholder="$t('undefined')">
            <span class="number_controller">
              <img @click="addSeverabilityAmount " class="pointer"
                   src="@/assets/images/monitor/market/marketAmountUpdateArrow.png"/>
              <img @click="cutSeverabilityAmount" class="pointer"
                   src="@/assets/images/monitor/market/marketAmountUpdateArrow.png"/>
            </span>
           </span>
        </div>


        <div class="check_box">
          <Checkbox class="check_box_item" v-model="formItem.transferable">{{$t('transmittable')}}</Checkbox>
          <Checkbox class="check_box_item" v-model="formItem.supplyMutable">{{$t('variable_upply')}}</Checkbox>
          <Checkbox class="check_box_item" v-model="formItem.permanent">{{$t('duration_permanent')}}</Checkbox>
        </div>


        <div class="form_item duration_item" v-if="!formItem.permanent">
          <span class="key">{{$t('duration')}}</span>
          <span class="value">
             <input v-model="formItem.duration" @input="durationChange" type="text" :placeholder="$t('undefined')">
            <span class="end_label">{{$t('duration')}}:{{durationIntoDate}}</span>
         </span>
          <div class="tips">
            {{$t('namespace_duration_tip_1')}}
          </div>
        </div>

        <div class="form_item XEM_rent_fee" v-if="false">
          <span class="key">{{$t('rent')}}</span>
          <span class="value">{{Number(formItem.duration)}}XEM</span>
        </div>

        <div class="form_item">
          <span class="key">{{$t('fee')}}</span>
          <span class="value">
              <input type="text" v-model="formItem.fee" :placeholder="$t('undefined')">
            <span class="end_label">gas</span>
          </span>
          <div class="tips">
            {{$t('the_more_you_set_the_cost_the_higher_the_processing_priority')}}
          </div>
        </div>
        <!-- TODO confirm  isMultisigAccount-->
        <div class="create_button pointer" @click="createMosaic(typeList[1].isSelected)">
          {{$t('create')}}
        </div>
      </div>
    </div>
    <CheckPWDialog :showCheckPWDialog="showCheckPWDialog" @closeCheckPWDialog="closeCheckPWDialog"
                   @checkEnd="checkEnd"></CheckPWDialog>


  </div>
</template>

<script lang="ts">
    import {mosaicInterface} from '@/interface/sdkMosaic.ts'
    import {formatSeconds, formatAddress} from '@/utils/util.js'
    import {Component, Vue, Watch} from 'vue-property-decorator'
    import {transactionInterface} from '@/interface/sdkTransaction'
    import {MosaicId, MosaicNonce, PublicAccount, NetworkType, Account} from 'nem2-sdk'
    import CheckPWDialog from '@/components/checkPW-dialog/CheckPWDialog.vue'
    import Message from "@/message/Message";


    @Component({
        components: {
            CheckPWDialog
        }
    })
    export default class MosaicTransaction extends Vue {

        showCheckPWDialog = false
        duration = 0
        durationIntoDate = 0
        multisigPublickey = ''
        currentTab: number = 0
        showMosaicEditDialog = false
        showMosaicAliasDialog = false
        isMultisigAccount = false
        accountPublicKey = ''
        accountAddress = ''
        node = ''
        generationHash = ''
        currentXem = ''
        currentXEM2: string
        currentXEM1: string
        mosaicMapInfo: any = {}
        publickeyList = [{
            value: 'no data',
            label: 'no data'
        }]
        typeList = [
            {
                name: 'ordinary_account',
                isSelected: true
            }, {
                name: 'multi_sign_account',
                isSelected: false
            }
        ]
        formItem: any = {
            supply: 500000000,
            divisibility: 6,
            transferable: true,
            supplyMutable: true,
            permanent: false,
            duration: 1000,
            fee: 50000
        }

        get getWallet() {
            return this.$store.state.account.wallet
        }

        formatAddress(address){
            return formatAddress(address)
        }

        addSeverabilityAmount() {
            this.formItem.divisibility = Number(this.formItem.divisibility) + 1
        }

        cutSeverabilityAmount() {
            this.formItem.divisibility = this.formItem.divisibility >= 1 ? Number(this.formItem.divisibility - 1) : Number(this.formItem.divisibility)
        }

        addSupplyAmount() {
            this.formItem.supply = Number(this.formItem.supply + 1)
        }

        cutSupplyAmount() {
            this.formItem.supply = this.formItem.supply >= 2 ? Number(this.formItem.supply - 1) : Number(this.formItem.supply)
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

        createTransaction() {
            this.showCheckPWDialog = true
        }

        showCheckDialog() {
            this.showCheckPWDialog = true
        }

        closeCheckPWDialog() {
            this.showCheckPWDialog = false
        }

        showAliasDialog() {
            document.body.click()
            setTimeout(() => {
                this.showMosaicAliasDialog = true
            })
        }

        closeMosaicAliasDialog() {
            this.showMosaicAliasDialog = false
        }

        showEditDialog() {
            document.body.click()
            setTimeout(() => {
                this.showMosaicEditDialog = true
            }, 0)
        }

        closeMosaicEditDialog() {
            this.showMosaicEditDialog = false
        }

        checkEnd(key) {
            if (!key) {
                this.$Notice.destroy()
                this.$Notice.error({
                    title: this.$t(Message.WRONG_PASSWORD_ERROR) + ''
                })
                return
            }
            if (this.isMultisigAccount) {
                this.createByMultisig(key)
            } else {
                this.createBySelf(key)
            }
        }

        createBySelf(key) {
            let {accountPublicKey, accountAddress, node, generationHash} = this
            const {supply, divisibility, transferable, supplyMutable, duration, fee} = this.formItem
            const account = Account.createFromPrivateKey(key, NetworkType.MIJIN_TEST)
            const that = this

            const nonce = MosaicNonce.createRandom()
            const mosaicId = MosaicId.createFromNonce(nonce, PublicAccount.createFromPublicKey(accountPublicKey, NetworkType.MIJIN_TEST))
            mosaicInterface.createMosaic({
                mosaicNonce: nonce,
                supply: supply,
                mosaicId: mosaicId,
                supplyMutable: supplyMutable,
                transferable: transferable,
                divisibility: Number(divisibility),
                duration: this.formItem.permanent ? undefined : Number(duration),
                netWorkType:  this.getWallet.networkType,
                maxFee: Number(fee),
                publicAccount: account.publicAccount
            }).then((result: any) => {
                const mosaicDefinitionTransaction = result.result.mosaicDefinitionTransaction
                const signature = account.sign(mosaicDefinitionTransaction, generationHash)

                transactionInterface.announce({signature, node}).then((announceResult) => {
                    // get announce status
                    announceResult.result.announceStatus.subscribe((announceInfo: any) => {
                        console.log(signature)
                        that.$Notice.success({
                            title: this.$t(Message.SUCCESS) + ''
                        })
                        that.initForm()
                    })
                })
            }).catch((e) => {
                console.log(e)
            })
        }


        createByMultisig(key) {

        }

        checkForm() {
            const {supply, divisibility, duration, fee, multisigPublickey} = this.formItem

            // multisig check
            if (this.isMultisigAccount && !multisigPublickey) {
                this.$Notice.error({
                    title: this.$t(Message.INPUT_EMPTY_ERROR) + ''
                })
                return false
            }

            // common check
            if (!Number(supply) || supply < 0) {
                this.$Notice.error({
                    title: this.$t(Message.SUPPLY_LESS_THAN_0_ERROR) + ''
                })
                return false
            }
            if (!Number(divisibility) || divisibility < 0) {
                this.$Notice.error({
                    title: this.$t(Message.DIVISIBILITY_LESS_THAN_0_ERROR) + ''
                })
                return false
            }
            if (!Number(duration) || duration <= 0) {
                this.$Notice.error({
                    title: this.$t(Message.DURATION_LESS_THAN_0_ERROR) + ''
                })
                return false
            }
            if (!Number(fee) || fee < 0) {
                this.$Notice.error({
                    title: this.$t(Message.FEE_LESS_THAN_0_ERROR) + ''
                })
                return false
            }
            return true
        }

        initForm() {
            this.formItem = {
                supply: 500000000,
                divisibility: 6,
                transferable: true,
                supplyMutable: true,
                permanent: false,
                duration: 1000,
                fee: 50000
            }
        }

        createMosaic(isMultisigAccount) {
            this.isMultisigAccount = isMultisigAccount
            if (this.checkForm()) {
                this.showCheckDialog()
            }
        }


        initData() {
            this.accountPublicKey = this.getWallet.publicKey
            this.accountAddress = this.getWallet.address
            this.node = this.$store.state.account.node
            this.generationHash = this.$store.state.account.generationHash
            this.$store.state.app.isInLoginPage = false
            this.currentXEM2 = this.$store.state.account.currentXEM2
            this.currentXEM1 = this.$store.state.account.currentXEM1
            this.currentXem = this.$store.state.account.currentXem
            this.durationChange()
        }

        durationChange() {
            const duration = Number(this.formItem.duration)
            if (Number.isNaN(duration)) {
                this.formItem.duration = 0
                this.durationIntoDate = 0
                return
            }
            if (duration * 12 >= 60 * 60 * 24 * 3650) {
                this.$Notice.error({
                    title: this.$t(Message.DURATION_MORE_THAN_10_YEARS_ERROR) + ''
                })
                this.formItem.duration = 0
            }
            this.durationIntoDate = formatSeconds(duration * 12)

        }

        created() {
            this.initData()
        }
    }
</script>
<style scoped lang="less">
  @import "MosaicTransaction.less";
</style>
