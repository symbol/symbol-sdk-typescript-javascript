import {
    LinkAction, AliasAction, MosaicSupplyChangeAction, NamespaceRegistrationType,
} from 'nem2-sdk'
import {NETWORK_PARAMS, SDK_PARAMS, APP_PARAMS} from './constants'
import {CUSTOM_VALIDATORS_NAMES} from './registerCustomValidators'

const {
    MAX_MOSAIC_ATOMIC_UNITS,
    MAX_MOSAIC_DIVISIBILITY,
    MAX_MOSAIC_DURATION,
    GENERATION_HASH_LENGTH,
    MAX_MESSAGE_LENGTH,
    MIN_MIN_APPROVAL_DELTA,
    MAX_MIN_APPROVAL_DELTA,
    MIN_MIN_REMOVAL_DELTA,
    MAX_MIN_REMOVAL_DELTA,
    MIN_NAMESPACE_DURATION,
    MAX_NAMESPACE_DURATION,
    DEFAULT_NETWORK_TYPE,
    PRIVATE_KEY_LENGTH,
    PUBLIC_KEY_LENGTH,
    MIN_WALLET_NAME_LENGTH,
    MAX_WALLET_NAME_LENGTH,
    NAMESPACE_MAX_LENGTH,
} = NETWORK_PARAMS

const {availableNetworkTypes, mosaicSupplyChangeActions} = SDK_PARAMS
const {MIN_PASSWORD_LENGTH} = APP_PARAMS


