<template>
    <div class="walletCreatedWrap">
        <div class="createdDiv1" v-if="tags == 0">
                <p class="pageTit">备份助记词</p>
                <p class="pageTxt">备份助记词能有效备份和恢复你的账户</p>
                <p class="pageRemind">
                    <span class="tails">提示：</span>
                    不要透露你备份的助记词，任何有了助记词的人就可以永远拥有该钱包
                </p>
                <p class="pageRemind ">请将你的助记词写在一张纸上，如果你想更安全，可以写在多张纸上并在多个位置保存备份，（如外部加密硬盘驱动器或存储介质）。</p>
                <div class="mnemonicDiv">

                </div>
                <div class="btns clear">
                    <Button class="prev left" type="default" @click="toBack">上一步</Button>
                    <Button class="next right" type="success" @click="changeTabs(1)">下一步</Button>
                </div>
        </div>
        <div class="createdDiv2" v-if="tags == 1">

        </div>
        <div class="createdDiv3" v-if="tags == 2">

        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import './WalletCreated.less'
    import {NetworkType} from "nem2-sdk";

    @Component({
        components: {},
    })
    export default class WalletCreated extends Vue{
        tags = 0
        formItem = {
            currentNetType: '',
            walletName: '',
            password: '',
            checkPW: '',
        }
        netType = [
            {
                value:NetworkType.MIJIN_TEST,
                label:'MIJIN_TEST'
            },{
                value:NetworkType.MAIN_NET,
                label:'MAIN_NET'
            },{
                value:NetworkType.TEST_NET,
                label:'TEST_NET'
            },{
                value:NetworkType.MIJIN,
                label:'MIJIN'
            },
        ]

        changeTabs (index) {
            if(index){
                this.tags = index
            }
        }

        toBack () {
            this.$router.go(-1)
        }
    }
</script>

<style scoped>

</style>
