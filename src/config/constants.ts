import {TransactionType} from 'nem2-sdk'
import {DefaultFee, NetworkCurrency} from '@/core/model'

export const WALLET_VERSION = '0.8.5'

export const isWindows = require('./packge.ts').isWin32

export const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
//apiServer
export const apiServerConfig = {
    apiUrl: 'http://120.79.181.170',
    marketUrl: 'http://app.nemcn.io',
    voteUrl: 'http://120.79.181.170'
}

export const transactionTag = {
    RECEIPT: 'receipt',
    PAYMENT: 'payment',
    [TransactionType.REGISTER_NAMESPACE]: 'register_namespace',
    [TransactionType.ADDRESS_ALIAS]: 'address_alias',
    [TransactionType.MOSAIC_ALIAS]: 'mosaic_alias',
    [TransactionType.MOSAIC_DEFINITION]: 'mosaic_definition',
    [TransactionType.MOSAIC_SUPPLY_CHANGE]: 'mosaic_supply_change',
    [TransactionType.MODIFY_MULTISIG_ACCOUNT]: 'modify_multisig_account',
    [TransactionType.AGGREGATE_COMPLETE]: 'aggregate_complete',
    [TransactionType.AGGREGATE_BONDED]: 'aggregate_bonded',
    [TransactionType.LOCK]: 'lock',
    [TransactionType.SECRET_LOCK]: 'secret_lock',
    [TransactionType.SECRET_PROOF]: 'secret_proof',
    [TransactionType.ACCOUNT_RESTRICTION_ADDRESS]: 'account_restriction_address',
    [TransactionType.ACCOUNT_RESTRICTION_MOSAIC]: 'account_restriction_mosaic',
    [TransactionType.ACCOUNT_RESTRICTION_OPERATION]: 'account_restriction_operation',
    [TransactionType.LINK_ACCOUNT]: 'link_account',
    [TransactionType.MOSAIC_ADDRESS_RESTRICTION]: 'mosaic_address_restriction',
    [TransactionType.MOSAIC_GLOBAL_RESTRICTION]: 'mosaic_global_restriction',
    [TransactionType.ACCOUNT_METADATA_TRANSACTION]: 'account_metadata_transaction',
    [TransactionType.MOSAIC_METADATA_TRANSACTION]: 'mosaic_metadata_transaction',
    [TransactionType.NAMESPACE_METADATA_TRANSACTION]: 'namespace_metadata_transaction',
}

