import {NetworkType, MosaicSupplyChangeAction} from "nem2-sdk"
import {FEE_SPEEDS} from '../constants'

export const formDataConfig = {
    settingPassword: {
        previousPassword: '',
        newPassword: '',
        confirmPassword: '',
        cipher: '',
    },
    offsetLineForm: {
        generationHash: '',
        mosaicId: '',
        divisibility: 1,
        ticker: 'XEM',
        mosaicName: '',
    },
    createAccountForm: {
        accountName: '',
        password: '',
        passwordAgain: '',
        hint: '',
    },
    importKeystoreConfig: {
        walletName: 'keystore-wallet',
        keystoreStr: '',
        keystorePassword: ''
    },
    transferForm: {
        recipient: '',
        remark: '',
        multisigPublicKey: '',
        feeSpeed: FEE_SPEEDS.NORMAL,
        mosaicTransferList: [],
        isEncrypted: true
    },
    remoteForm: {
        remotePublicKey: '',
        feeSpeed: FEE_SPEEDS.NORMAL,
        password: ''
    },
    mosaicAliasForm: {
        mosaicName: '',
        feeSpeed: FEE_SPEEDS.NORMAL,
        password: ''
    },
    mosaicEditForm: {
        delta: 1,
        supplyType: MosaicSupplyChangeAction.Increase,
        feeSpeed: FEE_SPEEDS.NORMAL,
    },
    mosaicUnAliasForm: {
        feeSpeed: FEE_SPEEDS.NORMAL,
        password: ''
    },
    addressAliasForm: {
        address: '',
        feeSpeed: FEE_SPEEDS.NORMAL,
        password: ''
    },
    alias: {
        feeSpeed: FEE_SPEEDS.NORMAL,
        password: ''
    },
    mosaicTransactionForm: {
        restrictable: false,
        supply: 500000000,
        divisibility: 0,
        transferable: true,
        supplyMutable: true,
        permanent: true,
        duration: 1000,
        feeSpeed: FEE_SPEEDS.NORMAL,
        multisigPublicKey: ''
    },
    multisigConversionForm: {
        minApproval: 1,
        minRemoval: 1,
        feeSpeed: FEE_SPEEDS.NORMAL,
        multisigPublicKey: '',
    },
    multisigModificationForm: {
        minApproval: 0,
        minRemoval: 0,
        feeSpeed: FEE_SPEEDS.NORMAL,
        multisigPublicKey: '',
    },
    namespaceEditForm: {
        name: '',
        duration: 1000,
        feeSpeed: FEE_SPEEDS.NORMAL,
    },
    rootNamespaceForm: {
        duration: 1000000,
        rootNamespaceName: '',
        multisigPublicKey: '',
        feeSpeed: FEE_SPEEDS.NORMAL,
    },
    subNamespaceForm: {
        rootNamespaceName: '',
        subNamespaceName: '',
        multisigPublicKey: '',
        feeSpeed: FEE_SPEEDS.NORMAL,
    },
    walletImportMnemonicForm: {
        mnemonic: '',
        walletName: '',
    },
    walletImportPrivateKeyForm: {
        privateKey: '',
        walletName: 'wallet-privateKey',
    },
    trezorImportForm: {
        networkType: NetworkType.MIJIN_TEST,
        accountIndex: 0,
        walletName: 'Trezor Wallet'
    },
    walletCreateForm: {
        walletName: 'wallet-create',
        path: 0
    }
}
