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
                            <FormItem :label="$t('supply')">
                                <Input v-model="formItem.delta" required :placeholder="$t('please_enter_the_initial_supply')"></Input>
                            </FormItem>
                            <FormItem :label="$t('severability')">
                                <Input v-model="formItem.divisibility" required :placeholder="$t('please_enter_separability') + '（0~6）'"></Input>
                            </FormItem>
                            <FormItem label=" ">
                                <Checkbox v-model="formItem.transferable">{{$t('transmittable')}}</Checkbox>
                                <Checkbox v-model="formItem.supplyMutable">{{$t('variable_upply')}}</Checkbox>
                            </FormItem>
                        </Col>
                        <Col span="14">
                            <h6>{{$t('other_information')}}</h6>
                            <FormItem :label="$t('duration')">
                                <Input v-model="formItem.duration" required :placeholder="$t('enter_the_number_of_blocks_integer')"></Input>
                                <p class="remindTxt">{{$t('enter_the_number_of_blocks')}}</p>
                                <p class="tails">{{$t('validity_period')}}：0{{$t('time_day')}}</p>
                            </FormItem>
                            <FormItem :label="$t('fee')">
                                <Input v-model="formItem.fee"  required placeholder="0.05"></Input>
                                <p class="remindTxt">{{$t('the_default_is')}}：0.05000XEM，{{$t('the_more_you_set_the_cost_the_higher_the_processing_priority')}}</p>
                                <p class="tails">XEM</p>
                            </FormItem>
                            <FormItem class="clear">
                                <Button type="success" class="right" @click="createMosaic">{{$t('create')}}</Button>
                            </FormItem>
                        </Col>
                    </Row>
                    </Form>
                </TabPane>
                <TabPane :label="$t('multi_sign_account')" name="multiple">
                    <hr>
                    <Form :model="formItem">
                        <Row>
                            <Col span="10">
                                <h6>{{$t('basic_attribute')}}</h6>
                                <FormItem :label="$t('supply')">
                                    <Input v-model="formItem.delta" required :placeholder="$t('please_enter_the_initial_supply')"></Input>
                                </FormItem>
                                <FormItem :label="$t('severability')">
                                    <Input v-model="formItem.divisibility" required :placeholder="$t('please_enter_separability') + '（0~6）'"></Input>
                                </FormItem>
                                <FormItem label=" ">
                                    <Checkbox v-model="formItem.transferable">{{$t('transmittable')}}</Checkbox>
                                    <Checkbox v-model="formItem.supplyMutable">{{$t('variable_upply')}}</Checkbox>
                                </FormItem>
                            </Col>
                            <Col span="14">
                                <h6>{{$t('other_information')}}</h6>
                                <FormItem :label="$t('duration')">
                                    <Input v-model="formItem.duration" required :placeholder="$t('enter_the_number_of_blocks_integer')"></Input>
                                    <p class="remindTxt">{{$t('enter_the_number_of_blocks')}}</p>
                                    <p class="tails">{{$t('validity_period')}}：0{{$t('time_day')}}</p>
                                </FormItem>
                                <FormItem :label="$t('fee')">
                                    <Input v-model="formItem.fee"  required placeholder="0.05"></Input>
                                    <p class="remindTxt">{{$t('the_default_is')}}：0.05000XEM，{{$t('the_more_you_set_the_cost_the_higher_the_processing_priority')}}</p>
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
                    <Page :total="100" size="small" show-total />
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
                        <Col span="3"> </Col>
                    </Row>
                </div>
                <div class="listItem">
                    <Row>
                        <Col span="1">&nbsp;</Col>
                        <Col span="5">3692FF952D89DD45</Col>
                        <Col span="5">100.000000XEM</Col>
                        <Col span="2">是</Col>
                        <Col span="2">是</Col>
                        <Col span="3">2天</Col>
                        <Col span="3">@cat.currency</Col>
                        <Col span="3">
                            <div class="listFnDiv">
                                <Poptip  placement="bottom">
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
        <CheckPWDialog :showCheckPWDialog="showCheckPWDialog" @closeCheckPWDialog="closeCheckPWDialog" @checkEnd="checkEnd"></CheckPWDialog>
        <EditDialog :showMosaicEditDialog="showMosaicEditDialog" @closeMosaicEditDialog="closeMosaicEditDialog"></EditDialog>
        <MosaicAliasDialog :showMosaicAliasDialog="showMosaicAliasDialog" @closeMosaicAliasDialog="closeMosaicAliasDialog"></MosaicAliasDialog>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import EditDialog from '../mosaicEdit-dialog/MosaicEditDialog.vue'
    import CheckPWDialog from '../../../components/checkPW-dialog/CheckPWDialog.vue'
    import MosaicAliasDialog from '../mosaicAlias-dialog/MosaicAliasDialog.vue'
    import './Mosaic.less';

    @Component({
        components: {
            EditDialog,
            CheckPWDialog,
            MosaicAliasDialog
        }
    })
    export default class Mosaic extends Vue{
        formItem:any = {
            delta:'',
            divisibility:'',
            transferable:true,
            supplyMutable:true,
            duration:0,
            fee:0.05
        }
        currentTab:number = 0
        rootNameList :any[] = []
        showCheckPWDialog = false
        showMosaicEditDialog = false
        showMosaicAliasDialog = false

        showCheckDialog () {
            this.showCheckPWDialog = true
        }
        closeCheckPWDialog () {
            this.showCheckPWDialog = false
        }
        showAliasDialog () {
            document.body.click()
            setTimeout(()=> {
                this.showMosaicAliasDialog = true
            })
        }
        closeMosaicAliasDialog () {
            this.showMosaicAliasDialog = false
        }
        showEditDialog () {
            document.body.click()
            setTimeout(()=>{
                this.showMosaicEditDialog = true
            },0)
        }
        closeMosaicEditDialog () {
            this.showMosaicEditDialog = false
        }

        checkEnd () {

        }

        createMosaic() {
            this.showCheckDialog()
        }

    }
</script>

<style scoped>

</style>