export const standardFields = {
    previousPassword: {
        default: '',
        label: 'LABEL_previous_password',
        name: 'previousPassword',
        type: 'password',
        validation: 'required|confirmLock:cipher',
        hint: ['HINT_previous_password'],
        placeholder: 'PLACEHOLDER_previous_password'
    },
    newPassword: {
        default: '',
        label: 'LABEL_new_password',
        name: 'newPassword',
        type: 'password',
        validation: {
            required: true,
            min: MIN_PASSWORD_LENGTH,
        },
        hint: ['HINT_new_password1', 'HINT_new_password2'],
        placeholder: 'PLACEHOLDER_new_password'
    },

    confirmPassword: {
        default: '',
        label: 'LABEL_confirm_password',
        name: 'confirmPassword',
        type: 'password',
        validation: 'required|confirmPassword:newPassword',
        hint: [],
        placeholder: 'PLACEHOLDER_confirm_password'
    },

    password: {
        default: '',
        label: 'password',
        name: 'password',
        type: 'text',
        validation: {
            required: true,
            min: MIN_PASSWORD_LENGTH,
        },
        hint: 'HINT_password',
        placeholder: 'PLACEHOLDER_password',
    },

    walletPassword: {
        default: '',
        label: 'password',
        name: 'password',
        type: 'password',
        validation: 'required|confirmWalletPassword:wallet',
        hint: 'HINT_password',
        placeholder: 'PLACEHOLDER_password',
    },

    cipher: {
        default: '',
        label: '',
        name: 'cipher',
        type: 'text',
        validation: '',
        hint: [],
        placeholder: ''
    },
    hint: {
        default: '',
        label: 'hint',
        name: 'cipherHint',
        type: 'text',
        hint: ['HINT_cipher_hint1', 'HINT_new_password2'],
        placeholder: 'PLACEHOLDER_cipher_hint'
    },
    address: {
        default: '',
        label: 'address',
        name: 'address',
        type: 'text',
        validation: 'required|address',
        hint: 'HINT_address',
        placeholder: 'PLACEHOLDER_address',
    },
    amount: {
        default: '',
        label: 'amount',
        name: 'amount',
        type: 'text',
        validation: `min_value:0|max_value:${MAX_MOSAIC_ATOMIC_UNITS}|decimal:0`,
        hint: [],
        placeholder: 'PLACEHOLDER_amount',
    },
    mosaicListLength: {
        default: 0,
        label: 'mosaicListLength',
        name: 'mosaicListLength',
        type: 'text',
        validation: `min_value:1`,
        hint: 'HINT_mosaic_list',
        placeholder: '',
    },
    divisibility: {
        default: 1,
        label: 'divisibility',
        name: 'divisibility',
        type: 'text',
        validation: `required: true|min_value:1|max_value:${MAX_MOSAIC_DIVISIBILITY}`,
        hint: 'HINT_divisibility',
        placeholder: 'PLACEHOLDER_divisibility',
    },

    duration: {
        default: '0',
        label: 'duration',
        name: 'duration',
        type: 'text',
        validation: `required: true|min_value:0|max_value:${MAX_MOSAIC_DURATION}`,
        hint: 'HINT_duration',
        placeholder: 'PLACEHOLDER_duration',
    },

    endpoint: {
        default: '',
        label: 'endpoint',
        name: 'endpoint',
        type: 'text',
        validation: {url: {require_protocol: true, require_tld: false}},
        hint: 'HINT_endpoint',
        placeholder: 'PLACEHOLDER_endpoint',
    },

    generationHash: {
        default: '',
        label: 'generationHash',
        name: 'generationHash',
        type: 'text',
        validation: `required: true|min:${GENERATION_HASH_LENGTH}|max:${GENERATION_HASH_LENGTH}`,
        hint: 'HINT_generationHash',
        placeholder: 'PLACEHOLDER_generationHash',
    },

    maxFee: {
        default: '',
        label: 'maxFee',
        name: 'maxFee',
        type: 'text',
        validation: 'min_value: 0',
        hint: 'HINT_maxFee',
        placeholder: 'PLACEHOLDER_maxFee',
    },

    message: {
        default: '',
        label: 'message',
        name: 'message',
        type: 'text',
        validation: `max:${MAX_MESSAGE_LENGTH}`,
        hint: 'HINT_message',
        placeholder: 'PLACEHOLDER_message',
    },

    minApprovalDelta: {
        default: 1,
        label: 'minApprovalDelta',
        name: 'minApprovalDelta',
        type: 'text',
        validation: `required: true|min_value:${MIN_MIN_APPROVAL_DELTA}|max_value:${MAX_MIN_APPROVAL_DELTA}`,
        hint: 'HINT_minApprovalDelta',
        placeholder: 'PLACEHOLDER_minApprovalDelta',
    },

    minRemovalDelta: {
        default: 1,
        label: 'minRemovalDelta',
        name: 'minRemovalDelta',
        type: 'text',
        validation: `required: true|min_value:${MIN_MIN_REMOVAL_DELTA}|max_value: ${MAX_MIN_REMOVAL_DELTA}`,
        hint: 'HINT_minRemovalDelta',
        placeholder: 'PLACEHOLDER_minRemovalDelta',
    },

    mosaicId: {
        default: '',
        label: 'mosaicId',
        name: 'mosaicId',
        type: 'text',
        validation: 'required|mosaicId',
        hint: 'HINT_mosaicId',
        placeholder: 'PLACEHOLDER_mosaicId',
    },

    MosaicSupplyChangeAction: {
        default: MosaicSupplyChangeAction.Increase,
        label: 'MosaicSupplyChangeAction',
        name: 'MosaicSupplyChangeAction',
        type: 'text',
        validation: 'required',
        hint: 'HINT_MosaicSupplyChangeAction',
        items: mosaicSupplyChangeActions,
    },

    namespaceDuration: {
        default: MIN_NAMESPACE_DURATION,
        label: 'duration',
        name: 'duration',
        type: 'text',
        validation: `required: true|min_value:${MIN_NAMESPACE_DURATION}|max_value:${MAX_NAMESPACE_DURATION}`,
        hint: 'HINT_duration',
        placeholder: 'PLACEHOLDER_duration',
    },

    namespaceName: {
        default: '',
        label: 'namespaceName',
        name: 'namespaceName',
        type: 'text',
        validation: {
            required: true,
            regex: `^[a-z0-9-_]{1,${NAMESPACE_MAX_LENGTH}}$`,
        },
        hint: 'HINT_namespaceName',
        placeholder: 'PLACEHOLDER_namespaceName',
    },

    networkType: {
        default: DEFAULT_NETWORK_TYPE,
        label: 'networkType',
        name: 'networkType',
        type: 'text',
        validation: '',
        hint: 'HINT_networkType',
        items: availableNetworkTypes,
    },

    privateKey: {
        default: '',
        label: 'privateKey',
        name: 'privateKey',
        type: 'password',
        validation: `min:${PRIVATE_KEY_LENGTH}|max:${PRIVATE_KEY_LENGTH}|privateKey`,
        hint: 'HINT_privateKey',
        placeholder: 'PLACEHOLDER_privateKey',
    },

    publicKey: {
        default: '',
        label: 'publicKey',
        name: 'publicKey',
        type: 'text',
        validation: `min:${PUBLIC_KEY_LENGTH}|max:${PUBLIC_KEY_LENGTH}`,
        hint: 'HINT_publicKey',
        placeholder: 'PLACEHOLDER_publicKey',
    },

    remoteAccountKey: {
        default: '',
        label: 'remoteAccountKey',
        name: 'remoteAccountKey',
        type: 'text',
        validation: `required: true|min:${PUBLIC_KEY_LENGTH}|max:${PUBLIC_KEY_LENGTH}`,
        hint: 'HINT_remoteAccountKey',
        placeholder: 'PLACEHOLDER_remoteAccountKey',
    },

    subNamespaceName: {
        default: '',
        label: 'subNamespaceName',
        name: 'subNamespaceName',
        type: 'text',
        validation: {
            required: true,
            regex: `^[a-z0-9-_.]{1,${NAMESPACE_MAX_LENGTH}}$`,
        },
        hint: 'HINT_subNamespaceName',
        placeholder: 'PLACEHOLDER_subNamespaceName',
    },

    supply: {
        default: 1,
        label: 'supply',
        name: 'supply',
        type: 'text',
        validation: `required: true|min_value: 1|max_value:${MAX_MOSAIC_ATOMIC_UNITS}`,
        hint: 'HINT_supply',
        placeholder: 'PLACEHOLDER_supply',
    },

    walletName: {
        default: '',
        label: 'walletName',
        name: 'walletName',
        type: 'text',
        validation: `min:${MIN_WALLET_NAME_LENGTH}|max:${MAX_WALLET_NAME_LENGTH}`,
        hint: 'HINT_walletName',
        placeholder: 'PLACEHOLDER_walletName',
    },

    webHook: {
        default: '',
        label: 'webHook',
        name: 'webHook',
        type: 'text',
        validation: 'url',
        hint: 'HINT_webHook',
        placeholder: 'PLACEHOLDER_webHook',
    },

    addressOrAlias: {
        validation: `required|${CUSTOM_VALIDATORS_NAMES.addressOrAlias}`,
    },

    linkActions: {default: LinkAction.Link},
    aliasLinkActions: {default: AliasAction.Link},
    supplyMutable: {default: true, label: 'Mutable-supply'},
    transferable: {default: true, label: 'Transferable'},
    levyMutable: {default: true, label: 'Mutable-levy'},
    restrictable: {default: true, label: 'Restrictable'},
    namespaceTypes: {default: NamespaceRegistrationType.RootNamespace},
}

export const radioFields = {
    linkActions: [
        {label: 'Link', type: LinkAction.Link},
        {label: 'Unlink', type: LinkAction.Unlink},
    ],
    aliasLinkActions: [
        {label: 'Link', type: AliasAction.Link},
        {label: 'Unlink', type: AliasAction.Unlink},
    ],
    namespaceTypes: [
        {type: NamespaceRegistrationType.RootNamespace, label: 'RootNamespace'},
        {type: NamespaceRegistrationType.SubNamespace, label: 'SubNamespace'},
    ],
}

export const selectFields = {
    restrictionTypes: {
        label: 'restrictionType',
        name: 'restrictionType',
        validation: 'required',
    },
    transactionTypes: {
        label: 'transactionType',
        name: 'transactionType',
        validation: 'required',
    },
    modifications: {
        label: 'modification',
        name: 'modification',
        validation: 'required',
    },
}

export default standardFields
