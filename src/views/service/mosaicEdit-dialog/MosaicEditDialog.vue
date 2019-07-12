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
                <span class="title">修改供应量</span>
            </div>
            <div class="mosaicEditDialogBody">
                <div class="stepItem1">
                    <Form :model="mosaic">
                        <FormItem label="马赛克ID">
                            <p class="mosaicTxt">{{mosaic.id}}</p>
                        </FormItem>
                        <FormItem label="别名">
                            <p class="mosaicTxt">{{mosaic.aliasName}}</p>
                        </FormItem>
                        <FormItem label="现有供应量">
                            <p class="mosaicTxt">{{mosaic.delta}}</p>
                        </FormItem>
                        <FormItem label="变更类型">
                            <RadioGroup v-model="mosaic.supplyType">
                                <Radio label="增加"></Radio>
                                <Radio label="减少"></Radio>
                            </RadioGroup>
                        </FormItem>
                        <FormItem label="变更量">
                            <Input v-model="mosaic.changeDelta"  required placeholder="请输入变更量"></Input>
                            <p class="tails">XEM</p>
                        </FormItem>
                        <FormItem label="变更后供应量">
                            <p class="mosaicTxt">100.000000XEM</p>
                        </FormItem>
                        <FormItem label="费用">
                            <Input v-model="mosaic.fee"  required placeholder="0.05"></Input>
                            <p class="tails">XEM</p>
                        </FormItem>
                        <FormItem label="密码">
                            <Input v-model="mosaic.password" type="password" required placeholder="请输入钱包密码"></Input>
                        </FormItem>
                        <FormItem>
                            <Button type="success" @click="updateMosaic"> 更新 </Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        </Modal>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Prop, Watch} from 'vue-property-decorator';
    import './MosaicEditDialog.less';
    @Component({
        components: {},
    })
    export default class mosaicEditDialog extends Vue{
        show = false
        mosaic = {
            id:'3692FF952D89DD45',
            aliasName:'@cat.currency',
            delta:'100.000000XEM',
            supplyType:'增加',
            changeDelta:'',
            duration:'',
            fee:'',
            password:''
        }

        @Prop()
        showMosaicEditDialog:boolean

        mosaicEditDialogCancel () {
            this.$emit('closeMosaicEditDialog')
        }
        updateMosaic () {
            this.show = false
            this.mosaicEditDialogCancel()
            this.$Notice.success({title: '马赛克操作', desc: '更新成功'});
        }
        @Watch('showMosaicEditDialog')
        onShowMosaicEditDialogChange(){
            this.show = this.showMosaicEditDialog
        }
    }
</script>

<style scoped>

</style>
