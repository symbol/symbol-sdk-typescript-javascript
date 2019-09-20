import {TransactionType, NetworkType} from 'nem2-sdk'
import dashboardBlockHeight from "@/common/img/monitor/dash-board/dashboardBlockHeight.png"
import dashboardBlockTime from "@/common/img/monitor/dash-board/dashboardBlockTime.png"
import dashboardPointAmount from "@/common/img/monitor/dash-board/dashboardPointAmount.png"
import dashboardTransactionAmount from "@/common/img/monitor/dash-board/dashboardTransactionAmount.png"
import dashboardPublickey from "@/common/img/monitor/dash-board/dashboardPublickey.png"
import mosaic1Icon from "@/common/img/service/mosaic1.png"
import mosaic2Icon from "@/common/img/service/mosaic2.png"
import multisign1Icon from "@/common/img/service/multisign1.png"
import multisign2Icon from "@/common/img/service/multisign2.png"
import namespace1Icon from "@/common/img/service/namespace1.png"
import namespace2Icon from "@/common/img/service/namespace2.png"
import apostille1Icon from "@/common/img/service/apostille1.png"
import apostille2Icon from "@/common/img/service/apostille2.png"
//languageList
export const languageList: Array<any> = [
    {
        value: 'zh-CN',
        label: '中文'
    },
    {
        value: 'en-US',
        label: 'English'
    }
]

//transactionTypeList
export const transactionTypeList = {
    'transfer': {
        label: 'transfer',
        value: TransactionType.TRANSFER
    },
    'register_namespace': {
        label: 'register_namespace',
        value: TransactionType.REGISTER_NAMESPACE
    },
    'address_alias': {
        label: 'address_alias',
        value: TransactionType.ADDRESS_ALIAS
    },
    'mosaic_alias': {
        label: 'mosaic_alias',
        value: TransactionType.MOSAIC_ALIAS
    },
    'mosaic_definition': {
        label: 'mosaic_definition',
        value: TransactionType.MOSAIC_DEFINITION
    },
    'mosaic_supply_change': {
        label: 'mosaic_supply_change',
        value: TransactionType.MOSAIC_SUPPLY_CHANGE
    },
    'modify_multisig_account': {
        label: 'modify_multisig_account',
        value: TransactionType.MODIFY_MULTISIG_ACCOUNT
    },
    'aggregate_complete': {
        label: 'aggregate_complete',
        value: TransactionType.AGGREGATE_COMPLETE
    },

    'aggregate_bonded': {
        label: 'aggregate_bonded',
        value: TransactionType.AGGREGATE_BONDED
    },
    'lock': {
        label: 'lock',
        value: TransactionType.LOCK
    },
    'secret_lock': {
        label: 'secret_lock',
        value: TransactionType.SECRET_LOCK
    },
    'secret_proof': {
        label: 'secret_proof',
        value: TransactionType.SECRET_PROOF
    },
    'modify_account_property_address': {
        label: 'modify_account_property_address',
        value: TransactionType.MODIFY_ACCOUNT_RESTRICTION_ADDRESS
    },
    'modify_account_property_mosaic': {
        label: 'modify_account_property_address',
        value: TransactionType.MODIFY_ACCOUNT_RESTRICTION_MOSAIC
    },
    'modify_account_property_entity_type': {
        label: 'modify_account_property_entity_type',
        value: TransactionType.MODIFY_ACCOUNT_RESTRICTION_OPERATION
    },
    'link_account': {
        label: 'link_account',
        value: TransactionType.LINK_ACCOUNT
    }
}

