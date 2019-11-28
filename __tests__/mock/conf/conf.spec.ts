import {Account, NetworkType, Password, SimpleWallet, MosaicInfo, MosaicId, UInt64, PublicAccount, MosaicFlags} from 'nem2-sdk'
import {MosaicProperties} from '@/core/model'

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

export const walletList = [
    {
        name: 'CosignAccount',
        address: CosignAccount.address.plain(),
    },
    {
        name: 'Cosign2Account',
        address: Cosign2Account.address.plain(),
    },
    {
        name: 'MultisigAccount',
        address: MultisigAccount.address.plain(),
    },
    {
        name: 'Multisig2Account',
        address: Multisig2Account.address.plain(),
    },
]

export const mosaics = {
    "308F144790CD7BC4": {
        "hex": "308F144790CD7BC4",
        "properties": new MosaicProperties(
            false,
            true,
            6,
            0,
            false,
        ),
        "name": "nem.xem",
        "mosaicInfo": new MosaicInfo(
            new MosaicId([2429385668, 814683207]),
            new UInt64([4130794368, 2095242]),
            new UInt64([1, 0]),
            PublicAccount.createFromPublicKey(
                '30CA0A8179477777AB3407611405EAAE6C4BA12156035E4DF8A73BD7651D6D9C',
                NetworkType.MIJIN_TEST,
            ),
            1,
            MosaicFlags.create(false, true, false),
            6,
            new UInt64([0, 0])
        ),
        "balance": 17989.078442,
        "expirationHeight": "Forever",
        "hide": false
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
                    "address": "SBEYUNT2UUBIYNYN4R43JL4CVJP4MD7YECJOKBC4",
                    "networkType": 144
                },
                "creationDate": "2019-11-23T12:26:26.858",
                "schema": "simple_v1",
                "encryptedPrivateKey": {
                    "encryptedKey": "1c0a437962a5381581f39b2616d4f65dc53ebe218f8488915593a8969dda1ff98150134031bac6619c9afa7c9e31eb8b",
                    "iv": "D023A94CB9A32618DCAA8EE491F200E4"
                }
            },
            "name": "seedWallet",
            "address": "SBEYUNT2UUBIYNYN4R43JL4CVJP4MD7YECJOKBC4",
            "publicKey": "C4B3DC11B41653AD52863B32159F771D847A1AFA6D117A64AB8305E0873F6506",
            "networkType": 144,
            "active": true,
            "path": "m/44'/43'/0'/0'/0'",
            "sourceType": "Seed",
            "encryptedMnemonic": "U2FsdGVkX18rANK6SdjsFWMHKrfAABBKRcerfws7YQZ8jFQ/y14Ree/C6aLdksA5rx+x5H6s/YtUhHlcZ0gFGHJIDDOPJ5jsK0wdPs2GSL/uSMgT5nb2BHxb6HKGdgtvAptQs05iwCf+QN9O8r5K9dWosjgp0sk/p2Uod5JuljJ5caXcnUYhDaAfM9lYj9XpiWiUXovC/ewV5P6UFDHnFbhzn5upj6IWvhLB0gvINzc4Boj9+DFy6XuLmsgSlbzVdi9B2I2lAVT4bG/cE/ZNUW3JNevuqYK0RFcLP51jQ8LB47zAx31dhOjBfirY7+ghOzUQDY3xT/eqm7qom7fx6SsmLlKNFweeqThDed5O2ILx2OtHS+SQMAZjWcHkwL5FFVBb1KkMxIfGQ8r5vOumrIOoqPsi4himjOVViuI/Dos=",
            "balance": 0
        },
        {
            "simpleWallet": {
                "name": "seedWallet-1",
                "network": 144,
                "address": {
                    "address": "SDLMJUJRUBX2D55PNZF53HKNYK34PPSQLOC7TN65",
                    "networkType": 144
                },
                "creationDate": "2019-11-23T12:26:55.862",
                "schema": "simple_v1",
                "encryptedPrivateKey": {
                    "encryptedKey": "eb3b8fda42f8c1226a6eb73e16df298d113c3a1f404613bba3662df69b52d8241a31f6737c0830f2bb29168b6d54bb8e",
                    "iv": "76D93DD499C4BB82D8ED14C056048C7B"
                }
            },
            "name": "seedWallet-1",
            "address": "SDLMJUJRUBX2D55PNZF53HKNYK34PPSQLOC7TN65",
            "publicKey": "33BC60F52A98C0BF83F523E022BE58EEF7A674B89BC76BA6FCE4C499DF235058",
            "networkType": 144,
            "active": true,
            "path": "m/44'/43'/1'/0'/0'",
            "sourceType": "Seed",
            "encryptedMnemonic": "U2FsdGVkX1+1wbCBRkoWh22FnDevUr9u7Bl5dRlLwruQA1dT5NCqYKxZUl9OcaBizT7RXB0UK7qo6tp5dTU5yiUhrmTx4oOzPcL5v0PhxyAbJcZVMpsBPHFRtLnqg/k6dkl5HA21YEIg4eGeJj4Pt1SYzvUf3KhosX1ehfYug+0I0mKnN7i/Oqzy9BrYG2QZTP1CyMBl1nwNKxF+LC0+9u/iLGm9f04y2hz9p+2ri/IV3OQYHq+utqm/51yoUAkmsp+V3qKxYZhvFyNxc5zvYQiID+cnZmdJv8DSK1wj9FKyM5cWVbIMSazwwSbYiLG2zTRqsGes6pvBEiWoLpyAu+f5zSOHT+Vr/Z5bqTBYMZGukfpk5bEgIR9uydHG9JHfNoLkgyhXZBY4H16FNZxTlasbJsbA4UA0XKhvS0J4XVk=",
            "balance": 0
        },
        {
            "simpleWallet": {
                "name": "seedWallet-2",
                "network": 144,
                "address": {
                    "address": "SDYEFYSEPRJMDMNCSHNK73FF5AO6PHGEJVPBHDHZ",
                    "networkType": 144
                },
                "creationDate": "2019-11-23T12:27:00.332",
                "schema": "simple_v1",
                "encryptedPrivateKey": {
                    "encryptedKey": "8490255dc2cd6f9070b293cee273d1300ca198b26a3a44a3a83ceca53bdb2d43b7c7c1fd587bbc536ca08bce559fa09a",
                    "iv": "142FDE84F3B41FC3A746B27D10E7CF06"
                }
            },
            "name": "seedWallet-2",
            "address": "SDYEFYSEPRJMDMNCSHNK73FF5AO6PHGEJVPBHDHZ",
            "publicKey": "85E51A7CFA9797BD274FF927BA628EAD3A9470931C14282D03C6D4EF460E0C64",
            "networkType": 144,
            "active": true,
            "path": "m/44'/43'/2'/0'/0'",
            "sourceType": "Seed",
            "encryptedMnemonic": "U2FsdGVkX19CwFpr0KxwlIFCHNtTVaSy8/GqAIKytM0gMyIpR4XVf2X9uvZIDT99EtmcrgryvCViZpvk8qQpULFwieiSp7cmCiWdUzzniPX7N/ANTfN9RgENNNKl+3DTUPbKxUygWDDBSY+A0RjY4+bxmHvwMiGmoe+VyA9dqEMwrftENihVoR00otQVAZSZcfP/6W/yxJdFn8QqlbX8Kt1XUryRFLHf1iAzguL5Vy30Ba5KkijbEi/EzUL4s/3/7OX9d5PGatAT6Umh09bGihWZ7mCQNV1W5ihKhb4mVg6uCJf4k72RQPQpGcbqpzGWK206ndDrDS5cduHqwQsj2gEVkxnLdwpuBOVHTBiv/voAdlQfsaeEdpfYTtNkX3lvevcX/EKfoOItmufinzFRt8npwtPLSpT8tfjh5fjObh0=",
            "balance": 0
        },
        {
            "simpleWallet": {
                "name": "seedWallet-3",
                "network": 144,
                "address": {
                    "address": "SBMMMSA2S5BF75G2V2IUHXJCPDPIAGCLXCJ5TTGF",
                    "networkType": 144
                },
                "creationDate": "2019-11-23T12:27:04.060",
                "schema": "simple_v1",
                "encryptedPrivateKey": {
                    "encryptedKey": "f064df0f8bc9409b964e9dc0a8d86c56827b509a2415446b04096ec65372244b8466e085e40cd45f5a56b35681325de1",
                    "iv": "E4496B0A4CFF9E1AECF1D3E62E813CA0"
                }
            },
            "name": "seedWallet-3",
            "address": "SBMMMSA2S5BF75G2V2IUHXJCPDPIAGCLXCJ5TTGF",
            "publicKey": "BBBACF42E9E2F1D338DEA2D28A2F612DE79C6ED153758327C3D9A768B5505D7A",
            "networkType": 144,
            "active": true,
            "path": "m/44'/43'/3'/0'/0'",
            "sourceType": "Seed",
            "encryptedMnemonic": "U2FsdGVkX1+9/cbDbZXhE8r1K+L0VKP/+U7mwti2DP5Sh56GxARmL7Kfg7o7HH0b8Y7+DRJ/09k2ZOH6IEk56UcOSm2iIjyKHVbbShi0DLfCVKZJdBJGAT6MqthdkMKifvF8lrs9fh0oKjVBLEcNzFcv495r8uIlaVOPBtdbGBu37MXRA8boSkBRDZTSEYPHv5ogIDkcsp7cRqTnrF0gltMMsz7toK+OhOx7y59xi5qjecdb2Yr9GQlQBU5K8friQ6k0YueNg58w84BdXA2HVF8kwnd2ENqBSag7I6Q5+p8WSqUlXr4MhjlctwdcQselpshofj5iRxrBS6VangNcB9L85EH3z/uBTdkFRxM1UaxsWJIs7XPn+4mIEGQg514VvELiyvrm0zeHTkW9uG1O2Qa8cazogJdEdJxpJm7nVO0=",
            "balance": 0
        }
    ],
    "password": "U2FsdGVkX19llgzAzjlLUjHROaXXkm6GYYo7o1OIk30N2QJi3/PI05Ao8wsMr3uM",
    "hint": "password is password",
    "networkType": 144,
    "seed": "U2FsdGVkX18rANK6SdjsFWMHKrfAABBKRcerfws7YQZ8jFQ/y14Ree/C6aLdksA5rx+x5H6s/YtUhHlcZ0gFGHJIDDOPJ5jsK0wdPs2GSL/uSMgT5nb2BHxb6HKGdgtvAptQs05iwCf+QN9O8r5K9dWosjgp0sk/p2Uod5JuljJ5caXcnUYhDaAfM9lYj9XpiWiUXovC/ewV5P6UFDHnFbhzn5upj6IWvhLB0gvINzc4Boj9+DFy6XuLmsgSlbzVdi9B2I2lAVT4bG/cE/ZNUW3JNevuqYK0RFcLP51jQ8LB47zAx31dhOjBfirY7+ghOzUQDY3xT/eqm7qom7fx6SsmLlKNFweeqThDed5O2ILx2OtHS+SQMAZjWcHkwL5FFVBb1KkMxIfGQ8r5vOumrIOoqPsi4himjOVViuI/Dos=",
    "activeWalletAddress": "SBMMMSA2S5BF75G2V2IUHXJCPDPIAGCLXCJ5TTGF"
}


