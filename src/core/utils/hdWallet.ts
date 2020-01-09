import {ExtendedKey, MnemonicPassPhrase, Wallet, Network, NodeEd25519} from "nem2-hd-wallets"
import {NetworkType, Account, Address, Convert} from 'nem2-sdk'

export const getNetworkFromNetworkType = (networkType: NetworkType): Network => {
  if (networkType === NetworkType.MIJIN_TEST) return Network.CATAPULT
  if (networkType === NetworkType.MIJIN) return Network.CATAPULT
  if (networkType === NetworkType.TEST_NET) return Network.CATAPULT_PUBLIC
  if (networkType === NetworkType.MAIN_NET) return Network.CATAPULT_PUBLIC
  throw new Error('Invalid network type provided')
}

export const createMnemonic = () => {
  const mnemonic = MnemonicPassPhrase.createRandom('english')
  return mnemonic.plain
}

export const getPath = (int: number): string => {
  if (int === null || int === undefined) {
    throw new Error('invalid argument provided to getPath')
  }
  return `m/44'/43'/${int}'/0'/0'`
}

function buf2hex(buffer) {
  const byteArray = new Uint8Array(buffer);
  const hexParts = [];
  for (let i = 0; i < byteArray.length; i++) {
    const hex = byteArray[i].toString(16);
    const paddedHex = ('00' + hex).slice(-2);
    hexParts.push(paddedHex);
  }
  return hexParts.join('');
}

export const getRemoteAccountPath = (
  seedWalletPath: string,
  remoteAccountIndex: number,
): string => {
  if (remoteAccountIndex === null || remoteAccountIndex === undefined) {
    throw new Error('invalid argument provided to getPath')
  }

  const seedWalletIndex = getPathNumberFromPath(seedWalletPath)
  return `m/44'/43'/${seedWalletIndex}'/${remoteAccountIndex}'/0'`
}

export const getPathNumberFromPath = (path: string): number => {
  return parseInt(path.substring(10, 11), 10)
}

export const getAccountFromPath = (
  mnemonic: string,
  path: string,
  networkType: NetworkType
): Account => {
  const network = getNetworkFromNetworkType(networkType)
  const PassPhrase = new MnemonicPassPhrase(mnemonic)
  const bip32Seed = PassPhrase.toSeed()
  const bip32Node = ExtendedKey.createFromSeed(buf2hex(bip32Seed), network)
  const wallet = new Wallet(bip32Node.derivePath(path))
  const account = wallet.getAccount(networkType)
  return account
}

export const getAccountFromPathNumber = (
    mnemonic: string,
    pathNumber: number,
    networkType: NetworkType
  ): Account => {
    const path = getPath(pathNumber)
    const network = getNetworkFromNetworkType(networkType)
    const PassPhrase = new MnemonicPassPhrase(mnemonic)
    const bip32Seed = PassPhrase.toSeed()
    const bip32Node = ExtendedKey.createFromSeed(buf2hex(bip32Seed), network)
    const wallet = new Wallet(bip32Node.derivePath(path))
    const account = wallet.getAccount(networkType)
    return account
  }
  
  export const getAccountMnemonic = (
    bip32Seed: Buffer,
    pathNumber: number,
    networkType: NetworkType
  ): Account => {
    const path = getPath(pathNumber)
    const network = getNetworkFromNetworkType(networkType)
    const bip32Node = ExtendedKey.createFromSeed(buf2hex(bip32Seed), network)
    const wallet = new Wallet(bip32Node.derivePath(path))
    const account = wallet.getAccount(networkType)
    return account
  }

export const randomizeMnemonicWordArray = (array: string[]): string[] => {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array
}

export const getExtendedKeyFromBip32Seed = (
  bip32Seed: Buffer,
  networkType: NetworkType
): ExtendedKey => {
  const network = getNetworkFromNetworkType(networkType)
  return ExtendedKey.createFromSeed(buf2hex(bip32Seed), network)
}

export const getAccountFromBip32SeedAndPathNumber = (
  bip32Seed: Buffer,
  pathNumber: number,
  networkType: NetworkType
): Account => {
  const extendedKey = getExtendedKeyFromBip32Seed(bip32Seed, networkType)
  const wallet = new Wallet(extendedKey.derivePath(getPath(pathNumber)))
  return wallet.getAccount(networkType)
}

export const getAccountFromBip32SeedAndPath = (
  bip32Seed: Buffer,
  path: string,
  networkType: NetworkType
): Account => {
  const extendedKey = getExtendedKeyFromBip32Seed(bip32Seed, networkType)
  const wallet = new Wallet(extendedKey.derivePath(path))
  return wallet.getAccount(networkType)
}

export const createBip32Seed = (mnemonic: string)=>{
  const PassPhrase = new MnemonicPassPhrase(mnemonic);
  const bip32Seed = PassPhrase.toSeed();
  return bip32Seed;
}

export const getTenAddressesFromMnemonic = (
  mnemonic: string,
  networkType: NetworkType,
): Address[] =>{
  const bip32Seed = createBip32Seed(mnemonic)
  return [...Array(10)].map((_, index) => getAccountFromBip32SeedAndPathNumber(bip32Seed, index, networkType).address)
}

const getMasterKeyFromPrivateKey = (
  privateKey: string, 
  networkType: NetworkType,
): NodeEd25519 => {
  const network = getNetworkFromNetworkType(networkType)
  const privateBytes = Buffer.from(Convert.hexToUint8(privateKey))
  return new NodeEd25519(privateBytes, undefined, Buffer.from(''), network);
}

export const getRemoteAccountsFromPath = (
  mnemonic: string,
  path: string,
  remoteAccountFirstIndex: number,
  networkType: NetworkType,
  numberOfAccounts: number,
): Account[] => {
  const bip32Seed = createBip32Seed(mnemonic)
  const extendedKey = getExtendedKeyFromBip32Seed(bip32Seed, networkType)
  return [...Array(numberOfAccounts)]
      .map((_, index) => {
        const remoteAccountIndex = remoteAccountFirstIndex + index
        const remoteAccountPath = getRemoteAccountPath(path, remoteAccountIndex)
        return getAccountFromBip32SeedAndPath(bip32Seed, remoteAccountPath, networkType)
      })
}

export const getRemoteAccountsFromPrivateKey = (
  privateKey: string,
  remoteAccountFirstIndex: number,
  networkType: NetworkType,
  numberOfAccounts: number,
): Account[] => {
  if (remoteAccountFirstIndex === null || remoteAccountFirstIndex === undefined) {
    throw new Error('invalid argument provided to getRemoteAccountFromPrivateKey')
  }

  const masterKey = getMasterKeyFromPrivateKey(privateKey, networkType)

  return [...Array(numberOfAccounts)].map((ignored, index) => {
    const remoteAccountIndex = remoteAccountFirstIndex + index
    const extendedKey = masterKey.derivePath(`m/44'/43'/0'/${remoteAccountIndex}'/0'`)
    return Account.createFromPrivateKey(extendedKey.privateKey.toString('hex'), networkType)
  })
}
