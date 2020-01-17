import { Address } from 'nem2-sdk';

export interface StoreWallet {
  walletsList: AppWallet[],
  activeWalletAddress: Address,
}
