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
                <span class="title">更新命名空间</span>
            </div>
            <div class="namespaceEditDialogBody">
                <div class="stepItem1">
                    <Form :model="namespace">
                        <FormItem label="空间名">
                            <p class="namespaceTxt">{{namespace.name}}</p>
                        </FormItem>
                        <FormItem label="持续时间">
                            <Input v-model="namespace.duration" required placeholder="输入块数（整数）"></Input>
                            <p class="tails">有效期：0天</p>
                        </FormItem>
                        <FormItem label="费用">
                            <Input v-model="namespace.fee" required placeholder="0.05"></Input>
                            <p class="tails">XEM</p>
                        </FormItem>
                        <FormItem label="密码">
                            <Input v-model="namespace.password" type="password" required placeholder="请输入钱包密码"></Input>
                        </FormItem>
                        <FormItem>
                            <Button type="success" @click="updateNamespace"> 确认 </Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        </Modal>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Prop, Watch} from 'vue-property-decorator';
    import './NamespaceEditDialog.less';
    @Component({
        components: {},
    })
    export default class namespaceEditDialog extends Vue{
        stepIndex = 0
        show = false
        namespace = {
            name:'asdwa',
            duration:'',
            fee:'',
            password:''
        }

        @Prop()
        showNamespaceEditDialog:boolean

        namespaceEditDialogCancel () {
            this.$emit('closeNamespaceEditDialog')
        }
        updateNamespace () {
            this.show = false
            this.namespaceEditDialogCancel()
            this.$Notice.success({title: '命名空间操作', desc: '更新成功'});
        }
        @Watch('showNamespaceEditDialog')
        onShowNamespaceEditDialogChange(){
            this.show = this.showNamespaceEditDialog
        }
    }
</script>

<style scoped>

</style>
