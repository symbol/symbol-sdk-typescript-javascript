<template>
  <div class="mosaicWrap">
    <div class="createDiv">
      <Tabs type="card" :animated="false" :value="currentTab">
        <TabPane :label="$t('ordinary_account')" name="ordinary">
          <hr>
          <Form :model="formItem">
            <Row>
              <Col span="10">
                <h6>{{$t('basic_attribute')}}</h6>
                <FormItem :label="$t('supply')" class="form_item_content">
                  <Input v-model="formItem.supply" required
                         :placeholder="$t('please_enter_the_initial_supply')"></Input>
                  <div class="number_controller">
                    <img @click="addSupplyAmount " class="pointer"
                         src="../../../assets/images/monitor/market/marketAmountUpdateArrow.png"/>
                    <img @click="cutSupplyAmount" class="pointer"
                         src="../../../assets/images/monitor/market/marketAmountUpdateArrow.png"/>
                  </div>

                </FormItem>
                <FormItem class="form_item_content" :label="$t('severability')">
                  <Input v-model="formItem.divisibility" required
                         :placeholder="$t('please_enter_separability') + '（0~6）'"></Input>
                  <div class="number_controller">
                    <img @click="addSeverabilityAmount " class="pointer"
                         src="../../../assets/images/monitor/market/marketAmountUpdateArrow.png"/>
                    <img @click="cutSeverabilityAmount" class="pointer"
                         src="../../../assets/images/monitor/market/marketAmountUpdateArrow.png"/>
                  </div>
                </FormItem>
                <FormItem label=" ">
                  <Checkbox v-model="formItem.transferable">{{$t('transmittable')}}</Checkbox>
                  <Checkbox v-model="formItem.supplyMutable">{{$t('variable_upply')}}</Checkbox>
                </FormItem>
              </Col>
              <Col span="14">
                <h6>{{$t('other_information')}}</h6>
                <FormItem :label="$t('duration')">
                  <Input v-model="formItem.duration" required
                         :placeholder="$t('enter_the_number_of_blocks_integer')"></Input>
                  <p class="remindTxt">{{$t('enter_the_number_of_blocks')}}</p>
                  <p class="tails">{{$t('validity_period')}}：{{durationIntoDate}}</p>
                </FormItem>
                <FormItem :label="$t('fee')">
                  <Input v-model="formItem.fee" required placeholder="0.05"></Input>
                  <p class="remindTxt">
                    {{$t('the_default_is')}}：0.05000XEM，{{$t('the_more_you_set_the_cost_the_higher_the_processing_priority')}}</p>
                  <p class="tails">XEM</p>
                </FormItem>
              </Col>
            </Row>
          </Form>
          <Button type="success" @click="createMosaic(false)">{{$t('create')}}</Button>
        </TabPane>

        <TabPane :label="$t('multi_sign_account')" name="multiple">
          <hr>
          <Form :model="formItem">
            <Row>
              <Col span="10">
                <h6>{{$t('basic_attribute')}}</h6>
                <FormItem :label="$t('supply')">
                  <Input v-model="formItem.supply" required
                         :placeholder="$t('please_enter_the_initial_supply')"></Input>
                </FormItem>
                <FormItem :label="$t('severability')">
                  <Input v-model="formItem.divisibility" required
                         :placeholder="$t('please_enter_separability') + '（0~6）'"></Input>
                </FormItem>
                <FormItem label=" ">
                  <Checkbox v-model="formItem.transferable">{{$t('transmittable')}}</Checkbox>
                  <Checkbox v-model="formItem.supplyMutable">{{$t('variable_upply')}}</Checkbox>
                </FormItem>
              </Col>
              <Col span="14">
                <h6>{{$t('other_information')}}</h6>
                <FormItem :label="$t('duration')">
                  <Input v-model="formItem.duration" required
                         :placeholder="$t('enter_the_number_of_blocks_integer')"></Input>
                  <p class="remindTxt">{{$t('enter_the_number_of_blocks')}}</p>
                  <p class="tails">{{$t('validity_period')}}：{{durationIntoDate}}{{$t('time_day')}}</p>
                </FormItem>
                <FormItem :label="$t('fee')">
                  <Input v-model="formItem.fee" required placeholder="0.05"></Input>
                  <p class="remindTxt">
                    {{$t('the_default_is')}}：0.05000XEM，{{$t('the_more_you_set_the_cost_the_higher_the_processing_priority')}}</p>
                  <p class="tails">XEM</p>
                </FormItem>
                <FormItem class="clear">
                  <Button type="success" class="right" @click="createMosaic">{{$t('create')}}</Button>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </TabPane>
      </Tabs>
    </div>
    <div class="mosaicList">
      <div class="mosaicListHeader clear">
        <div class="headerTit left">{{$t('mosaic_list')}}</div>
        <div class="listPages right">
          <Page :total="100" size="small" show-total/>
        </div>
      </div>
      <div class="mosaicListBody">
        <div class="listTit">
          <Row>
            <Col span="1">&nbsp;</Col>
            <Col span="5">{{$t('mosaic_ID')}}</Col>
            <Col span="5">{{$t('available_quantity')}}</Col>
            <Col span="2">{{$t('transportability')}}</Col>
            <Col span="2">{{$t('variable_supply')}}</Col>
            <Col span="3">{{$t('effective_time')}}</Col>
            <Col span="3">{{$t('alias')}}</Col>
            <Col span="3"></Col>
          </Row>
        </div>
        <div class="listItem" v-for="(value,key,index) in mosaicMapInfo">
          <Row>
            <Col span="1">&nbsp;</Col>
            <Col span="5">{{value.hex}}</Col>
            <Col span="5">{{value.supply}}</Col>
            <Col span="2">{{value.transferable}}</Col>
            <Col span="2">{{value.supplyMutable}}</Col>
            <Col span="3">{{value._duration}}</Col>
            <Col span="3">null</Col>
            <Col span="3">
              <div class="listFnDiv">
                <Poptip placement="bottom">
                  <i class="moreFn"></i>
                  <div slot="content" class="updateFn">
                    <p class="fnItem" @click="showEditDialog">
                      <i><img src="../../../assets/images/service/updateMsaioc.png"></i>
                      <span class="">{{$t('modify_supply')}}</span>
                    </p>
                    <p class="fnItem" @click="showAliasDialog">
                      <i><img src="../../../assets/images/service/setAlias.png"></i>
                      <span>{{$t('binding_alias')}}</span>
                    </p>
                    <p class="fnItem">
                      <i><img src="../../../assets/images/service/clearAlias.png"></i>
                      <span>{{$t('unbind')}}</span>
                    </p>
                  </div>
                </Poptip>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
    <CheckPWDialog :showCheckPWDialog="showCheckPWDialog" @closeCheckPWDialog="closeCheckPWDialog"
                   @checkEnd="checkEnd"></CheckPWDialog>
    <EditDialog :showMosaicEditDialog="showMosaicEditDialog"
                @closeMosaicEditDialog="closeMosaicEditDialog"></EditDialog>
    <MosaicAliasDialog :showMosaicAliasDialog="showMosaicAliasDialog"
                       @closeMosaicAliasDialog="closeMosaicAliasDialog"></MosaicAliasDialog>
  </div>
