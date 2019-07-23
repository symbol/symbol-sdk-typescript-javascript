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
                    <span v-for="(item,index) in mnemonic" :key="index">{{item}}</span>
                    <div class="covering" @click="hideCover" v-if="showCover">
                        <div class="lock"><img src="../../../assets/images/wallet-management/mnemonicLock.png"></div>
                        <p class="txt">显示助记词</p>
                    </div>
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
                <div class="mnemonicWordDiv clear" ref="mnemonicWordDiv">
                </div>
                <div class="wordDiv clear">
                    <span v-for="(item,index) in mnemonicRandomArr" :key="index" @click="sureWord(index)">{{item}}</span>
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
                    <Col span="2">
                        <div class="successImg">
                            <img src="../../../assets/images/wallet-management/exported.png">
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
    import {NetworkType, UInt64, Crypto} from "nem2-sdk";
    import {MnemonicPassPhrase, ExtendedKey, Wallet} from 'nem2-hd-wallets';
    import {localRead, localSave} from '../../../utils/util'
    import {walletInterface} from "../../../interface/sdkWallet";

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
        showCover = true
        mnemonicRandomArr = []
        mosaics = []

        get mnemonic () {
            const mnemonic = this.$store.state.app.mnemonic
            return mnemonic['split'](' ')
        }

        get formInfo () {
            return this.$route.query;
        }

        get node () {
            return 'http://120.79.181.170:3000'
        }

        hideCover () {
            this.showCover = false
        }
        checkRandomArr (arr,mnemonic) {
            const randomNum = this.randomNum(mnemonic)
            if(arr.includes(randomNum)){
                return this.checkRandomArr(arr,mnemonic)
            }else {
                return randomNum
            }
        }

        randomNum (mnemonic) {
            return Math.floor(Math.random()*(mnemonic.length))
        }

        mnemonicRandom () {
            const mnemonic = this.mnemonic;
            let numberArr = [];
            let randomWord =[];
            for(let i=0;i<mnemonic.length;i++){
                const randomNum = this.checkRandomArr(numberArr,mnemonic)
                numberArr.push(randomNum)
                randomWord.push(mnemonic[randomNum])
            }
            this.mnemonicRandomArr = randomWord
        }

        sureWord (index) {
            const word = this.mnemonicRandomArr[index]
            const wordSpan = document.createElement('span');
            wordSpan.innerText = word;
            wordSpan.onclick = () => {
                this.$refs['mnemonicWordDiv']['removeChild'](wordSpan)
            }
            this.$refs['mnemonicWordDiv']['append'](wordSpan)
        }

        checkMnemonic () {
            const mnemonicDiv = this.$refs['mnemonicWordDiv'];
            const mnemonicDivChild = mnemonicDiv['getElementsByTagName']('span');
            let childWord = []
            for(let i in mnemonicDivChild){
                if( typeof mnemonicDivChild[i] !== "object") continue;
                childWord.push(mnemonicDivChild[i]['innerText'])
            }
            if(JSON.stringify(childWord) != JSON.stringify(this.mnemonic)) {
                if(childWord.length < 1){
                    this.$Message.warning('请输入助记词，确保助记词事正确的');
                }else {
                    this.$Message.warning('助记词不一致');
                }
                return false
            }
            return true
        }

        changeTabs (index) {
            if(index || index === 0){
                if(index === 1) this.mnemonicRandom()
                if(index === 2){
                    if(this.checkMnemonic()){
                        return
                    }else {
                        const account = this.createPrivateKey()
                        this.loginWallet(account.privateKey)
                    }
                }
                this.tags = index
            }
        }

        buf2hex(buffer) {
            // buffer is an ArrayBuffer
            // create a byte array (Uint8Array) that we can use to read the array buffer
            const byteArray = new Uint8Array(buffer);

            // for each element, we want to get its two-digit hexadecimal representation
            const hexParts = [];
            for(let i = 0; i < byteArray.length; i++) {
                // convert value to hexadecimal
                const hex = byteArray[i].toString(16);

                // pad with zeros to length 2
                const paddedHex = ('00' + hex).slice(-2);

                // push to array
                hexParts.push(paddedHex);
            }

            // join all the hex values of the elements into a single string
            return hexParts.join('');
        }

        createPrivateKey () {
            const mnemonic = new MnemonicPassPhrase(this.mnemonic.join(' '));
            const bip32Seed = mnemonic.toSeed();
            const  bip32Node = ExtendedKey.createFromSeed(this.buf2hex(bip32Seed));
            const wallet = new Wallet(bip32Node);
            const account = wallet.getAccount();
            this.$store.commit('SET_ACCOUNT',account);
            return account
        }

        loginWallet (privateKey:string) {
            const that = this
            const walletName:any = this.formInfo['walletName'];
            const netType:NetworkType = Number(this.formInfo['currentNetType'])
            walletInterface.loginWallet({
                name: walletName,
                privateKey: privateKey,
                networkType: netType,
                node:this.node
            }).then((loginWallet: any) => {
                console.log(loginWallet)
                that.getUserInfo(walletName, loginWallet.result.password, privateKey, loginWallet)
            })
        }

        getUserInfo (walletName, password, privateKey, loginWallet) {
            const that = this
            walletInterface.getKeys({
                password: password,
                wallet: loginWallet.result.wallet
            }).then((getKeys: any) => {
                console.log(getKeys)
                that.$store.commit('SET_WALLET', {
                    name: loginWallet.result.wallet.name,
                    address: loginWallet.result.wallet.address['address'],
                    networkType: loginWallet.result.wallet.address['networkType'],
                    privateKey: getKeys.result.account.privateKey,
                    publicKey: getKeys.result.account.publicAccount.publicKey,
                    publicAccount: getKeys.result.account.publicAccount,
                    mosaics: [],
                    wallet: loginWallet.result.wallet,
                    password: loginWallet.result.password
                })
                const encryptObj = Crypto.encrypt(privateKey, that.formInfo['password'])
                that.localKey(walletName, encryptObj, loginWallet.result.wallet.address.address)
            })
        }

        localKey (walletName, keyObj, address, balance = 0) {
            let localData: any[] = []
            let isExist: boolean = false
            try {
                localData = JSON.parse(localRead('wallets'))
            } catch (e) {
                localData = []
            }
            const saveData = {
                name: walletName,
                ciphertext: keyObj.ciphertext,
                iv: keyObj.iv,
                networkType: Number(this.formInfo['currentNetType']),
                address: address,
                balance: balance
            }
            for (let i in localData) {
                if (localData[i].address === address) {
                    localData[i] = saveData
                    isExist = true
                }
            }
            if (!isExist) localData.unshift(saveData)
            localSave('wallets', JSON.stringify(localData))
        }

        toWalletPage () {
            this.$store.commit('SET_WALLET_LIST',[{name:'a'}])
            this.$store.commit('SET_HAS_WALLET',true)
            this.$router.replace({
                path:'/walletDetails',
                query: {
                    tabIndex: '0'
                }
            })
        }
        toBack () {
            this.$router.go(-1)
        }
    }
</script>

<style scoped>

</style>
