import { TransactionType } from "nem2-sdk";

export const transactionTypeConfig = {
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
