<template>
    <div class="walletCreatedWrap">
        <div class="createdDiv1" v-if="tags == 0">
                <p class="pageTit">备份助记词</p>
                <p class="pageTxt">备份助记词能有效备份和恢复你的账户</p>
                <p class="pageRemind">
                    <span class="remindTit">提示：</span>
                    不要透露你备份的助记词，任何有了助记词的人就可以永远拥有该钱包
                </p>
                <p class="pageRemind ">请将你的助记词写在一张纸上，如果你想更安全，可以写在多张纸上并在多个位置保存备份，（如外部加密硬盘驱动器或存储介质）。</p>
                <div class="mnemonicDiv clear">
                    <span>asda</span>
                    <span>qwewdas</span>
                    <span>qweqwe</span>
                </div>
                <div class="btns clear">
                    <Button class="prev left" type="default" @click="toBack">上一步</Button>
                    <Button class="next right" type="success" @click="changeTabs(1)">下一步</Button>
                </div>
        </div>
        <div class="createdDiv2" v-if="tags == 1">
            <p class="pageTit">确认助记词</p>
            <p class="pageTxt">请选择每个短语以确保助记词是正确的</p>
            <p class="pageRemind">如果你有记录备份自己的记助词，请务必通过左边程序进行验证，以确保记助词没有出现错误的问题。
                一旦因为错误，可能永远不能找回，你注意并理解其中的风险。
                如果你不想现在备份或验证，点击<span class="tails">SKIP</span>
                跳过此操作，但是请确认你的风险。如果需要再次备份助记词，可以钱包详情-导出助记词中找到。
            </p>
            <div class="mnemonicInputDiv">
                <div class="mnemonicWordDiv clear">
                    <span>asda</span>
                    <span>qwewdas</span>
                    <span>qweqwe</span>
                </div>
                <div class="wordDiv clear">
                    <span>asda</span>
                    <span>qwewdas</span>
                    <span>qweqwe</span>
                </div>
            </div>
            <div class="btns clear">
                <Button class="prev left" type="default" @click="changeTabs(0)">上一步</Button>
                <Button class="next right" type="success" @click="changeTabs(2)">下一步</Button>
            </div>
        </div>
        <div class="createdDiv3" v-if="tags == 2">
            <p class="pageTit">恭喜创建钱包成功</p>
            <p class="pageTxt">你通过了测试，请务必保证你的助记词安全</p>
            <div class="safetyTips">
                <Row>
                    <Col span="5">
                        <div class="successImg">
                            <img src="">
                        </div>
                    </Col>
                    <Col span="19">
                        <div class="safetyRemind">
                            <p class="remindTit">安全存储提示：</p>
                            <p class="remindItem">在多个位置保存备份</p>
                            <p class="remindItem">不要和任何人分享助记词。</p>
                            <p class="remindItem">小心网络钓鱼！Nano-wallet不会自然而然地要求您输入助记词。</p>
                            <p class="remindItem">如果需要再次备份助记词，可以钱包管理-钱包详情-导出助记词中找到。</p>
                            <p class="remindItem">Nemwallet无法恢复您的助记词.</p>
                        </div>
                    </Col>
                </Row>
            </div>
            <div class="btns">
                <Button class="next" type="success" @click="toWalletPage()">完成</Button>
            </div>
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
            if(index || index === 0){
                this.tags = index
            }
        }
        toWalletPage () {
            this.$router.replace({path:'/walletDetails'})
        }
        toBack () {
            this.$router.go(-1)
        }
    }
</script>

<style scoped>

</style>
