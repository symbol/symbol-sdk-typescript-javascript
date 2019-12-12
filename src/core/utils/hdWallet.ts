import {ExtendedKey, MnemonicPassPhrase, Wallet, Network} from "nem2-hd-wallets"
import {NetworkType, Account, Address} from 'nem2-sdk'
import {sequenceEqual} from 'rxjs/operators'

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

export const getAccountFromPathNumber = (
    mnemonic: string,
    pathNumber: number,
    networkType: NetworkType
): Account => {
    const path = getPath(pathNumber)
    const PassPhrase = new MnemonicPassPhrase(mnemonic)
    const network = getNetworkFromNetworkType(networkType)
    const bip32Node = ExtendedKey.createFromSeed(PassPhrase.toEntropy(), network)
    const wallet = new Wallet(bip32Node.derivePath(path))
    // @ts-ignore
    return wallet.getAccount(networkType)
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
    .map((_, index) =>  getAccountFromPathNumber(mnemonic, index, networkType).address)
