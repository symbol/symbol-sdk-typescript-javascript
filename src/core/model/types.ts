import { Transaction, MultisigAccountInfo  } from 'nem2-sdk';
import { AppNamespace } from './AppNamespace';
import { AppMosaic } from './AppMosaic';

export interface AddressAndTransaction {
  address: string
  transaction: Transaction
}

export interface AddressAndNamespaces {
    address: string
    namespaces: AppNamespace[]
}

export interface AddressAndMosaics {
    address: string
    mosaics: AppMosaic[]
}

export interface AddressAndMultisigInfo {
    address: string
    multisigAccountInfo: MultisigAccountInfo 
}