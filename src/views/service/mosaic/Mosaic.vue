<template>
    <div class="mosaicWrap">
        <div class="createDiv">
            <Tabs type="card" :animated="false" :value="currentTab">
                <TabPane label="普通账户" name="ordinary">
                    <hr>
                    <Form :model="formItem">
                    <Row>
                        <Col span="10">
                            <h6>基本属性</h6>
                            <FormItem label="供应量">
                                <Input v-model="formItem.delta" required placeholder="请输入初始供应量"></Input>
                            </FormItem>
                            <FormItem label="可分割性">
                                <Input v-model="formItem.divisibility" required placeholder="请输入可分性（0~6）"></Input>
                            </FormItem>
                            <FormItem label=" ">
                                <Checkbox v-model="formItem.transferable">可传输</Checkbox>
                                <Checkbox v-model="formItem.supplyMutable">可变供应量</Checkbox>
                            </FormItem>
                        </Col>
                        <Col span="14">
                            <h6>其他信息</h6>
                            <FormItem label="持续时间">
                                <Input v-model="formItem.duration" required placeholder="输入块数（整数）"></Input>
                                <p class="remindTxt">输入持续租用马赛克的块数（整数）,1个块=1XEM</p>
                                <p class="tails">有效期：0天</p>
                            </FormItem>
                            <FormItem label="费用">
                                <Input v-model="formItem.fee"  required placeholder="0.05"></Input>
                                <p class="remindTxt">默认为：0.05000XEM，设置的费用越多，处理优先级越高</p>
                                <p class="tails">XEM</p>
                            </FormItem>
                            <FormItem class="clear">
                                <Button type="success" class="right" @click="createMosaic">创建</Button>
                            </FormItem>
                        </Col>
                    </Row>
                    </Form>
                </TabPane>
                <TabPane label="多签账户" name="multiple">
                    <hr>
                    <Form :model="formItem">
                        <Row>
                            <Col span="10">
                                <h6>基本属性</h6>
                                <FormItem label="供应量">
                                    <Input v-model="formItem.delta" required placeholder="请输入初始供应量"></Input>
                                </FormItem>
                                <FormItem label="可分割性">
                                    <Input v-model="formItem.divisibility" required placeholder="请输入可分性（0~6）"></Input>
                                </FormItem>
                                <FormItem label=" ">
                                    <Checkbox v-model="formItem.transferable">可传输</Checkbox>
                                    <Checkbox v-model="formItem.supplyMutable">可变供应量</Checkbox>
                                </FormItem>
                            </Col>
                            <Col span="14">
                                <h6>其他信息</h6>
                                <FormItem label="持续时间">
                                    <Input v-model="formItem.duration" required placeholder="输入块数（整数）"></Input>
                                    <p class="remindTxt">输入持续租用马赛克的块数（整数）,1个块=1XEM</p>
                                    <p class="tails">有效期：0天</p>
                                </FormItem>
                                <FormItem label="费用">
                                    <Input v-model="formItem.fee"  required placeholder="0.05"></Input>
                                    <p class="remindTxt">默认为：0.05000XEM，设置的费用越多，处理优先级越高</p>
                                    <p class="tails">XEM</p>
                                </FormItem>
                                <FormItem class="clear">
                                    <Button type="success" class="right" @click="createMosaic">创建</Button>
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </TabPane>
            </Tabs>
        </div>
        <div class="mosaicList">
            <div class="mosaicListHeader clear">
                <div class="headerTit left">马赛克列表</div>
                <div class="listPages right">
                    <Page :total="100" size="small" show-total />
                </div>
            </div>
            <div class="mosaicListBody">
                <div class="listTit">
                    <Row>
                        <Col span="1">&nbsp;</Col>
                        <Col span="5">马赛克ID</Col>
                        <Col span="5">可供应量</Col>
                        <Col span="2">可传输性</Col>
                        <Col span="2">可变供应量</Col>
                        <Col span="3">有效时间</Col>
                        <Col span="3">别名</Col>
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
                                       <p class="fnItem" @click="showEditDialog"><i><img src="../../../assets/images/service/updateMsaioc.png"></i><span class="">修改供应量</span></p>
                                       <p class="fnItem" @click="showAliasDialog"><i><img src="../../../assets/images/service/setAlias.png"></i><span>绑定别名</span></p>
                                       <p class="fnItem"><i><img src="../../../assets/images/service/clearAlias.png"></i><span>取消绑定</span></p>
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
    import CheckPWDialog from '../../../components/checkPW-dialog/checkPWDialog.vue'
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
