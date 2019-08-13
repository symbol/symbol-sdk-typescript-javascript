
import {Message} from "@/config/index"
import {NetworkType, UInt64, Crypto} from "nem2-sdk"
import {walletInterface} from "@/interface/sdkWallet"
import {Component, Prop, Vue} from 'vue-property-decorator'
import {localRead, localSave,strToHexCharCode} from '@/help/help'
import {MnemonicPassPhrase, ExtendedKey, Wallet} from 'nem2-hd-wallets'

@Component
export class WalletCreatedTs extends Vue{

    tags = 0
    mosaics = []
    storeWallet = {}
    showCover = true
    mnemonicRandomArr = []
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


    @Prop({default:{}})
    createForm: any


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
                this.$Notice.warning({title:''+this.$t(Message.PLEASE_ENTER_MNEMONIC_INFO)})
            } else {
                this.$Notice.warning({title:''+this.$t(Message.MNEMONIC_INCONSISTENCY_ERROR)})
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
