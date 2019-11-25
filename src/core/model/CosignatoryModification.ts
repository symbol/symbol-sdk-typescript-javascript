import {AddOrRemove} from './types'
import {PublicAccount, MultisigAccountModificationTransaction} from 'nem2-sdk'

export interface CosignatoryModification {
  addOrRemove: AddOrRemove
  cosignatory: PublicAccount
}

export class CosignatoryModifications {
  constructor(public modifications: CosignatoryModification[]) {}
  /**
   * If the same PublicAccount is already in CosignatoryModifications, it will be overridden
   * @param cosignatoryModification 
   */
  add(cosignatoryModification: CosignatoryModification) {
    const modificationsWithoutDuplicate = [...this.modifications]
      .filter(({cosignatory}) => cosignatory.publicKey !== cosignatoryModification.cosignatory.publicKey)

    this.modifications = [...modificationsWithoutDuplicate, cosignatoryModification]
  }

  get publicKeysAdditions(): PublicAccount[] {
    return this.modifications
      .filter(({addOrRemove}) => addOrRemove === AddOrRemove.ADD)
      .map(({cosignatory}) => cosignatory)
  }

  get publicKeysDeletions(): PublicAccount[] {
    return this.modifications
      .filter(({addOrRemove}) => addOrRemove === AddOrRemove.REMOVE)
      .map(({cosignatory}) => cosignatory)
  }

  static createFromMultisigAccountModificationTransaction(
    transaction: MultisigAccountModificationTransaction
  ): CosignatoryModifications {
    return new CosignatoryModifications([
      ...transaction.publicKeyAdditions.map(cosignatory => ({cosignatory, addOrRemove: AddOrRemove.ADD})),
      ...transaction.publicKeyDeletions.map(cosignatory => ({cosignatory, addOrRemove: AddOrRemove.REMOVE})),
    ])
  }

  reset() {
    this.modifications = []
  }
}

