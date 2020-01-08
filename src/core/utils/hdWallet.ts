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
  return getAccountFromPath(mnemonic, getPath(pathNumber), networkType)
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

export const getTenAddressesFromMnemonic = (
  mnemonic: string,
  networkType: NetworkType,
): Address[] => [...Array(10)]
  .map((_, index) => getAccountFromPathNumber(mnemonic, index, networkType).address)

export const getRemoteAccountFromPrivateKey = (
  privateKey: string,
  remoteAccountIndex: number,
  networkType: NetworkType,
): Account => {
  if (remoteAccountIndex === null || remoteAccountIndex === undefined) {
    throw new Error('invalid argument provided to getRemoteAccountFromPrivateKey')
  }

  const network = getNetworkFromNetworkType(networkType)
  const privateBytes = Buffer.from(Convert.hexToUint8(privateKey))
  const masterKey = new NodeEd25519(privateBytes, undefined, Buffer.from(''), network);
  const extendedKey = masterKey.derivePath(`m/44'/43'/0'/${remoteAccountIndex}'/0'`)
  return Account.createFromPrivateKey(extendedKey.privateKey.toString('hex'), networkType)
}