export const hdAccountTestNet = {
    "accountName": "testWallet",
    "wallets": [
        {
            "simpleWallet": {
                "name": "testWallet",
                "network": 152,
                "address": {
                    "address": "TCCKTZH5N4S23F25AKZHCCX3KHXKNHNLNMPTPP4T",
                    "networkType": 152
                },
                "creationDate": "2019-11-23T12:53:39.696",
                "schema": "simple_v1",
                "encryptedPrivateKey": {
                    "encryptedKey": "a627e4aee8da15bc6b06fe29bd2ec6422c02cdeeb01861e22839b5cee0b63ec86a5ffc0b093e74e04bab0fc1c89c6eec",
                    "iv": "A3D6AAA6686749D94F37EC61879F35B1"
                }
            },
            "name": "testWallet",
            "address": "TCCKTZH5N4S23F25AKZHCCX3KHXKNHNLNMPTPP4T",
            "publicKey": "95E0841A8A20F36F64FC9EE55BB7E25F73AA7F94AFDCB5EF00574AEC7AC8C3D8",
            "networkType": 152,
            "active": true,
            "path": "m/44'/43'/0'/0'/0'",
            "sourceType": "Seed",
            "encryptedMnemonic": "U2FsdGVkX1+W7TUhx5uCGTyh6iGNij0Y/vX17IIhDm+ybigE/8+3LMe4HXYkhQ52LTNI4l/XIG+Fb48elX3QOQ1yWtzppHDdwZe17maG6QqbTwL+j5A/zqqL1oEFnB2Zt6Ou4q1IngbF5WysbhACIU1hOFeyKIFd9Qw0Jk88V1T4b8LFqEkXv22/AxPKEK8ujirZbm5tiMpTw5hlVuKYIedNezUoi40QfMba5lVaPQD4+F3zMIgnOS6YnPyYuS8SdVqc1pNEHkW5lhND7nFHrbKO/5IGMoz4bXE4skN2SB+r3mh7u7RMPF1Ucmi8JwXq8lx4DSl9qp08eGQ65i4cWBUNYyzFdzknBxx/guVlMfh1gI/zazCKolw/rQ2/Vyb7DRL3f+8o4ROIx53j9XKW78XMy2Rbh3IMZgER/qQCE80=",
            "balance": 0
        },
        {
            "simpleWallet": {
                "name": "seedWallet-1",
                "network": 152,
                "address": {
                    "address": "TAJPOQOKNAFFPBTOH5NC56747AX2PJ4RCTOVVBZ2",
                    "networkType": 152
                },
                "creationDate": "2019-11-23T12:54:38.521",
                "schema": "simple_v1",
                "encryptedPrivateKey": {
                    "encryptedKey": "a4b717fc3d7238a661037865220d8f67af1fbb17691ba736e2c9fee365aa24ba47915902c4d6f6e341c6efb6ada92931",
                    "iv": "DFC7A5F83AD2DB73DACC4734E48EBA34"
                }
            },
            "name": "seedWallet-1",
            "address": "TAJPOQOKNAFFPBTOH5NC56747AX2PJ4RCTOVVBZ2",
            "publicKey": "9B164BF7420DA98E6E503078BC34CDE4E0C3091BE6D9FCC8CC347136037D3259",
            "networkType": 152,
            "active": true,
            "path": "m/44'/43'/1'/0'/0'",
            "sourceType": "Seed",
            "encryptedMnemonic": "U2FsdGVkX1+Svt/SUqT/0mT9yHqY2igPUYT7uzirIglbTDzDLzh4Q22mGR/eXxFfO1MpzwLXwFYuUjL0Nmu4QtimY+OmKdjqcrTMBUYvGuHCIjT+pEC5YAG6R19j4WCP1ox+p9o9rozL2QZtsImX47XSkhr1Q5o6MhmnAMp3tojG6XfRANsvCJ7FYjGCYpownsaGHpej+8iuTycxJ9TjnZdP/twAOc3wdanrzLNavmAqwEeeQCh8A64F+J0eew6MlD6bf3myuKVWYvmefCPH1TtVBLZKUGfCjQOzG/DyT0p6ogmReOBVLvZKMDMRlwLu2fplZsrNU7MLhdjZJsrBTCv5syEY3NK6Ly+v6FpIBBbVd70qZXMARzbQLiv+ILeepL47q30gdZVPsbE1m8fIXTt6Zvc+TYm5ZU/OeGvaEr8=",
            "balance": 0
        },
        {
            "simpleWallet": {
                "name": "seedWallet-2",
                "network": 152,
                "address": {
                    "address": "TAYZHEPO6D4H65FITFWQJ37KCYNU44ZXAYJCFVHW",
                    "networkType": 152
                },
                "creationDate": "2019-11-23T12:54:42.336",
                "schema": "simple_v1",
                "encryptedPrivateKey": {
                    "encryptedKey": "b2414c3cb2d0e3eaf12908555152c095c35e667fea9b4f74d04ed58db34a587d003c083e32ff8517cdead24f05e5de2c",
                    "iv": "E345073D0BA61908835DDB0089D29D8E"
                }
            },
            "name": "seedWallet-2",
            "address": "TAYZHEPO6D4H65FITFWQJ37KCYNU44ZXAYJCFVHW",
            "publicKey": "0D06343A74735DB89D2BA5B3D626526765309C5DBBCAD3C5908D0515EA3B0881",
            "networkType": 152,
            "active": true,
            "path": "m/44'/43'/2'/0'/0'",
            "sourceType": "Seed",
            "encryptedMnemonic": "U2FsdGVkX19FcUaf0DJD4Entwv1IJlFM2vxAgokqXuww29Td1KGn2Kee2bpE2og7h+IxQmOZZAu5tvOBFG3vI9RN4BavHXocuRcXEcGtDFR5pxvy4ruVK7uGaF+j53aV58B1i2zpTWiApWf2LfRFOv4d36jF06Ng1xweZ9QEuElHo+dp03P67sNvQSOC2H9FJEz2tfcEp7FQyuVs+bxsZ4IbYz5gk3k35RYXBlXI/JBRgaAqNAz/OPDF4p0xf/O2+RP9HSIxkUc1Bi59LAYj229mXW7JZaImQKq1I9xfxMJuMTkoXTTgKPLD3FwPb479/SPTjuqqQmn6i1P60EybZzEhtq2B/O/svWzce/uo8BdIuumwrojhjRqIc1sQGt78Aq8BlxDZrwifKsf8YuwWsd7aOcJ+XKTrK2oU2xXkWv4=",
            "balance": 0
        },
        {
            "simpleWallet": {
                "name": "seedWallet-3",
                "network": 152,
                "address": {
                    "address": "TAYOVWWMGTKMWP7SKYBWKPIZZIZDJ3LHBRBLXWH3",
                    "networkType": 152
                },
                "creationDate": "2019-11-23T12:54:46.148",
                "schema": "simple_v1",
                "encryptedPrivateKey": {
                    "encryptedKey": "2b730ce77f28b2839721691512f3a20986c09a9cf2c36c08b86c3b615fc27ed7b507eb73f6b573fb17ba3585e07a8706",
                    "iv": "EA0C1B101A563B344D336BAD944A99F0"
                }
            },
            "name": "seedWallet-3",
            "address": "TAYOVWWMGTKMWP7SKYBWKPIZZIZDJ3LHBRBLXWH3",
            "publicKey": "C5A6EDD8F12447879835063B3143549285AAD578507DAC391CCF06A4295F0239",
            "networkType": 152,
            "active": true,
            "path": "m/44'/43'/3'/0'/0'",
            "sourceType": "Seed",
            "encryptedMnemonic": "U2FsdGVkX1+jHMVcNNVSp6UPkZd8/wF97UtHotrtyJXZyUiX7fWSjFba/A4WYMpKGq0pekyoBrJf4ysLYn5KDWt34vuBLwLmZ2KrGLJMY4MzXA5Ar/mWf1uiCDYsEt0YBK0+cbZ124bceepJCGFffUEw+lSO+rdw6GEqUqOUBceahmguWtxo/hHWyCcacHjBA8WMwRQMKOtIsJ27QIutcbR8lSVT3NE6oiSt9+bFh7yGg1XaH19aE8u/UPxT+ci6M4ibapPpiWmwNJyDABh8jqwZhliLbfEXmygiF4PjhqB/nmMX+1QYoAbps7uR00rrnBzhK/TLGcUf8LOK0F2WR2GStYVchIAnUvIg6OaSpy0RBk37n9ycZiGdoCk1N/VBfj4QcjcVz312PRfPeuRZQzRLTTOZ3msdvGiVlJqO3PM=",
            "balance": 0
        }
    ],
    "password": "U2FsdGVkX19hLDDEa80hUNxiKtu5vUXTw6Lbmv0AzcPHjZcxWQPYec/bC8T2IG6w",
    "hint": "password",
    "networkType": 152,
    "seed": "U2FsdGVkX1+W7TUhx5uCGTyh6iGNij0Y/vX17IIhDm+ybigE/8+3LMe4HXYkhQ52LTNI4l/XIG+Fb48elX3QOQ1yWtzppHDdwZe17maG6QqbTwL+j5A/zqqL1oEFnB2Zt6Ou4q1IngbF5WysbhACIU1hOFeyKIFd9Qw0Jk88V1T4b8LFqEkXv22/AxPKEK8ujirZbm5tiMpTw5hlVuKYIedNezUoi40QfMba5lVaPQD4+F3zMIgnOS6YnPyYuS8SdVqc1pNEHkW5lhND7nFHrbKO/5IGMoz4bXE4skN2SB+r3mh7u7RMPF1Ucmi8JwXq8lx4DSl9qp08eGQ65i4cWBUNYyzFdzknBxx/guVlMfh1gI/zazCKolw/rQ2/Vyb7DRL3f+8o4ROIx53j9XKW78XMy2Rbh3IMZgER/qQCE80=",
    "activeWalletAddress": "TAYOVWWMGTKMWP7SKYBWKPIZZIZDJ3LHBRBLXWH3"
}

export const current1Account = {
    name: 'account',
    password: '123123123',
    networkType: NetworkType.MIJIN_TEST,
}