</template>

<script lang="ts">
    import "./Mosaic.less";
    import {mosaicInterface} from '@/interface/sdkMosaic.ts'
    import {formatSeconds} from '@/utils/util.js'
    import {Component, Vue, Watch} from 'vue-property-decorator'
    import {transactionInterface} from '@/interface/sdkTransaction'
    import EditDialog from '../mosaicEdit-dialog/MosaicEditDialog.vue'
    import CheckPWDialog from '@/components/checkPW-dialog/CheckPWDialog.vue'
    import MosaicAliasDialog from '../mosaicAlias-dialog/MosaicAliasDialog.vue'
    import {MosaicId, MosaicNonce, PublicAccount, NetworkType, Account} from 'nem2-sdk'
    import {accountInterface} from '@/interface/sdkAccount';

    @Component({
        components: {
            EditDialog,
            CheckPWDialog,
            MosaicAliasDialog
        }
    })
    export default class Mosaic extends Vue {
        formItem: any = {
            supply: 500,
            divisibility: 1,
            transferable: true,
            supplyMutable: true,
            duration: 0,
            fee: 0.05
        }
        durationIntoDate = 0
        currentTab: number = 0
        rootNameList: any[] = []
        showCheckPWDialog = false
        showMosaicEditDialog = false
        showMosaicAliasDialog = false
        isMultisigAccount = false
        accountPrivateKey = ''
        accountPublicKey = ''
        accountAddress = ''
        node = ''
        generationHash = ''
        currentXem = ''
        currentXEM2: string
        currentXEM1: string
        mosaicMapInfo:any = {}

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

        checkEnd(flag) {
            if (!flag) {
                this.$Message.destroy()
                this.$Message.error(this['$t']('password_error'))
                return
            }
            if (this.isMultisigAccount) {
                this.createByMultisig()
            } else {
                this.createBySelf()
            }

        }


        createBySelf() {
            let {accountPrivateKey, accountPublicKey, accountAddress, node, generationHash} = this
            const {supply, divisibility, transferable, supplyMutable, duration, fee} = this.formItem
            const account = Account.createFromPrivateKey(accountPrivateKey, NetworkType.MIJIN_TEST)
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
                duration: Number(duration),
                netWorkType: NetworkType.MIJIN_TEST,
                maxFee: Number(fee),
                publicAccount: account.publicAccount
            }).then((result: any) => {
                const mosaicDefinitionTransaction = result.result.mosaicDefinitionTransaction
                const signature = account.sign(mosaicDefinitionTransaction, generationHash)

                transactionInterface.announce({signature, node}).then((announceResult) => {
                    // get announce status
                    announceResult.result.announceStatus.subscribe((announceInfo: any) => {
                        console.log(signature)
                        that.$Message.success('success')
                        that.initForm()
                    })
                })
            })
        }


        createByMultisig() {

        }

        checkForm() {
            const {supply, divisibility, duration, fee} = this.formItem
            if (supply < 0) {
                this.$Message.error(this['$t']('supply_can_not_less_than_0'))
                return false
            }
            if (divisibility < 0) {
                this.$Message.error(this['$t']('divisibility_can_not_less_than_0'))
                return false
            }
            if (duration <= 0) {
                this.$Message.error(this['$t']('duration_can_not_less_than_0'))
                return false
            }
            if (fee < 0) {
                this.$Message.error(this['$t']('fee_can_not_less_than_0'))
                return false
            }
            return true
        }

        initForm() {
            this.formItem = {
                supply: 500,
                divisibility: 1,
                transferable: true,
                supplyMutable: true,
                duration: 1000,
                fee: 0.05
            }
        }

        createMosaic(isMultisigAccount) {
            this.isMultisigAccount = isMultisigAccount
            if (this.checkForm()) {
                this.showCheckDialog()
            }
        }


        initData() {
            this.accountPrivateKey = this.$store.state.account.accountPrivateKey
            this.accountPublicKey = this.$store.state.account.accountPublicKey
            this.accountAddress = this.$store.state.account.accountAddress
            this.node = this.$store.state.account.node
            this.generationHash = this.$store.state.account.generationHash
            this.$store.state.app.isInLoginPage = false
            this.currentXEM2 = this.$store.state.account.currentXEM2
            this.currentXEM1 = this.$store.state.account.currentXEM1
            this.currentXem = this.$store.state.account.currentXem
            this.initForm()
        }


        @Watch('formItem.duration')
        onDurationChange() {
            const duration = Number(this.formItem.duration)
            if (Number.isNaN(duration)) {
                this.formItem.duration = 0
                this.durationIntoDate = 0
                return
            }
            if (duration * 12 >= 60 * 60 * 24 * 3650) {
                this.$Message.error(this['$t']('duration_can_not_less_than_10_years'))
                this.formItem.duration = 0
            }
            this.durationIntoDate = formatSeconds(duration * 12)

        }

        async getMosaicList() {
            const that = this
            let {accountPrivateKey, accountPublicKey, accountAddress, node, currentXem} = this
            await accountInterface.getAccountInfo({
                node,
                address: accountAddress
            }).then(async accountInfoResult => {
                await accountInfoResult.result.accountInfo.subscribe((accountInfo) => {
                    let mosaicList = accountInfo.mosaics
                    const mosaicIdList = mosaicList.map((item) => {
                        return item.id
                    })
                    console.log(mosaicIdList)
                    mosaicInterface.getMosaics({
                        node,
                        mosaicIdList
                    }).then((mosacListResult: any) => {
                        mosacListResult.result.mosaicsInfos.subscribe((mosaicListInfo: any) => {
                            let mosaicMapInfo: any = {}
                            mosaicListInfo.forEach((item) => {
                                if (item.owner.publicKey !== accountPublicKey) {
                                    return
                                }
                                item.hex = item.mosaicId.id.toHex()
                                item.supply = item.supply.compact()
                                item.supplyMutable = item.properties.supplyMutable
                                item._divisibility = item.properties.divisibility
                                item.transferable = item.properties.transferable
                                item._duration = item.properties.duration.compact()
                                if (item.mosaicId.id.toHex() == that.currentXEM2 || item.mosaicId.id.toHex() == that.currentXEM2) {
                                    item.name = currentXem
                                    mosaicMapInfo[item.name] = item
                                }
                                item.name = item.mosaicId.id.toHex()
                                mosaicMapInfo[item.name] = item
                            })
                            that.mosaicMapInfo = mosaicMapInfo
                        })
                    })
                })

            }).catch(() => {
                console.log('monitor panel error getMosaicList')
            })
        }


        created() {
            this.initData()
            this.getMosaicList()
        }
    }
</script>

<style lang="less">

</style>