export const Message = {
    COPY_SUCCESS: 'successful_copy',
    SUCCESS: 'success',
    OPERATION_SUCCESS: 'successful_operation',
    UPDATE_SUCCESS: 'update_completed',
    NODE_CONNECTION_SUCCEEDED: 'Node_connection_succeeded',
    PLEASE_ENTER_A_CORRECT_NUMBER: 'Please_enter_a_correct_number',
    NOTES_SHOULD_NOT_EXCEED_25_CHARACTER: 'Notes_should_not_exceed_25_character',
    PLEASE_SET_WALLET_PASSWORD_INFO: 'please_set_your_wallet_password',
    PLEASE_ENTER_MNEMONIC_INFO: 'Please_enter_a_mnemonic_to_ensure_that_the_mnemonic_is_correct',
    PLEASE_SWITCH_NETWORK: 'walletCreateNetTypeRemind',
    NO_MNEMONIC_INFO: 'no_mnemonic',
    ACCOUNT_NAME_INPUT_ERROR: 'accountCreateWalletNameRemind',
    ACCOUNT_NAME_EXISTS_ERROR: 'Account_name_already_exists',
    WALLET_NAME_INPUT_ERROR: 'walletCreateWalletNameRemind',
    PASSWORD_CREATE_ERROR: 'createLockPWRemind',
    INCONSISTENT_PASSWORD_ERROR: 'createLockCheckPWRemind',
    PASSWORD_HIT_SETTING_ERROR: 'createLockPWTxtRemind',
    WRONG_PASSWORD_ERROR: 'password_error',
    WRONG_WALLET_NAME_ERROR: 'wrong_wallet_name_error',
    MOSAIC_NAME_NULL_ERROR: 'mosaic_name_can_not_be_null',
    QR_GENERATION_ERROR: 'QR_code_generation_failed',
    ADDRESS_FORMAT_ERROR: 'address_format_error',
    AMOUNT_LESS_THAN_0_ERROR: 'amount_can_not_be_less_than_0',
    FEE_LESS_THAN_0_ERROR: 'fee_can_not_be_less_than_0',
    SUPPLY_LESS_THAN_0_ERROR: 'supply_can_not_less_than_0',
    DIVISIBILITY_LESS_THAN_0_ERROR: 'divisibility_can_not_less_than_0',
    DIVISIBILITY_MORE_THAN_6_ERROR: 'divisibility_can_not_more_than_6',
    DURATION_LESS_THAN_0_ERROR: 'duration_can_not_less_than_0',
    DURATION_MORE_THAN_1_YEARS_ERROR: 'duration_can_not_more_than_1_years',
    DURATION_MORE_THAN_10_YEARS_ERROR: 'duration_can_not_more_than_10_years',
    MNEMONIC_INCONSISTENCY_ERROR: 'Mnemonic_inconsistency',
    PASSWORD_SETTING_INPUT_ERROR: 'walletCreatePasswordRemind',
    MNEMONIC_INPUT_ERROR: 'Mnemonic_input_error',
    ILLEGAL_publicKey_ERROR:'ILLEGAL_publicKey_ERROR',
    OPERATION_FAILED_ERROR: 'operation_failed',
    NODE_NULL_ERROR: 'point_null_error',
    INPUT_EMPTY_ERROR: 'Any_information_cannot_be_empty',
    CO_SIGNER_NULL_ERROR: 'co_signers_amount_less_than_0',
    MIN_APPROVAL_LESS_THAN_0_ERROR: 'min_approval_amount_less_than_0',
    MIN_REMOVAL_LESS_THAN_0_ERROR: 'min_removal_amount_less_than_0',
    MAX_APPROVAL_MORE_THAN_10_ERROR: 'max_approval_amount_more_than_10',
    MAX_REMOVAL_MORE_THAN_10_ERROR: 'max_removal_amount_more_than_10',
    ILLEGAL_PUBLIC_KEY_ERROR: 'illegal_publicKey',
    ILLEGAL_MIN_APPROVAL_ERROR: 'min_approval_amount_illegal',
    ILLEGAL_MIN_REMOVAL_ERROR: 'min_removal_amount_illegal',
    MOSAIC_HEX_FORMAT_ERROR: 'mosaic_hex_format_error',
    ALIAS_NAME_FORMAT_ERROR: 'alias_name_format_error',
    DURATION_VALUE_LESS_THAN_1_ERROR: 'The_value_of_duration_cannot_be_less_than_1',
    NAMESPACE_NULL_ERROR: 'Namespace_cannot_be_a_null_or_empty_string',
    ROOT_NAMESPACE_TOO_LONG_ERROR: 'The_root_namespace_cannot_be_longer_than_16',
    NAMESPACE_STARTING_ERROR: 'Namespace_must_start_with_a_letter',
    NAMESPACE_FORMAT_ERROR: 'Namespace_can_only_contain_numbers_letters_and_other',
    NAMESPACE_USE_BANNED_WORD_ERROR: 'Namespace_cannot_use_forbidden_words',
    SUB_NAMESPACE_LENGTH_LONGER_THAN_64_ERROR: 'The_sub_namespace_cannot_be_longer_than_16',
    NODE_CONNECTION_ERROR: 'Node_connection_failed',
    KEYSTORE_DECRYPTION_FAILED: 'Keystore_decryption_failed',
    MOSAIC_LIST_NULL_ERROR: 'The_mosaic_to_be_sent_is_empty',
    ADDRESS_ALIAS_NOT_EXIST_ERROR: 'address_alias_not_exist',
    MOSAIC_ALIAS_NOT_EXIST_ERROR: 'mosaic_alias_not_exist',
    HD_WALLET_PATH_ERROR: 'hd_wallet_path_error',
    NODE_EXISTS_ERROR: 'node_exists_error',
    SEED_WALLET_OVERFLOW_ERROR: 'seed_wallet_can_not_be_more_than_10',
    LOADING:'Loading',
    CLICK_TO_LOAD: 'click_to_load',
    REFRESH_TOO_FAST_WARNING:'refresh_too_fast_warning',
    NO_NETWORK_CURRENCY: 'no_network_currency_alert',
    MULTISIG_ACCOUNTS_NO_TX: "Multisig_accounts_can_not_send_a_transaction_by_themselves",
    USER_ABORTED_TX_CONFIRMATION: 'User_aborted_transaction_confirmation',
}

export const FEE_SPEEDS: Record<string, string> = {
    SLOW: 'SLOW',
    NORMAL: 'NORMAL',
    FAST: 'FAST',
}