//networkTypeList
export const networkTypeList = [
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

//networkStatusList
export const networkStatusList = [
    {
        icon: dashboardBlockHeight,
        descript: 'block_height',
        data: 1978365,
        variable: 'currentHeight'

    }, {
        icon: dashboardBlockTime,
        descript: 'average_block_time',
        data: 12,
        variable: 'currentGenerateTime'
    }, {
        icon: dashboardPointAmount,
        descript: 'point',
        data: 4,
        variable: 'nodeAmount'
    }, {
        icon: dashboardTransactionAmount,
        descript: 'number_of_transactions',
        data: 0,
        variable: 'numTransactions'
    }, {
        icon: dashboardPublickey,
        descript: 'Harvester',
        data: 0,
        variable: 'signerPublicKey'
    }
]

//nodeList
export const nodeList = [
    {
        value: 'http://13.114.200.132:3000',
        name: 'jp-5',
        url: '13.114.200.132',
        isSelected: true,
    },
    {
        value: 'http://52.194.207.217:3000',
        name: 'api-node-jp-12',
        url: '52.194.207.217',
        isSelected: false,
    },
]

//communityPanelNavList
export const communityPanelNavList = [
    {name: 'news', to: '/information', active: true},
    {name: 'vote', to: '/vote', active: false,},
]

//voteFilterList
export const voteFilterList = [
    {
        value: 0,
        label: 'all'
    },
    {
        value: 1,
        label: 'processing'
    },
    {
        value: 2,
        label: 'already_involved'
    },
    {
        value: 3,
        label: 'finished'
    }
]

//voteSelectionList
export const voteSelectionList = [
    {
        description: '1'
    }, {
        description: '2'
    }
]

//voteActionList
export const voteActionList = [
    {
        name: 'choose_to_vote',
        isSelect: true
    }, {
        name: 'create_a_vote',
        isSelect: false
    }
]

//monitor
export const monitorPanelNavigatorList = [
    {
        name: 'dash_board',
        isSelect: true,
        path: 'dashBoard'
    },
    {
        name: 'transfer',
        isSelect: false,
        path: 'transfer'
    },
    {
        name: 'Invoice',
        isSelect: false,
        path: 'invoice'
    },

    {
        name: 'remote',
        isSelect: false,
        path: 'remote',
    },
    {
        name: 'market',
        isSelect: false,
        path: 'market'
    },
]
export const monitorRecaeiptMosaicList = [
    {
        value: 'xem',
        label: 'xem'
    }
]
export const monitorRecaeiptTransferTypeList = [
    {
        name: 'ordinary_transfer',
        isSelect: true,
        disabled: false
    }, {
        name: 'Multisign_transfer',
        isSelect: false,
        disabled: false
    }, {
        name: 'crosschain_transfer',
        isSelect: false,
        disabled: true
    }, {
        name: 'aggregate_transfer',
        isSelect: false,
        disabled: true
    }
]
export const monitorTransferTransferTypeList = [
    {
        name: 'ordinary_transfer',
        isSelect: true,
        disabled: false
    }, {
        name: 'Multisign_transfer',
        isSelect: false,
        disabled: false
    }, {
        name: 'crosschain_transfer',
        isSelect: false,
        disabled: true
    }, {
        name: 'aggregate_transfer',
        isSelect: false,
        disabled: true
    }
]

//apostille
export const apostilleButtonList = [
    {
        name: 'create_apostille',
        isSelected: true
    }, {
        name: 'audit_apostille',
        isSelected: false
    }, {
        name: 'apostille_history',
        isSelected: false
    }
]

//mosaic
export const mosaicTransactionTypeList = [
    {
        name: 'ordinary_account',
        isSelected: true
    }, {
        name: 'multi_sign_account',
        isSelected: false
    }
]
export const mosaicButtonList = [
    {
        name: 'create_mosaic',
        isSelected: true
    }, {
        name: 'mosaic_list',
        isSelected: false
    }
]

//multisig
export const multisigButtonList = [
    {
        name: 'convert',
        isSelected: false
    }, {
        name: 'manage',
        isSelected: false
    }, {
        name: 'map',
        isSelected: true
    },
    // {
    //     name: 'MultisigCosign',
    //     isSelected: false
    // }
]

//namespace
export const subNamespaceTypeList = [
    {
        name: 'ordinary_account',
        isSelected: true
    }, {
        name: 'multi_sign_account',
        isSelected: false
    }
]
export const rootNamespaceTypelist = [
    {
        name: 'ordinary_account',
        isSelected: true
    }, {
        name: 'multi_sign_account',
        isSelected: false
    }
]
export const namespaceButtonList = [
    {
        name: 'Create_namespace',
        isSelected: true
    }, {
        name: 'Create_subNamespace',
        isSelected: false
    }, {
        name: 'Namespace_list',
        isSelected: false
    }
]

//serviceSwitchFnList
export const serviceSwitchFnList = [
    {
        name: 'mosaic',
        to: '/mosaic',
        iconDefault: mosaic1Icon,
        iconActive: mosaic2Icon,
        introduce: 'NEM_Mosaic_is_a_smart_asset_with_rich_attributes_and_features_To_create_a_mosaic_you_must_provision_the_root_namespace_for_your_account',
        active: false
    },
    {
        name: 'multi_signature',
        to: '/multisigApi',
        iconDefault: multisign1Icon,
        iconActive: multisign2Icon,
        introduce: 'provides_an_editable_chain_on_protocol_in_a_multi_signature_account_which_is_the_best_way_to_store_funds_and_achieve_a_common_account',
        active: true
    }, {
        name: 'namespace',
        to: '/namespace',
        iconDefault: namespace1Icon,
        iconActive: namespace2Icon,
        introduce: 'a_namespace_is_a_domain_name_that_stores_mosaics_Each_namespace_is_unique_within_a_blockchain_and_mosaics_can_be_defined_and_authenticated_on_a_multi_level_sub_namespace',
        active: false
    },
    {
        name: 'apostille',
        to: '/apostille',
        iconDefault: apostille1Icon,
        iconActive: apostille2Icon,
        introduce: 'provides_an_editable_chain_on_protocol_in_a_multi_signature_account_which_is_the_best_way_to_store_funds_and_achieve_a_common_account',
        active: false
    },
]

//setting
export const settingNetworkColorList = ['green_point', 'pink_point', 'purple_point', 'yellow_point']
export const settingNetworkPointList = [
    {
        name: 'NEM_PRIVATE_1',
        rpcUrl: 'Https://12.10.0.10',
        chainId: 1,
        symbol: 'XEM',
        exploerUrl: 'https://nodeexplorer.com/',
        isSelected: true
    }, {
        name: 'NEM_MAIN',
        rpcUrl: 'Https://12.10.0.10',
        chainId: 2,
        symbol: 'XEM',
        exploerUrl: 'https://nodeexplorer.com/',
        isSelected: false
    },
    {
        name: 'NEM_MAIN_NET',
        rpcUrl: 'Https://12.10.0.10',
        chainId: 2,
        symbol: 'XEM',
        exploerUrl: 'https://nodeexplorer.com/',
        isSelected: false
    }
]
export const settingPanelNavigationBar = [
    {
        title: 'general_settings',
        navigatorTitle: 'general_settings',
        name: 'settingNormal',
        isSelected: true
    }, {
        navigatorTitle: 'change_password',
        title: 'lock_password',
        name: 'settingLock',
        isSelected: false
    }, {
        navigatorTitle: 'network_settings',
        title: 'network_settings',
        name: 'settingNetwork',
        isSelected: false,
        disabled: true
    }, {
        navigatorTitle: 'about',
        title: 'about',
        name: 'settingAbout',
        isSelected: false
    }
]

//wallet
export const walletFnNavList = [
    {name: 'create', to: '/walletCreate', active: true},
    {name: 'import', to: '/walletImportKeystore', active: false},
]
export const walletImportNavagatorList = [
    {
        title: 'privatekey',
        name: 'walletImportPrivatekey',
        isSelected: false
    }, {
        title: 'keystore',
        name: 'walletImportKeystore',
        isSelected: false
    }
]
export const importKeystoreDefault = {
    walletName: 'keystore-wallet',
    networkType: NetworkType.MIJIN_TEST,
    keystoreStr: 'eyJuYW1lIjoid2FsbGV0LXByaXZhdGVLZXkiLCJuZXR3b3JrIjoxNDQsImFkZHJlc3MiOnsiYWRkcmVzcyI6IlNBVUE1SlFSUDJGQk5QQU8zRlFJUlRKUlM1UEhKVjdDTFpTT1lMS0YiLCJuZXR3b3JrVHlwZSI6MTQ0fSwiY3JlYXRpb25EYXRlIjoiMjAxOS0wOS0xOFQxNzowMzowNC4xNjUiLCJzY2hlbWEiOiJzaW1wbGVfdjEiLCJlbmNyeXB0ZWRQcml2YXRlS2V5Ijp7ImVuY3J5cHRlZEtleSI6ImJlZDYyZjU3MzAyYTRhZjE2ZTc0NWExNmMwYjUzMTczY2QzMzczNTRhODk1OTZiOTg5MjY1MGU2NDNjYTRjMGRlMGViMTRiM2YxYWEyOWQyNTM0ZWVkNzhkYzMwZmU4ZSIsIml2IjoiNUY2MEJEMDRFNDc0RDJCNjAwRUM5Qzc2MzcyNENDQTQifX0=',
    keystorePassword: '123123123'
}

export const StatusString = {
    FOREVER: 'Forever',
    NO_ALIAS: 'no alias',
    EXPIRED: 'Expired'
}



