<template>
    <div class="namespaceWrap clear">
        <div class="left createDiv">
            <div class="createHeader">

            </div>
            <div class="createBody">
                <Form :model="formItem">
                    <FormItem label="父命名空间">
                        <Select v-model="formItem.rootName" required>
                            <Option :value="item.value" v-for="(item,index) in rootNameList" :key="index">{{item.label}}</Option>
                        </Select>
                        <Input v-model="formItem.rootName" required placeholder="新的根命名空间"></Input>
                    </FormItem>
                    <FormItem label="子空间">
                        <Input v-model="formItem.subName" required placeholder="输入空间名"></Input>
                    </FormItem>
                    <FormItem label="持续时间">
                        <Input v-model="formItem.duration" required placeholder="输入块数（如1，2，3...）"></Input>
                    </FormItem>
                    <FormItem label="费用">
                        <Input v-model="formItem.fee"  required placeholder="0.05"></Input>
                        <p class="inputRemind">默认为：0.05000XEM，设置的费用越多，处理优先级越高</p>
                    </FormItem>
                    <FormItem>
                        <Button type="success" @click="createNamespace">创建</Button>
                    </FormItem>
                </Form>
            </div>
        </div>
        <div class="left namespaceList">
            <div class="namespaceListHeader">

            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import './Namespace.less';

    @Component({
        components: {}
    })
    export default class Namespace extends Vue{
        formItem:any = {
            rootName:'',
            subName:'',
            duration:0,
            fee:0
        }
        rootNameList :any[] = []

        createNamespace() {

        }

    }
</script>

<style scoped>

</style>