export const FEE_GROUPS: Record<string, string> = {
    SINGLE: 'SINGLE',
    DOUBLE: 'DOUBLE',
    TRIPLE: 'TRIPLE',
}

export const MULTISIG_INFO: Record<string, string> = {
    MULTISIG_INFO: 'Multisig Info',
    COSIGNATORIES: 'Cosignatories',
    MULTISIG_ACCOUNTS:'Multisig accounts',
    PUBLIC_KEY: 'Public key : ',
    ADDRESS: "Address : ",
    MIN_APPROVAL: "Min approval : ",
    MIN_REMOVAL: "Min removal : "
}
export const DEFAULT_FEES: Record<string, DefaultFee[]> = {
    [FEE_GROUPS.SINGLE]: [
        {speed: FEE_SPEEDS.SLOW, value: 0.05},
        {speed: FEE_SPEEDS.NORMAL, value: 0.1},
        {speed: FEE_SPEEDS.FAST, value: 1},
    ],
    [FEE_GROUPS.DOUBLE]: [
        {speed: FEE_SPEEDS.SLOW, value: 0.1},
        {speed: FEE_SPEEDS.NORMAL, value: 0.2},
        {speed: FEE_SPEEDS.FAST, value: 2},
    ],
    [FEE_GROUPS.TRIPLE]: [
        {speed: FEE_SPEEDS.SLOW, value: 0.3},
        {speed: FEE_SPEEDS.NORMAL, value: 0.9},
        {speed: FEE_SPEEDS.FAST, value: 3},
    ],
}

const defaultNetworkMosaic: NetworkCurrency = {
    hex: '',
    divisibility: 1,
    ticker: '',
    name: '',
}

export const defaultNetworkConfig = {
    gas2xemRate: 20000,   //  1xem=20000gas
    networkConfirmations: 10,
    defaultNetworkMosaic,
    DEFAULT_LOCK_AMOUNT: 10000000,
}

export const networkConfig = {
    targetBlockTime: 15,
    enableVerifiableState: true,
    enableVerifiableReceipts: true,
    blockTimeSmoothingFactor: 3000,
    importanceGrouping: 39,
    importanceActivityPercentage: 5,
    maxRollbackBlocks: 40,
    maxDifficultyBlocks: 60,
    defaultDynamicFeeMultiplier: 10000,
    maxMosaicAtomicUnits: 9000000000,
    totalChainImportance: 15,
    minHarvesterBalance: 500,
    harvestBeneficiaryPercentage: 10,
    blockPruneInterval: 360,
    maxTransactionsPerBlock: 5000,
    maxTransactionsPerAggregate: 1000,
    maxCosignaturesPerAggregate: 15,
    enableStrictCosignatureCheck: false,
    enableBondedAggregateSupport: true,
    maxBondedTransactionLifetime: "48h",
    lockedFundsPerAggregate: 10,
    maxHashLockDuration: "2d",
    maxSecretLockDuration: "30d",
    minProofSize: 1,
    maxProofSize: 1000,
    maxValueSize: 1024,
    maxMosaicsPerAccount: 10000,
    maxMosaicDuration: "3650d",
    maxMosaicDivisibility: 6,
    mosaicRentalFeeSinkPublicKey: "53E140B5947F104CABC2D6FE8BAEDBC30EF9A0609C717D9613DE593EC2A266D3",
    mosaicRentalFee: 500,
    maxMultisigDepth: 3,
    maxCosignatoriesPerAccount: 10,
    maxCosignedAccountsPerAccount: 14,
    maxNameSize: 64,
    maxChildNamespaces: 256,
    maxNamespaceDepth: 3,
    minNamespaceDuration: "1m",
    maxNamespaceDuration: "365d",
    namespaceGracePeriodDuration: 172800, // Blocks
    reservedRootNamespaceNames: ["xem", "nem", "user", "account", "org", "com", "biz", "net", "edu", "mil", "gov", "info"],
    namespaceRentalFeeSinkPublicKey: "3E82E1C1E4A75ADAA3CBA8C101C3CD31D9817A2EB966EB3B511FB2ED45B8E262",
    rootNamespaceRentalFeePerBlock: 1000000,
    childNamespaceRentalFee: 100,
    maxAccountRestrictionValues: 512,
    maxMosaicRestrictionValues: 20,
    maxMessageSize: 1024,
    // @TODO: separate network config from app configs
    namespaceListSize: 9,
    seedWalletMaxAmount: 10,
    testMnemonicString: 'this is a test string his is a test string this is',
    EMPTY_LINKED_ACCOUNT_KEY: '0000000000000000000000000000000000000000000000000000000000000000',
}
