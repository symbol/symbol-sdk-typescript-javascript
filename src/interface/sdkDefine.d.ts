import {
    Address,
    AliasActionType,
    Deadline,
    MosaicId,
    NamespaceId,
    NamespaceType,
    NetworkType,
    UInt64,
    Password,
    SimpleWallet,
    PublicAccount,
    Account,
    AccountInfo,
    Transaction,
    SignedTransaction,
    MultisigAccountInfo,
    MultisigAccountGraphInfo,
    Listener,
    MultisigCosignatoryModification,
    MosaicSupplyChangeTransaction,
    AggregateTransaction,
    AccountPropertyTransaction,
    PropertyType,
    ModifyAccountPropertyAddressTransaction
} from 'nem2-sdk'


declare namespace SdkV0 {

    type Rst<TType> = Promise<{
        error?: {
            code?: number;
            message: string;
        };
        result?: TType;
    }>;

    interface wallet {
        loginWallet: (params: {
            name: string,
            privateKey: string,
            networkType: NetworkType,
            node?: string
        }) => Rst<{
            wallet: SimpleWallet,
            password: Password,
            publicAccount: PublicAccount,
            account: Account,
            mosaics: any
        }>;
        createWallet: (params: {
            name: string,
            networkType: NetworkType
        }) => Rst<{
            wallet: SimpleWallet,
            privateKey: string,
            password: Password
        }>;
        getWallet: (params: {
            name: string,
            privateKey: string,
            networkType: NetworkType,
        }) => Rst<{
            wallet: SimpleWallet,
            password: Password,
            privateKey: string,
        }>;
        getKeys: (params: {
            password: Password,
            wallet: SimpleWallet
        }) => Rst<{
            account: Account
        }>;
    }

    interface account {
        getAccountsNames: (params: {
            addressList: Array<Address>,
            node: string
        }) => Rst<{
            namespaceList: any
        }>;
        getAccountInfo: (params: {
            address: string,
            node: string
        }) => Rst<{
            accountInfo: any
        }>;

        sign: (params: {
            account: Account,
            transaction: Transaction,
            generationHash: any
        }) => Rst<{
            signature: SignedTransaction
        }>;

        getMultisigAccountInfo: (params: {
            address: string,
            node: string
        }) => Rst<{
            multisigAccountInfo: MultisigAccountInfo
        }>;

        getMultisigAccountGraphInfo: (params: {
            address: string,
            node: string
        }) => Rst<{
            multisigAccountGraphInfo: any
        }>;

        encryptMessage: (params: {
            message: string,
            recipientPublicAccount: any,
            privateKey: string
        }) => Rst<{
            encryptMessage: any
        }>;

        decryptMessage: (params: {
            encryptMessage: any,
            senderPublicAccount: any,
            privateKey: string
        }) => Rst<{
            decryptMessage: any
        }>;
    }

    interface blockchain {
        getBlockByHeight: (params: {
            node: string,
            height: number
        }) => Rst<{
            Block: any
        }>

        getBlocksByHeightWithLimit: (params: {
            node: string,
            height: number,
            limit: number
        }) => Rst<{
            Blocks: any
        }>

        getBlockTransactions: (params: {
            node: string,
            height: number,
            queryParams: any
        }) => Rst<{
            blockTransactions: any
        }>

        getBlockchainHeight: (params: {
            node: string,
        }) => Rst<{
            blockchainHeight: any
        }>
    }

    interface transaction {
        announce: (params: {
            signature: any,
            node: string
        }) => Rst<{
            announceStatus: any
        }>;
        _announce: (params: {
            transaction: Transaction,
            node: string,
            account: Account,
            generationHash: string

        }) => Rst<{
            announceStatus: any
        }>;
        // todo after sdk updated
        accountAddressRestrictionModificationTransaction: (params: {
            propertyType: PropertyType,
            accountPropertyTransaction: any,
            networkType: NetworkType,
            fee: number,
        }) => Rst<{
            modifyAccountPropertyAddressTransaction: ModifyAccountPropertyAddressTransaction
        }>;
        transferTransaction: (params: {
            network: number,
            MaxFee: number,
            receive: any,
            mosaics: any,
            MessageType: number,
            message: string,
        }) => Rst<{
            transferTransaction: any
        }>;
        aggregateCompleteTransaction: (params: {
            network: number,
            MaxFee: number,
            transactions: any,
        }) => Rst<{
            aggregateCompleteTransaction: object
        }>;
        aggregateBondedTransaction: (params: {
            network: number,
            transactions: any,
        }) => Rst<{
            aggregateBondedTransaction: object
        }>;
        getTransaction: (params: {
            transactionId: string,
            node: string
        }) => Rst<{
            transactionInfoThen: any
        }>;
        getTransactionStatus: (params: {
            hash: string,
            node: string
        }) => Rst<{
            transactionStatus: any
        }>;
        transactions: (params: {
            publicAccount: PublicAccount,
            queryParams: any,
            node: string
        }) => Rst<{
            transactions: any
        }>;
        incomingTransactions: (params: {
            publicAccount: PublicAccount,
            queryParams: any,
            node: string
        }) => Rst<{
            incomingTransactions: any
        }>;
        outgoingTransactions: (params: {
            publicAccount: PublicAccount,
            queryParams: any,
            node: string
        }) => Rst<{
            outgoingTransactions: any
        }>;
        unconfirmedTransactions: (params: {
            publicAccount: PublicAccount,
            queryParams: any,
            node: string
        }) => Rst<{
            unconfirmedTransactions: any
        }>;
        getAggregateBondedTransactions: (params: {
            publicAccount: any,
            queryParams: any,
            node: string
        }) => Rst<{
            aggregateBondedTransactions: any
        }>;
        announceAggregateBonded: (params: {
            signedTransaction: any,
            node: string
        }) => Rst<{
            aggregateBondedTx: any
        }>;
        announceBondedWithLock: (params: {
            aggregateTransaction: AggregateTransaction,
            account: Account,
            listener: Listener,
            node: string,
            generationHash: string,
            networkType,
            fee
        }) => Rst<{
            aggregateBondedTx: any
        }>;

    }

