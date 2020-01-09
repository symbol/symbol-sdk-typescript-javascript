import {ExtendedKey, MnemonicPassPhrase, Wallet, Network, NodeEd25519, NodeInterface} from "nem2-hd-wallets"
import {NetworkType, Account, Address, Convert} from 'nem2-sdk'
import {Path} from './Path'

// @AppAccounts refactor (decryptString)
export const randomizeMnemonicWordArray = (array: string[]): string[] => {
 for (var i = array.length - 1; i > 0; i--) {
  var j = Math.floor(Math.random() * (i + 1));
  var temp = array[i];
  array[i] = array[j];
  array[j] = temp;
 }
 return array
}


export class HdWallet {
 static getAccountFromPathNumber(
  mnemonic: string,
  pathNumber: number,
  networkType: NetworkType
 ): Account {
  const hdWallet = new HdWallet()
  const path = Path.getFromSeedIndex(pathNumber)
  const extendedKey = hdWallet.getExtendedKeyFromMnemonic(mnemonic, networkType)
  return hdWallet.getAccountFromExtendedKeyAndPath(extendedKey, path, networkType)
 }

 static getSeedWalletRemoteAccounts(
  mnemonic: string,
  seedWalletPath: string,
  remoteAccountFirstIndex: number,
  networkType: NetworkType,
  numberOfAccounts: number,
 ): Account[] {
  const hdWallet = new HdWallet()
  const remoteAccountsPaths = [...Array(numberOfAccounts).keys()]
    .map(index => Path.getRemoteAccountPath(seedWalletPath, remoteAccountFirstIndex + index))
  
  const extendedKey = hdWallet.getExtendedKeyFromMnemonic(mnemonic, networkType)
  return hdWallet.getAccountsFromExtendedKeyAndPaths(extendedKey, remoteAccountsPaths, networkType)
 }

 static getAddressesFromMnemonic(
  mnemonic: string,
  numberOfAddresses: number,
  networkType: NetworkType,
 ): Address[] {

  return HdWallet.getAccountsFromMnemonic(
   mnemonic, numberOfAddresses, networkType,
  ).map(({address}) => address)
 }

 static getAccountsFromMnemonic(
  mnemonic: string,
  numberOfAccounts: number,
  networkType: NetworkType,
 ): Account[] {
  const hdWallet = new HdWallet()
  const extendedKey = hdWallet.getExtendedKeyFromMnemonic(mnemonic, networkType)
  const paths = [...Array(numberOfAccounts).keys()]
   .map(index => Path.getFromSeedIndex(index))

  return hdWallet.getAccountsFromExtendedKeyAndPaths(
   extendedKey, paths, networkType,
  )
 }

 static getRemoteAccountsFromPrivateKey(
  privateKey: string,
  remoteAccountFirstIndex: number,
  networkType: NetworkType,
  numberOfAccounts: number,
 ): Account[] {
  const hdWallet = new HdWallet()
  const extendedKey = hdWallet.getExtendedKeyFromPrivateKey(privateKey, networkType) 
  const paths = [...Array(numberOfAccounts).keys()]
   .map(index => Path.getRemoteAccountPath(Path.getFromSeedIndex(0), remoteAccountFirstIndex + index))
 
  return hdWallet.getAccountsFromExtendedKeyAndPaths(
   extendedKey, paths, networkType,
  )
 }

 private getExtendedKeyFromMnemonic(
  mnemonic: string,
  networkType: NetworkType,
 ): ExtendedKey {
  const network = this.getNetworkFromNetworkType(networkType)
  const PassPhrase = new MnemonicPassPhrase(mnemonic);
  const bip32Seed = PassPhrase.toSeed();
  return ExtendedKey.createFromSeed(this.bufferToHex(bip32Seed), network)
 }

 private getExtendedKeyFromPrivateKey = (
  privateKey: string,
  networkType: NetworkType,
 ): ExtendedKey => {
  const network = this.getNetworkFromNetworkType(networkType)
  const privateBytes = Buffer.from(Convert.hexToUint8(privateKey))
  const nodeEd25519 = new NodeEd25519(privateBytes, undefined, Buffer.from(''), network);
  return new ExtendedKey(nodeEd25519, network)
 }

 private getAccountsFromExtendedKeyAndPaths(
  extendedKey: ExtendedKey,
  paths: string[],
  networkType: NetworkType,
 ): Account[] {
  return paths.map(path => this.getAccountFromExtendedKeyAndPath(
   extendedKey, path, networkType,
  ))
 }

 private getAccountFromExtendedKeyAndPath(
  extendedKey: ExtendedKey,
  path: string,
  networkType: NetworkType,
 ): Account {
  return new Wallet(extendedKey.derivePath(path)).getAccount(networkType)
 }

 private getNetworkFromNetworkType(networkType: NetworkType): Network {
  if (networkType === NetworkType.MIJIN_TEST) return Network.CATAPULT
  if (networkType === NetworkType.MIJIN) return Network.CATAPULT
  if (networkType === NetworkType.TEST_NET) return Network.CATAPULT_PUBLIC
  if (networkType === NetworkType.MAIN_NET) return Network.CATAPULT_PUBLIC
  throw new Error('Invalid network type provided')
 }

 private bufferToHex(buffer: Buffer): string {
  const byteArray = new Uint8Array(buffer);

  return [...Array(byteArray.length).keys()]
   .reduce((acc, index) =>
    `${acc}${('00' + byteArray[index].toString(16)).slice(-2)}`
    , '')
 }
}


