<template>
    <div class="mosaicAliasDialogWrap">
        <Modal
                v-model="show"
                class-name="vertical-center-modal"
                :footer-hide="true"
                :width="1000"
                :transfer="false"
                @on-cancel="mosaicAliasDialogCancel">
            <div slot="header" class="mosaicAliasDialogHeader">
                <span class="title">绑定别名</span>
            </div>
            <div class="mosaicAliasDialogBody">
                <div class="stepItem1">
                    <Form :model="mosaic">
                        <FormItem label="马赛克ID">
                            <p class="mosaicTxt">{{mosaic.id}}</p>
                        </FormItem>
                        <FormItem label="别名选择">
                            <Select v-model="mosaic.aliasName" required>
                                <Option :value="item.value" v-for="(item,index) in aliasNameList" :key="index">{{item.label}}</Option>
                            </Select>
                            <div class="selectAliasNameIcon"></div>
                        </FormItem>
                        <FormItem label="费用">
                            <Input v-model="mosaic.fee"  required placeholder="0.05"></Input>
                            <p class="tails">XEM</p>
                        </FormItem>
                        <FormItem label="密码">
                            <Input v-model="mosaic.password" type="password" required placeholder="请输入钱包密码"></Input>
                        </FormItem>
                        <FormItem>
                            <Button type="success" @click="updateMosaicAlias"> 绑定 </Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        </Modal>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Prop, Watch} from 'vue-property-decorator';
    import './MosaicAliasDialog.less';
    @Component({
        components: {},
    })
    export default class mosaicAliasDialog extends Vue{
        show = false
        mosaic = {
            id:'3692FF952D89DD45',
            aliasName:'',
            fee:'',
            password:''
        }
        aliasNameList:any[] = [
            {value:'asd',label:'asd'},
            {value:'123',label:'123'},
        ]

        @Prop()
        showMosaicAliasDialog:boolean

        mosaicAliasDialogCancel () {
            this.$emit('closeMosaicAliasDialog')
        }
        updateMosaicAlias () {
            this.show = false
            this.mosaicAliasDialogCancel()
            this.$Notice.success({title: '马赛克别名操作', desc: '绑定成功'});
        }
        @Watch('showMosaicAliasDialog')
        onShowMosaicAliasDialogChange(){
            this.show = this.showMosaicAliasDialog
        }
    }
</script>

<style scoped>

</style>
