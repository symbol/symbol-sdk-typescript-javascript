import { Address } from './Address';
import { NamespaceId } from '../namespace/NamespaceId';

/**
 * Custom type for unresolved address
 */
export type UnresolvedAddress = Address | NamespaceId;
