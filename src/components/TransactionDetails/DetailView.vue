<script>
// external dependencies
import { TransactionType } from 'symbol-sdk'

// internal dependencies
import Transfer from '@/components/TransactionDetails/Transfer/Transfer.vue'

// child components
import AccountAddressRestriction from '@/components/TransactionDetails/AccountAddressRestriction/AccountAddressRestriction.vue'
// @ts-ignore
import AccountLink from '@/components/TransactionDetails/AccountLink/AccountLink.vue'
// @ts-ignore
import AccountMetadata from '@/components/TransactionDetails/AccountMetadata/AccountMetadata.vue'
// @ts-ignore
import AccountMosaicRestriction from '@/components/TransactionDetails/AccountMosaicRestriction/AccountMosaicRestriction.vue'
// @ts-ignore
import AccountOperationRestriction from '@/components/TransactionDetails/AccountOperationRestriction/AccountOperationRestriction.vue'
// @ts-ignore
import Alias from '@/components/TransactionDetails/Alias/Alias.vue'
// @ts-ignore
import HashLock from '@/components/TransactionDetails/HashLock/HashLock.vue'
// @ts-ignore
import MosaicAddressRestriction from '@/components/TransactionDetails/MosaicAddressRestriction/MosaicAddressRestriction.vue'
// @ts-ignore
import MosaicDefinition from '@/components/TransactionDetails/MosaicDefinition/MosaicDefinition.vue'
// @ts-ignore
import MosaicGlobalRestriction from '@/components/TransactionDetails/MosaicGlobalRestriction/MosaicGlobalRestriction.vue'
// @ts-ignore
import MosaicMetadata from '@/components/TransactionDetails/MosaicMetadata/MosaicMetadata.vue'
// @ts-ignore
import MosaicSupplyChange from '@/components/TransactionDetails/MosaicSupplyChange/MosaicSupplyChange.vue'
// @ts-ignore
import MultisigAccountModification from '@/components/TransactionDetails/MultisigAccountModification/MultisigAccountModification.vue'
// @ts-ignore
import NamespaceMetadata from '@/components/TransactionDetails/NamespaceMetadata/NamespaceMetadata.vue'
// @ts-ignore
import NamespaceRegistration from '@/components/TransactionDetails/NamespaceRegistration/NamespaceRegistration.vue'
// @ts-ignore
import SecretLock from '@/components/TransactionDetails/SecretLock/SecretLock.vue'
// @ts-ignore
import SecretProof from '@/components/TransactionDetails/SecretProof/SecretProof.vue'

export default {
  // Using a funcional patterns helps with performance for the conditional rendering of many components
  functional: true,
  render: (h, { data, props }) => {
    const { view } = props
    const { type } = view.transaction

    if (type === TransactionType.TRANSFER) return <Transfer {...data} />
    if (type === TransactionType.ACCOUNT_ADDRESS_RESTRICTION) return <AccountAddressRestriction {...data} />
    if (type === TransactionType.ACCOUNT_LINK) return <AccountLink {...data} />
    if (type === TransactionType.ACCOUNT_METADATA) return <AccountMetadata {...data} />
    if (type === TransactionType.ACCOUNT_MOSAIC_RESTRICTION) return <AccountMosaicRestriction {...data} />
    if (type === TransactionType.ACCOUNT_OPERATION_RESTRICTIONn) return <AccountOperationRestriction {...data} />
    if (type === TransactionType.ADDRESS_ALIAS || type === TransactionType.MOSAIC_ALIAS) return <Alias {...data} />
    if (type === TransactionType.HASH_LOCK) return <HashLock {...data} />
    if (type === TransactionType.MOSAIC_ADDRESS_RESTRICTION) return <MosaicAddressRestriction {...data} />
    if (type === TransactionType.MOSAIC_DEFINITION) return <MosaicDefinition {...data} />
    if (type === TransactionType.MOSAIC_GLOBAL_RESTRICTION) return <MosaicGlobalRestriction {...data} />
    if (type === TransactionType.MOSAIC_METADATA) return <MosaicMetadata {...data} />
    if (type === TransactionType.MOSAIC_SUPPLY_CHANGE) return <MosaicSupplyChange {...data} />
    if (type === TransactionType.MULTISIG_ACCOUNT_MODIFICATION) return <MultisigAccountModification {...data} />
    if (type === TransactionType.NAMESPACE_METADATA) return <NamespaceMetadata {...data} />
    if (type === TransactionType.NAMESPACE_REGISTRATION) return <NamespaceRegistration {...data} />
    if (type === TransactionType.SECRET_LOCK) return <SecretLock {...data} />
    if (type === TransactionType.SECRET_PROOF) return <SecretProof {...data} />

    throw new Error('Something went wrong when rendering DetailView')
  },
}
</script>
