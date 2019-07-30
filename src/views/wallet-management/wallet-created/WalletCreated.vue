<template>
  <div class="walletCreatedWrap">
    <div class="createdDiv1" v-if="tags == 0">
      <p class="pageTit">{{$t('backup_mnemonic')}}</p>
      <p class="pageTxt">{{$t('Backup_mnemonics_can_effectively_back_up_and_restore_your_account')}}</p>
      <p class="pageRemind">
        <span class="remindTit">{{$t('tips')}}：</span>
        {{$t('Do_not_reveal_the_mnemonic_you_backed_up_Anyone_with_a_mnemonic_can_always_own_the_wallet')}}
      </p>
      <p class="pageRemind ">
        {{$t('Write_your_mnemonic_on_a_piece_of_paper_If_you_want_to_be_safer_you_can_write_on_multiple_sheets_of_paper_and_save_the_backup_in_multiple_locations_such_as_an_externally_encrypted_hard_drive_or_storage_media')}}</p>
      <div class="mnemonicDiv clear">
        <span v-for="(item,index) in mnemonic" :key="index">{{item}}</span>
        <div class="covering" @click="hideCover" v-if="showCover">
          <div class="lock"><img src="../../../assets/images/wallet-management/mnemonicLock.png"></div>
          <p class="txt">{{$t('display_mnemonic')}}</p>
        </div>
      </div>
      <div class="btns clear">
        <Button class="prev left" type="default" @click="toBack">{{$t('previous')}}</Button>
        <Button class="next right" type="success" @click="changeTabs(1)">{{$t('next')}}</Button>
      </div>
    </div>
    <div class="createdDiv2" v-if="tags == 1">
      <p class="pageTit">{{$t('Confirm_mnemonic')}}</p>
      <p class="pageTxt">{{$t('Please_select_each_phrase_to_make_sure_the_mnemonic_is_correct')}}</p>
      <p class="pageRemind">
        {{$t('If_you_have_a_record_to_back_up_your_own_supporting_words_be_sure_to_verify_it_with_the_left_program_to_ensure_that_there_are_no_errors_in_the_auxiliary_words_Once_you_are_mistaken_you_may_never_be_able_to_get_it_back_You_pay_attention_to_and_understand_the_risks_involved_If_you_dont_want_to_back_up_or_verify_now')}}{{$t('click')}}<span
              class="tails" @click="skipInput(2)"> SKIP</span>
        {{$t('Skip_this_action_but_please_confirm_your_risk_If_you_need_to_back_up_the_mnemonic_again_you_can_find_it_in_the_Wallet_Details_Export_mnemonic')}}
      </p>
      <div class="mnemonicInputDiv">
        <div class="mnemonicWordDiv clear" ref="mnemonicWordDiv">
        </div>
        <div class="wordDiv clear">
          <span v-for="(item,index) in mnemonicRandomArr" :key="index" @click="sureWord(index)">{{item}}</span>
        </div>
      </div>
      <div class="btns clear">
        <Button class="prev left" type="default" @click="changeTabs(0)">{{$t('previous')}}</Button>
        <Button class="next right" type="success" @click="changeTabs(2)">{{$t('next')}}</Button>
      </div>
    </div>
    <div class="createdDiv3" v-if="tags == 2">
      <p class="pageTit">{{$t('Congratulations_on_creating_a_wallet')}}</p>
      <p class="pageTxt">{{$t('You_passed_the_test_please_be_sure_to_keep_your_mnemonic_safe')}}</p>
      <div class="safetyTips">
        <Row>
          <Col span="2">
            <div class="successImg">
              <img src="../../../assets/images/wallet-management/exported.png">
            </div>
          </Col>
          <Col span="19">
            <div class="safetyRemind">
              <p class="remindTit">{{$t('Secure_storage_prompt')}}：</p>
              <p class="remindItem">{{$t('Save_backups_in_multiple_locations')}}</p>
              <p class="remindItem">{{$t('Don_not_share_mnemonics_with_anyone')}}</p>
              <p class="remindItem">
                {{$t('Beware_of_phishing_Nano_wallet_does_not_naturally_ask_you_to_enter_a_mnemonic')}}</p>
              <p class="remindItem">
                {{$t('If_you_need_to_back_up_your_mnemonics_again_you_can_find_them_in_Wallet_Management_Wallet_Details_Export_Mnemonics')}}</p>
              <p class="remindItem">{{$t('Nemwallet_can_not_recover_your_mnemonic')}}</p>
            </div>
          </Col>
        </Row>
      </div>
      <div class="btns">

        <Button class="next" type="success" @click="toWalletPage()">{{$t('complete')}}</Button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import './WalletCreated.less'
    import {NetworkType, UInt64, Crypto} from "nem2-sdk";
    import {MnemonicPassPhrase, ExtendedKey, Wallet} from 'nem2-hd-wallets';
    import {localRead, localSave} from '../../../utils/util';
    import {strToHexCharCode} from '../../../utils/tools';
    import {walletInterface} from "../../../interface/sdkWallet";
    import Message from "@/message/Message";

    @Component({
        components: {},
    })
    export default class WalletCreated extends Vue{
        @Prop({default:{}})
        createForm: any

        tags = 0
        formItem = {
            currentNetType: '',
            walletName: '',
            password: '',
            checkPW: '',
        }
        netType = [
            {
                value: NetworkType.MIJIN_TEST,
                label: 'MIJIN_TEST'
            }, {
                value: NetworkType.MAIN_NET,
                label: 'MAIN_NET'
            }, {
                value: NetworkType.TEST_NET,
                label: 'TEST_NET'
            }, {
                value: NetworkType.MIJIN,
                label: 'MIJIN'
            },
        ]
        showCover = true
        mnemonicRandomArr = []
        mosaics = []
        storeWallet = {}

        get mnemonic () {
            const mnemonic = this.$store.state.app.mnemonic
            return mnemonic['split'](' ')
        }

        get formInfo () {
            return this.createForm;
        }

        get node () {
            return 'http://120.79.181.170:3000'
        }

        get walletList () {
            return this.$store.state.app.walletList
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
            if (JSON.stringify(childWord) != JSON.stringify(this.mnemonic)) {
                if (childWord.length < 1) {
                    this.$Message.warning(Message.PLEASE_ENTER_MNEMONIC_INFO);
                } else {
                    this.$Message.warning(Message.MNEMONIC_INCONSISTENCY_ERROR);
                }
                return false
            }
            return true
        }

        changeTabs (index) {
            switch (index) {
                case 0:
                    this.tags = index
                    break;
                case 1:
                    this.mnemonicRandom()
                    this.tags = index
                    break;
                case 2:
                    if(!this.checkMnemonic()){
                        return
                    }
                    const account = this.createAccount()
                    this.loginWallet(account)
                    this.tags = index
                    break;
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

        skipInput (index) {
            const account = this.createAccount()
            this.loginWallet(account)
            this.tags = index
        }

        createAccount () {
            const mnemonic = new MnemonicPassPhrase(this.mnemonic.join(' '));
            const bip32Seed = mnemonic.toSeed();
            const  bip32Node = ExtendedKey.createFromSeed(this.buf2hex(bip32Seed));
            const wallet = new Wallet(bip32Node);
            const account = wallet.getAccount();
            this.$store.commit('SET_ACCOUNT',account);
            return account
        }

        loginWallet (account) {
            const that = this
            const walletName:any = this.formInfo['walletName'];
            const netType:NetworkType = Number(this.formInfo['currentNetType'])
            that.setUserDefault(walletName, account, netType)
        }

        setUserDefault  (name, account, netType) {
            const that = this
            const walletList = this.$store.state.app.walletList
            const style = 'walletItem_bg_' + walletList.length % 3
            walletInterface.getWallet({
                name: name,
                networkType: netType,
                privateKey: account.privateKey
            }).then((Wallet: any) => {
                const storeWallet = {
                    name: Wallet.result.wallet.name,
                    address: Wallet.result.wallet.address['address'],
                    networkType: Wallet.result.wallet.address['networkType'],
                    privateKey: Wallet.result.privateKey,
                    publicKey: account.publicKey,
                    publicAccount: account.publicAccount,
                    mosaics: [],
                    wallet: Wallet.result.wallet,
                    password: Wallet.result.password,
                    balance: 0,
                    style
                }
                this.storeWallet = storeWallet
                that.$store.commit('SET_WALLET', storeWallet)
                const encryptObj = Crypto.encrypt(Wallet.result.privateKey, that.formInfo['password'])
                const mnemonicEnCodeObj = Crypto.encrypt(strToHexCharCode(this.mnemonic.join(' ')), that.formInfo['password'])
                that.localKey(storeWallet, encryptObj, mnemonicEnCodeObj)
            })
        }

        localKey (wallet, keyObj, mnemonicEnCodeObj) {
            let localData: any[] = []
            let isExist: boolean = false
            try {
                localData = JSON.parse(localRead('wallets'))
            } catch (e) {
                localData = []
            }
            let saveData = {
                name: wallet.name,
                ciphertext: keyObj.ciphertext,
                iv: keyObj.iv,
                networkType: wallet.networkType,
                address: wallet.address,
                publicKey: wallet.publicKey,
                mnemonicEnCodeObj:mnemonicEnCodeObj
            }
            let account = this.$store.state.account.wallet;
            account = Object.assign(account, saveData)
            this.$store.commit('SET_WALLET', account)
            for (let i in localData) {
                if (localData[i].address === wallet.address) {
                    localData[i] = saveData
                    isExist = true
                }
            }
            if (!isExist) localData.unshift(saveData)
            localSave('wallets', JSON.stringify(localData))
        }

        toWalletPage () {
            this.$store.commit('SET_HAS_WALLET',true)
            this.$emit('toWalletDetails')
        }

        toBack () {
            this.$emit('closeCreated')
        }
    }
</script>

<style scoped>

</style>
