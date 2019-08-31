export const formData = {
    multisigTransferForm: {
        address: 'SCSXIT-R36DCY-JRVSNE-NY5BUA-HXSL7I-E6ULEY-UYRC',
        remark: '',
        multisigPublickey: '',
        innerFee: 1000000,
        lockFee: 10000000,
        aggregateFee: 1000000,
        mosaicTransferList: [],
        isEncryption: true
    },
    transferForm: {
        fee: 50000,
        remark: '',
        address: '',
        mosaicTransferList: [],
        isEncrypted: true
    },
    mosaicAliasForm :{
        aliasName: '',
        fee: 50000,
        password: ''
    },
    mosaicEditForm:{
        id: '',
        aliasName: '',
        delta: 0,
        supplyType: 1,
        changeDelta: 0,
        duration: '',
        fee: 50000,
        password: ''
    },
    mosaicUnaliasForm:   {
        fee: 50000,
        password: ''
    },
    mosaicTransactionForm:{
        supply: 500000000,
        divisibility: 6,
        transferable: true,
        supplyMutable: true,
        permanent: false,
        duration: 1000,
        innerFee: 50000,
        aggregateFee: 50000,
        lockFee: 50000,
        multisigPublickey: ''
    },
    multisigConversionForm: {
        publickeyList: [],
        minApproval: 1,
        minRemoval: 1,
        bondedFee: 10000000,
        lockFee: 10000000,
        innerFee: 10000000
    },
    multisigManagementForm:{
        minApprovalDelta: 0,
        minRemovalDelta: 0,
        bondedFee: 10000000,
        lockFee: 10000000,
        innerFee: 10000000,
        cosignerList: [],
        multisigPublickey: ''
    },
    namesapceEditForm:{
        name: '',
        duration: 0,
        fee: 50000,
        password: ''
    },
    rootNamespaceForm:{
        duration: 1000,
        rootNamespaceName: '',
        multisigPublickey: '',
        innerFee: 50000,
        aggregateFee: 50000,
        lockFee: 50000
    },
    walletImportMnemonicForm:{
        mnemonic: '',
        networkType: 0,
        walletName: '',
        password: '',
        checkPW: '',
    },
    walletImportPrivateKeyForm: {
        privateKey: 'FB628AF4276F696AD1FA85B7AB1E49CFD896E5EC85000E3179EEEA59717DD8DE',
        networkType: 0,
        walletName: '',
        password: '',
        checkPW: '',
    }

}
