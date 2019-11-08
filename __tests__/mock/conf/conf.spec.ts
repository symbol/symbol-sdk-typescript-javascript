import {Account, NetworkType, Password, SimpleWallet} from 'nem2-sdk'

// cosigner
export const CosignAccount = Account.createFromPrivateKey(
    '27002B109810E4C25E8E6AE964FAF129CC3BFD1A95CB99062E0205060041D0C9',
    NetworkType.MIJIN_TEST)

// cosigner
export const Cosign2Account = Account.createFromPrivateKey(
    '8472FA74A64A97C85F0A285299D9FD2D44D71CB5698FE9C7E88C33001F9DD83F',
    NetworkType.MIJIN_TEST)

// multisig 1-of-1
export const MultisigAccount = Account.createFromPrivateKey(
    'CAD57FEC0C7F2106AD8A6203DA67EE675A1A3C232C676945306448DF5B4124F8',
    NetworkType.MIJIN_TEST)

// multisig 2-of-2
export const Multisig2Account = Account.createFromPrivateKey(
    '72B08ACF80558B285EADA206BB1226A44038C65AC4649108B2284591641657B5',
    NetworkType.MIJIN_TEST)

export const mosaics = {
    "308F144790CD7BC4": {
        balance: 7496.299725,
        expirationHeight: "Forever",
        hex: "308F144790CD7BC4",
        mosaicInfo: Object,
        name: "nem.xem",
        namespaceHex: "D525AD41D95FCF29",
        properties: {
            divisibility: 6,
            duration: 0,
            restrictable: false,
            supplyMutable: false,
            transferable: true

        },
    },
    "4EB2D6C822D8A9F7": {
        balance: 0.066666,
        expirationHeight: 135718,
        hex: "4EB2D6C822D8A9F7",
        mosaicInfo: Object,
        name: "112223qqqqq.123123123",
        namespaceHex: "808027D3B2FAFAA0",
        properties: {
            divisibility: 6,
            duration: 100000,
            restrictable: false,
            supplyMutable: true,
            transferable: true
        }

    }
}

export const mosaicsLoading = false

export const CosignWallet = {
    active: true,
    address: CosignAccount.address.toDTO().address,
    balance: 1000,
    name: "wallet-privateKey",
    networkType: CosignAccount.address.toDTO().networkType,
    publicKey: CosignAccount.publicKey,
    signAndAnnounceBonded: function () {
    },
    sourceType: "Pk",
    simpleWallet: SimpleWallet.createFromPrivateKey(
        'wallet-privateKey',
        new Password('123123123'),
        MultisigAccount.privateKey,
        MultisigAccount.networkType
    ),
}

export const MultisigWallet = {
    active: true,
    address: CosignAccount.address.toDTO().address,
    balance: 1000,
    name: "wallet-privateKey",
    networkType: CosignAccount.address.toDTO().networkType,
    publicKey: CosignAccount.publicKey,
    signAndAnnounceBonded: function () {
    },
    sourceType: "Pk",
    simpleWallet: SimpleWallet.createFromPrivateKey(
        'wallet-privateKey',
        new Password('123123123'),
        CosignAccount.privateKey,
        CosignAccount.networkType
    )
}

export const multisigAccountInfo = {
    // cosigner
    SAY7N2GP6JJBFIRBTUEXY2JJVOLGIZ46KWIMYB5T: {
        account: {
            address: CosignAccount.address,
            publicKey: CosignAccount.publicKey
        },
        cosignatories: [],
        minApproval: 0,
        minRemoval: 0,
        multisigAccounts: [
            {
                address: MultisigAccount.address,
                publicKey: MultisigAccount.publicKey

            }
        ]
    },
    // multisig
    SB2FRRM3SYAMQL47RRUKMQSRJXJT3QPVAVWNTXQX: {
        account: {
            address: MultisigAccount.address,
            publicKey: MultisigAccount.publicKey

        },
        cosignatories: [{
            address: CosignAccount.address,
            publicKey: CosignAccount.publicKey
        }],
        minApproval: 1,
        minRemoval: 1,
        multisigAccounts: [],
    },
    // multisig-2
    SBIWHDWZMPIXXM2BINCRXAK3H3MGA5VHB3D2PO5W: {
        account: {
            address: Multisig2Account.address,
            publicKey: Multisig2Account.publicKey

        },
        cosignatories: [{
            address: CosignAccount.address,
            publicKey: CosignAccount.publicKey
        }, {
            address: Cosign2Account.address,
            publicKey: Cosign2Account.publicKey
        }
        ],
        minApproval: 2,
        minRemoval: 2,
        multisigAccounts: [],
    }
}

