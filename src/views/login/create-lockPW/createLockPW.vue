<template>
    <div class="createLockWrap">
        <h1 class="pageTit">创建Lock密码</h1>
        <p class="pageRemind">本密码用于桌面钱包的锁定，一旦丢失，你将失去进入桌面钱包的权利； 因此你需要对你的资产账户的记助词或私钥进行备份，以便恢复。</p>
        <p class="pageRemind">本密码是进入桌面钱包的依据，没有转账的权利，转帐需要你的私钥密码才能完成。</p>
        <div class="formDiv">
            <Form :model="lockPW">
                <FormItem label="新密码（至少8个字符）">
                    <Input v-model="lockPW.password" type="password"  required placeholder="请输入钱包名"></Input>
                </FormItem>
                <FormItem label="确认密码">
                    <Input v-model="lockPW.checkPW" type="password" required placeholder="请输入设置的密码"></Input>
                </FormItem>
                <FormItem label="设置密码提示">
                    <p class="PWRemind">密码提示，在忘记密码时有很大帮助</p>
                    <Input v-model="lockPW.remindTxt" type="txt" required placeholder="请设置密码提示"></Input>
                </FormItem>
            </Form>
        </div>
        <div class="buttonDiv clear">
            <Button class="prev left">返回欢迎页</Button>
            <Button class="next right">下一步</Button>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    @Component({
        components: {}
    })
    export default class createLockPW extends Vue{
        lockPW:any = {
            password:'',
            checkPW:'',
            remindTxt:''
        }

        toPrevPage () {

        }

        toNextPage () {

        }
    }
</script>
