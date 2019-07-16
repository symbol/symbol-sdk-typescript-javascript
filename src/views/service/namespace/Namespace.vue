<template>
    <div class="namespaceWrap clear">
        <div class="left createDiv">
            <Tabs type="card" :animated="false" :value="currentTab">
                <TabPane label="普通账户" name="ordinary">
                    <hr>
                    <Form :model="formItem">
                        <FormItem label="父命名空间">
                            <Select v-model="formItem.rootName" required>
                                <Option :value="item.value" v-for="(item,index) in rootNameList" :key="index">{{item.label}}</Option>
                            </Select>
                            <Input v-model="formItem.rootName" style="visibility: hidden;width:0;height: 0;overflow: hidden" required placeholder="新的根命名空间"></Input>
                        </FormItem>
                        <FormItem label="子空间">
                            <Input v-model="formItem.subName" required placeholder="输入空间名"></Input>
                        </FormItem>
                        <FormItem label="持续时间">
                            <Input v-model="formItem.duration" required placeholder="输入块数（整数）"></Input>
                            <p class="remindTxt">持续时间以块计算，一个块为12秒</p>
                            <p class="tails">有效期：0天</p>
                        </FormItem>
                        <FormItem label="费用">
                            <Input v-model="formItem.fee"  required placeholder="0.05"></Input>
                            <p class="remindTxt">默认为：0.05000XEM，设置的费用越多，处理优先级越高</p>
                            <p class="tails">XEM</p>
                        </FormItem>
                        <FormItem>
                            <Button type="success" @click="createNamespace">创建</Button>
                        </FormItem>
                    </Form>
                </TabPane>
                <TabPane label="多签账户" name="multiple">
                    <hr>
                    <Form :model="formItem">
                        <FormItem label="父命名空间">
                            <Select v-model="formItem.rootName" required>
                                <Option :value="item.value" v-for="(item,index) in rootNameList" :key="index">{{item.label}}</Option>
                            </Select>
                            <Input v-model="formItem.rootName" style="visibility: hidden;width:0;height: 0;overflow: hidden" required placeholder="新的根命名空间"></Input>
                        </FormItem>
                        <FormItem label="子空间">
                            <Input v-model="formItem.subName" required placeholder="输入空间名"></Input>
                        </FormItem>
                        <FormItem label="持续时间">
                            <Input v-model="formItem.duration" required placeholder="输入块数（整数）"></Input>
                            <p class="remindTxt">持续时间以块计算，一个块为12秒</p>
                            <p class="tails">有效期：0天</p>
                        </FormItem>
                        <FormItem label="费用">
                            <Input v-model="formItem.fee" type="number" required placeholder="0.05"></Input>
                            <p class="remindTxt">默认为：0.05000XEM，设置的费用越多，处理优先级越高</p>
                            <p class="tails">XEM</p>
                        </FormItem>
                        <FormItem>
                            <Button type="success" @click="createNamespace">创建</Button>
                        </FormItem>
                    </Form>
                </TabPane>
            </Tabs>
        </div>
        <div class="left namespaceList">
            <div class="namespaceListHeader">空间列表</div>
            <div class="namespaceListBody">
                <div class="listTit">
                    <Row>
                        <Col span="12">空间名</Col>
                        <Col span="6">有效期</Col>
                        <Col span="6"> </Col>
                    </Row>
                </div>
                <div class="listItem">
                    <Row>
                        <Col span="12">asgad</Col>
                        <Col span="6">21515</Col>
                        <Col span="6">
                            <div class="listFnDiv">
                                <Poptip  placement="bottom">
                                    <i class="moreFn"></i>
                                    <div slot="content" class="updateFn">
                                       <p class="fnItem" @click="showEditDialog">
                                           <i><img src="../../../assets/images/service/updateNamespace.png"></i><span>更新</span>
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
        <EditDialog :showNamespaceEditDialog="showNamespaceEditDialog" @closeNamespaceEditDialog="closeNamespaceEditDialog"></EditDialog>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import CheckPWDialog from '../../../components/checkPW-dialog/checkPWDialog.vue'
    import EditDialog from '../namespaceEdit-dialog/NamespaceEditDialog.vue'
    import './Namespace.less';

    @Component({
        components: {
            EditDialog,
            CheckPWDialog
        }
    })
    export default class Namespace extends Vue{
        formItem:any = {
            rootName:'',
            subName:'',
            duration:0,
            fee:0.05
        }
        currentTab:number = 0
        rootNameList :any[] = []
        showCheckPWDialog = false
        showNamespaceEditDialog = false

        showCheckDialog () {
            this.showCheckPWDialog = true
        }
        closeCheckPWDialog () {
            this.showCheckPWDialog = false
        }
        showEditDialog () {
            document.body.click()
            setTimeout(()=> {
                this.showNamespaceEditDialog = true
            })
        }
        closeNamespaceEditDialog () {
                this.showNamespaceEditDialog = false
        }

        checkEnd () {

        }

        createNamespace() {
            this.showCheckDialog()
        }

    }
</script>

<style scoped>

</style>