export const networkCurrency = {
    divisibility: 6,
    hex: "308F144790CD7BC4",
    name: "nem.xem",
    ticker: "XEM"
}

export const hdAccountData = {
    password: 'password',
    mnemonic: 'exhibit skin wink broom issue truly unit toy copy foam cheese number vicious forum crater afford snow chef toss broccoli second jeans good reject'
} 

export const hdAccount = {
    "accountName": "testWallet",
    "wallets": [
    {
        "simpleWallet": {
        "name": "seedWallet",
        "network": 144,
        "address": {
            "address": "SDZXYAFVFBSBDGHGHLQNUXNDTBMAG7UFJLDIXVVQ",
            "networkType": 144
        },
        "creationDate": "2019-11-07T11:52:07.738",
        "schema": "simple_v1",
        "encryptedPrivateKey": {
            "encryptedKey": "dd83e9c4fb0b8f4899031767fb8c3ead0c39c15f4ad1cdb5b2abb48b3986059fb9c609bf620607790f66c913838066a0",
            "iv": "3577D8FA436BFFDD85C5B82BB2BE0802"
        }
        },
        "name": "seedWallet",
        "address": "SDZXYAFVFBSBDGHGHLQNUXNDTBMAG7UFJLDIXVVQ",
        "publicKey": "F14333A3F957615AEFE1910B0DAC2596897E7FF7FDF46125F84F543CA9CCB176",
        "networkType": 144,
        "active": true,
        "path": "m/44'/43'/0'/0'/0'",
        "sourceType": "Seed",
        "encryptedMnemonic": "U2FsdGVkX1+aHIvymSlK0xHYqF5PFtc5hNimIcIqTdXpoJtQikUnT36XscWcsYVrI8tBIpRil94fL3YnD+aIHURhbh0prwl8PhleC0sEJMATFlQl0WdfRvYFku28Gdvi7mNIm0IPaOaCg226rssM17WmLALflGFH1lespTeLGTK6aPUtJDBHF4HLqBdJOud33TIofNX8wCfxftZlbud2yOwjybrBYbFn1xPLBclLVKI26VhRWaYlXO2JTQv8Xjvvn/EqBdA2uLqR43mh/byvZZc1as4T6kt9hRh4fR3qz3hGAbXulAL7LBPY/541c+mpoyseEZr7s9qaP0uBL5VQUcNQMNdniNjG6oc0bhD6GDtcjRep1hxWTEwau0BsN0iD8T7vGNsfEBNvlYbI78EQnrOZVxgGAJ2iY3ezeDr0ru0=",
        "balance": 0
    }
    ],
    "password": "U2FsdGVkX181wcYlmOLJPzMFY9PI9otH3LHMTjjKTuvcohqKynTIKhZ/rajFZfjw",
    "hint": "password is password",
    "currentNetType": 144,
    "seed": "U2FsdGVkX1+aHIvymSlK0xHYqF5PFtc5hNimIcIqTdXpoJtQikUnT36XscWcsYVrI8tBIpRil94fL3YnD+aIHURhbh0prwl8PhleC0sEJMATFlQl0WdfRvYFku28Gdvi7mNIm0IPaOaCg226rssM17WmLALflGFH1lespTeLGTK6aPUtJDBHF4HLqBdJOud33TIofNX8wCfxftZlbud2yOwjybrBYbFn1xPLBclLVKI26VhRWaYlXO2JTQv8Xjvvn/EqBdA2uLqR43mh/byvZZc1as4T6kt9hRh4fR3qz3hGAbXulAL7LBPY/541c+mpoyseEZr7s9qaP0uBL5VQUcNQMNdniNjG6oc0bhD6GDtcjRep1hxWTEwau0BsN0iD8T7vGNsfEBNvlYbI78EQnrOZVxgGAJ2iY3ezeDr0ru0=",
    "activeWalletAddress": "SDZXYAFVFBSBDGHGHLQNUXNDTBMAG7UFJLDIXVVQ"
}