    interface mosaic {
        createMosaicNonce: (params: {
            nonce?: Uint8Array
        }) => Rst<{
            mosaicNonce: object
        }>;

        getcurrentXEM: (params: {
            node?: string
        }) => Rst<{
            currentXEM: object
        }>;

        createMosaicId: (params: {
            publicAccount: PublicAccount,
            mosaicNonce: any
        }) => Rst<{
            mosaicId: object
        }>;
        createMosaic: (params: {
            mosaicNonce: any,
            mosaicId: any,
            supplyMutable: boolean,
            transferable: boolean,
            divisibility: number,
            duration: number | undefined,
            netWorkType: number,
            supply: number,
            publicAccount: PublicAccount,
            maxFee?: number
        }) => Rst<{
            mosaicDefinitionTransaction: object
        }>;
        mosaicSupplyChange: (params: {
            mosaicId: any,
            delta: number,
            MosaicSupplyType: number,
            netWorkType: number,
            maxFee?: number
        }) => Rst<{
            mosaicSupplyChangeTransaction: MosaicSupplyChangeTransaction
        }>;
        getMosaics: (params: {
            node: string,
            mosaicIdList: MosaicId[],
        }) => Rst<{
            mosaicsInfos: object
        }>;
        getMosaicsNames: (params: {
            node: string,
            mosaicIds: any[],
        }) => Rst<{
            mosaicsNamesInfos: object
        }>;
        getMosaicByNamespace: (params: {
            namespace: string,
        }) => Rst<{
            mosaicId: object
        }>;
        // getcurrentXEM: (params: {
        //     node: string,
        // }) => Rst<{
        //     mosaicsInfos: string
        // }>;
    }

    interface alias {
        createNamespaceId: (params: {
            name: string | number[]
        }) => Rst<{
            namespacetransactionId: NamespaceId
        }>;
        createdRootNamespace: (params: {
            namespaceName: string,
            duration: number,
            networkType: NetworkType,
            maxFee?: number
        }) => Rst<{
            rootNamespaceTransaction:Transaction
        }>;
        createdSubNamespace: (params: {
            namespaceName: string,
            parentNamespace: string | NamespaceId,
            networkType: NetworkType,
            maxFee?: number
        }) => Rst<{
            subNamespaceTransaction: Transaction
        }>;
        mosaicAliasTransaction: (params: {
            actionType: AliasActionType,
            namespaceId: NamespaceId,
            mosaicId: MosaicId,
            networkType: NetworkType,
            maxFee?: number
        }) => Rst<{
            aliasMosaicTransaction: any
        }>;
        addressAliasTransaction: (params: {
            actionType: AliasActionType,
            namespaceId: NamespaceId,
            address: Address,
            networkType: NetworkType,

            maxFee?: number
        }) => Rst<{
            aliasAddressTransaction: {
                networkType: NetworkType,
                version: number,
                deadline: Deadline,
                maxFee: UInt64,
                actionType: AliasActionType,
                namespaceId: NamespaceId,
                address: Address
            }
        }>;

        getLinkedMosaicId: (params: {
            namespaceId: NamespaceId,
            url: string
        }) => Rst<{
            mosaicId: MosaicId
        }>;

        getNamespacesFromAccount: (params: {
            address: Address,
            url: string
        }) => Rst<{
            namespaceList: any
        }>;

    }

    interface ws {
        openWs: (params: {
            listener: any
        }) => Rst<{
            ws: any
        }>;
        listenerUnconfirmed: (params: {
            listener: any
            address: Address
            fn: any
        }) => Rst<{
            ws: any
        }>;
        listenerConfirmed: (params: {
            listener: any
            address: Address
            fn: any
        }) => Rst<{
            ws: any
        }>;
        listenerTxStatus: (params: {
            listener: any
            address: Address
            fn: any
        }) => Rst<{
            ws: any
        }>;
        sendMultisigWs: (params: {
            address: Address,
            account: any,
            node: string,
            signedBondedTx: any,
            signedLockTx: any,
            listener: any
        }) => Rst<{
            ws: any
        }>;
        newBlock: (
            params: {
                listener: Listener,
                pointer: any
            }
        ) => Rst<{
            blockInfo: any
        }>;
    }

    interface multisig {
        getMultisigAccountInfo: (params: {
            address: string
            node: string
        }) => Rst<{
            multisigInfo: any
        }>;
        completeMultisigTransaction: (params: {
            networkType: NetworkType,
            fee: number,
            multisigPublickey: string,
            transaction: Array<Transaction>,
        }) => Rst<{
            aggregateTransaction: AggregateTransaction
        }>;
        bondedMultisigTransaction: (params: {
            networkType: NetworkType,
            account: Account,
            fee: number,
            multisigPublickey: string,
            transaction: Array<Transaction>,
        }) => Rst<{
            aggregateTransaction: AggregateTransaction
        }>;
    }
}

