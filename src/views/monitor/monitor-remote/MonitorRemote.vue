<template xmlns="http://www.w3.org/1999/html">
    <div class="remote_board_container">

        <div class="top_network_info radius" style="display: block;">
            <div class="remote_total">
                <strong class="trend"> 累积委托收益量</strong>
                <div class="num_class">
                    <span class="trend_red"> 0.000</span>
                </div>
                <div class="state_class">
                    <div>
                        <span>当前状态:&nbsp&nbsp</span>
                        <span>Unlink</span>
                        <i-switch @on-change="change" class="switch_class_left" v-model="switchState">

                        </i-switch>
                    </div>
                    <div class="top_class_div">
                        <span>远程公钥:&nbsp&nbsp</span>
                        <span>null</span>
                    </div>
                </div>
            </div>
            <div class="question_class">
                <div>
                    <strong class="trend_ques" >相关问题:</strong>
                </div>
                <div>
                    <div class="wid_bord_class">
                        <span class="bord_class">1、怎么获得收益？</span>
                    </div>
                    <div class="content_des">
                        <span class="content_font" >委托收获使帐户能够使用可以安全
                            地与节点共享的代理私钥</span><br>
                        <span class="content_font" > 帐户激活委托收获后，其重要性分数将转
                            移到远程帐户。远程帐户继承了原始帐户的重要性
                        </span>
                    </div>
                </div>
                <div>
                    <div class="wid_bord_class">
                        <span class="bord_class">2、收益是怎么？</span>
                    </div>
                    <div>
                        <span class="content_font">创建新块的过程称为收获</span>
                    </div>
                </div>
            </div>

        </div>
        <div class="bottom_transactions radius">
            <strong class="trend">收益列表</strong>
            <div class="table_border">
                <i-table :data="tableData" :columns="tableColumns" size="small"></i-table>
                <div style="margin: 10px;overflow: hidden">
                    <div style="float: right;">
                        <Page :total="100" :current="1" @on-change="changePage"></Page>
                    </div>
                </div>
            </div>
        </div>
        <Modal
                title="委托收获"
                v-model="modal1"
                @on-ok="modalOk"
                @on-cancel="modalCancel"
                class-name="remote_dialog"
               >

                    <div class="margin_class_left" ><span class="model_class01">远程公钥</span></div>
                    <div class="margin_class_left"> <i-input class-name="input_width" placeholder="请输入或粘贴远程账户公钥"></i-input></div>

                    <div class="margin_class_left margin_top_modal"> <span class="model_class01">最大费用</span></div>
                    <div class="margin_class_left"> <i-input class-name="input_width" placeholder="请输入账号或密码"></i-input></div>
        </Modal>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';


    @Component({})
    export default class MonitorRemote extends Vue{

        modal1 = false
        switchState=false
        tableColumns=[
            {
                title:'收获块的hash',
                key:'hash'
            },{
                title:'收获块的高度',
                key:'height'
            },{
                title:'收获费用',
                key:'price'
            },{
                title:'时间',
                key:'time'
            }
        ]
        tableData=[
            {
                hash:'TCHFHHFE-FEFEFJI-FEFEFJIE-FEFE1',
                height:'213412',
                price:'10.232323XEM',
                time:'2019-12-12'
            },{
                hash:'TCHFHHFE-FEFEFJI-FEFEFJIE-FEFE2',
                height:'213412',
                price:'10.232323XEM',
                time:'2019-12-12'
            },{
                hash:'TCHFHHFE-FEFEFJI-FEFEFJIE-FEFE3',
                height:'213412',
                price:'10.232323XEM',
                time:'2019-12-12'
            },{
                hash:'TCHFHHFE-FEFEFJI-FEFEFJIE-FEFE4',
                height:'213412',
                price:'10.232323XEM',
                time:'2019-12-12'
            },{
                hash:'TCHFHHFE-FEFEFJI-FEFEFJIE-FEFE5',
                height:'213412',
                price:'10.232323XEM',
                time:'2019-12-12'
            }
        ]
        change (status) {
           if(status==true){
               this.modal1 = true
           }
        }
        changePage(){

        }
        modalOk(){

        }
        modalCancel(){
            this.switchState=false
        }
    }
</script>

<style scoped lang="less">
@import "MonitorRemote.less";
</style>