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
            "address": "SBOENUE4JRGPMBV4HAOA2MIJGIY4AAHLI2YSKHRF",
            "networkType": 144
          },
          "creationDate": "2019-11-08T00:02:54.019",
          "schema": "simple_v1",
          "encryptedPrivateKey": {
            "encryptedKey": "c55858eb85ce02c2d32fe55756f6bf6029036f99dc01d9304c8f64a12b62183f5bf75dc4b53ae7998b5e8d9fb10ab58f",
            "iv": "97F814C4FA53DE749222C3584E7F23E8"
          }
        },
        "name": "seedWallet",
        "address": "SBOENUE4JRGPMBV4HAOA2MIJGIY4AAHLI2YSKHRF",
        "publicKey": "5A06ED717B3FFC46CFA387FB664E3FA2CF55D304943F0495DC4C402ED66DF8CF",
        "networkType": 144,
        "active": true,
        "path": "m/44'/43'/0'/0'/0'",
        "sourceType": "Seed",
        "encryptedMnemonic": "U2FsdGVkX19Eh+ZbVrg88WN+wI7YErErtsGmGtDnjO/CN9aP4LOe/OHrMGkMQzCYmBcEXZ6Vi7W64lQq4he/iIMxGYoEXD0to4vwpWZDrOWPekjkCRvgNC4xVNY+CHyS19AGhM088il2EHSrbM/rXcff7dN+CfQYQfcqmheVaspaJIyDxmr6bJidl2nj/L7NR4XD29cqPFhnkBK71Tzvr47trNPdahXkbaCg77Aaj/uLlvs6zq1jFNYo5k+j5kr7CFX6tA/D9LtxvU9prJaIU14dLV23KBQOPYVSh5/pnlpWfX91UtXCmWrLSEVnZaQmAjuIqjlcsiISlTuowGF+jsO6FXp8zqtPgvS/33BJw/h2UdrIidc2sXci+qek6OUdQMwiC1yRIZnoaUkGE08u0AN5DGmrIZn9h5wgy45ZhQw=",
        "balance": 0
      }
    ],
    "password": "U2FsdGVkX19BmVzvm8prhK/Wy30gQvowdN4rR2UTSAJwk8NSeo4NSXT3huLlyTZd",
    "hint": "password is password",
    "currentNetType": 144,
    "seed": "U2FsdGVkX19Eh+ZbVrg88WN+wI7YErErtsGmGtDnjO/CN9aP4LOe/OHrMGkMQzCYmBcEXZ6Vi7W64lQq4he/iIMxGYoEXD0to4vwpWZDrOWPekjkCRvgNC4xVNY+CHyS19AGhM088il2EHSrbM/rXcff7dN+CfQYQfcqmheVaspaJIyDxmr6bJidl2nj/L7NR4XD29cqPFhnkBK71Tzvr47trNPdahXkbaCg77Aaj/uLlvs6zq1jFNYo5k+j5kr7CFX6tA/D9LtxvU9prJaIU14dLV23KBQOPYVSh5/pnlpWfX91UtXCmWrLSEVnZaQmAjuIqjlcsiISlTuowGF+jsO6FXp8zqtPgvS/33BJw/h2UdrIidc2sXci+qek6OUdQMwiC1yRIZnoaUkGE08u0AN5DGmrIZn9h5wgy45ZhQw=",
    "activeWalletAddress": "SBOENUE4JRGPMBV4HAOA2MIJGIY4AAHLI2YSKHRF"
}
