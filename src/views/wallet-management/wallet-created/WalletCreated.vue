<template>
    <div class="walletCreatedWrap">
        <div class="createdDiv">
            <div class="createdForm">
                <p class="formTit">创建成功</p>
                <p class="formRemind">
                    <span class="tails">助记词，私钥，keystore</span>
                    掌管着你的账户最高权限，同时也是再次导入该钱包的依据，请确保你身边没有其他人看你的屏幕并将其保存到某个秘密且安全的地方.
                </p>
                <Collapse v-model="tags" accordion>
                    <Panel name="1">
                        助记词
                        <div slot="content">
                            <p class="mnemonic">test word cat car wallet address test word cat car wallet address</p>
                            <Button type="primary" icon="ios-download-outline">助记词下载</Button>
                        </div>
                    </Panel>
                    <Panel name="2">
                        私钥
                        <div slot="content">
                            <p class="privateKey">571cba91c56605a5ac115918be84b454333ccb600310a0bf3dec25ff778e04b9cd749dc03c974</p>
                            <Button type="primary" icon="ios-download-outline">私钥下载</Button>
                        </div>
                    </Panel>
                    <Panel name="3">
                        Keystore
                        <div slot="content">
                            <p>{"crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"5eb58323f39467d9a4b7c14b76fb2154"},"ciphertext":"571cba91c56605a5ac115918be84b454333ccb600310a0bf3dec25ff778e04b9","kdf":"pbkdf2","kdfparams":{"c":10240,"dklen":32,"prf":"hmac-sha256","salt":"a417c49dbeb3bbec79cfbf3cda545e47b4ce150f4e32b7d4c3de34b4c9b4a496"},"mac":"ee97c769b3fde908a5e59689de6226107d098e27b0508cde8449143008c1f6c1"},"id":"e6ba80f1-fd2b-407c-9ef6-cec880ce481e","version":3,"address":"d18ad549395b1c03c05ec4375ed99c9737e51594"}
                            </p>
                            <Button type="primary" icon="ios-download-outline">Keystore文件下载</Button>
                        </div>
                    </Panel>
                </Collapse>
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
        tags = '0'
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
    }
</script>

<style scoped>

</style>
