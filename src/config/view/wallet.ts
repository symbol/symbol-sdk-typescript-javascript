import { NetworkType } from "nem2-sdk";
import mosaic1Icon from "@/common/img/service/mosaic1.png";
import mosaic2Icon from "@/common/img/service/mosaic2.png";
import multisign1Icon from "@/common/img/service/multisign1.png";
import multisign2Icon from "@/common/img/service/multisign2.png";
import namespace1Icon from "@/common/img/service/namespace1.png";
import namespace2Icon from "@/common/img/service/namespace2.png";
import apostille1Icon from "@/common/img/service/apostille1.png";
import apostille2Icon from "@/common/img/service/apostille2.png";

export const walletFnNavConfig = [
    { name: 'create', to: '/walletCreate', active: true },
    { name: 'import', to: '/walletImportKeystore', active: false },
]

export const walletImportNavagatorConfig = [
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

export const importKeystoreConfig = {
    walletName: 'keystore-wallet',
    networkType: NetworkType.MIJIN_TEST,
    keystoreStr: 'eyJuYW1lIjoiMzIxMzIxMzEyIiwiY2lwaGVydGV4dCI6eyJ3b3JkcyI6Wzg1NDY0MjkyNSwyMDMwOTQ2OTg5LC0xMTYzOTM0MCwxMjYzMTEzOTQyLDE1OTgyNzY0MjMsLTEzNDMwODUyMDgsLTEwMTM2MDI4NzAsMTIxNDI5ODg2LC0xNTkyNDUzNzg0LDE1OTU5OTEwMDYsLTEwMzkxMTQ1NjQsNzI4MjgxODc3XSwic2lnQnl0ZXMiOjQ4fSwiaXYiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOlsxODAsMTk2LDIyNywxNjYsMTc4LDIzNSw4OSwxNDUsMjI4LDY2LDExMiw2MSwyNCwyNSwzOCwxNjZdfSwibmV0d29ya1R5cGUiOjE0NCwiYWRkcmVzcyI6IlNBVUE1SlFSUDJGQk5QQU8zRlFJUlRKUlM1UEhKVjdDTFpTT1lMS0YiLCJwdWJsaWNLZXkiOiI2MjMyM0JDMkQwNzVDRDgxNUU0QTcxQjE4NzQ3MDhDOEVBQUVGRUMyOTVDNkYxQTgyRTZCOTE4MjJCQjJEREJCIiwibW5lbW9uaWNFbkNvZGVPYmoiOnt9fQ==',
    walletPassword: '',
    walletPasswordAgain: '',
    keystorePassword: '111111'
}

export const serviceSwitchFnConfig = [
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
