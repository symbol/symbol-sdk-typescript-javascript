import {HdWallet, randomizeMnemonicWordArray} from '@/core/model/hdWallet/HdWallet.ts'
import {hdAccount, hdAccountData, hdAccountTestNet, CosignAccount, CosignAccountRemoteMijinTest, CosignAccountRemoteTestNet} from "@MOCKS/index"
import {NetworkType, Address, SimpleWallet, Password} from 'nem2-sdk'
import {Network} from 'nem2-hd-wallets'
import {AppWallet, CreateWalletType, AppAccounts} from '@/core/model'

describe('randomizeMnemonicWordArray', () => {
 it('should shuffle an array of string', () => {
  const initialArray = ['a', 'b', 'c', 'd', 'e']
  let randomizedArray = randomizeMnemonicWordArray([...initialArray])
  expect(randomizedArray.length).toBe(initialArray.length)
  initialArray.forEach((word) => randomizedArray.splice(randomizedArray.indexOf(word), 1))
  expect(randomizedArray.length).toBe(0)
 })
})

describe('getAccountFromPathNumber', () => {
 it('should return proper addresses for a MIJIN_TEST account', () => {
  const account0 = HdWallet.getAccountFromPathNumber(hdAccountData.mnemonic, 0, hdAccount.networkType)
  expect(account0.address.plain()).toBe(hdAccount.wallets[0].address)

  const account1 = HdWallet.getAccountFromPathNumber(hdAccountData.mnemonic, 1, hdAccount.networkType)
  expect(account1.address.plain()).toBe(hdAccount.wallets[1].address)

  const account2 = HdWallet.getAccountFromPathNumber(hdAccountData.mnemonic, 2, hdAccount.networkType)
  expect(account2.address.plain()).toBe(hdAccount.wallets[2].address)

  const account3 = HdWallet.getAccountFromPathNumber(hdAccountData.mnemonic, 3, hdAccount.networkType)
  expect(account3.address.plain()).toBe(hdAccount.wallets[3].address)
 })

 it('should return proper addresses for a TEST_NET account', () => {
  const account0 = HdWallet.getAccountFromPathNumber(hdAccountData.mnemonic, 0, hdAccountTestNet.networkType)
  expect(account0.address.plain()).toBe(hdAccountTestNet.wallets[0].address)

  const account1 = HdWallet.getAccountFromPathNumber(hdAccountData.mnemonic, 1, hdAccountTestNet.networkType)
  expect(account1.address.plain()).toBe(hdAccountTestNet.wallets[1].address)

  const account2 = HdWallet.getAccountFromPathNumber(hdAccountData.mnemonic, 2, hdAccountTestNet.networkType)
  expect(account2.address.plain()).toBe(hdAccountTestNet.wallets[2].address)

  const account3 = HdWallet.getAccountFromPathNumber(hdAccountData.mnemonic, 3, hdAccountTestNet.networkType)
  expect(account3.address.plain()).toBe(hdAccountTestNet.wallets[3].address)
 })
})

describe('getNetworkFromNetworkType', () => {
 it('should return the correct Network when provided a valid NetworkType', () => {
  // @ts-ignore
  expect(new HdWallet().getNetworkFromNetworkType(NetworkType.MIJIN_TEST)).toEqual(Network.CATAPULT)
  // @ts-ignore
  expect(new HdWallet().getNetworkFromNetworkType(NetworkType.MIJIN)).toEqual(Network.CATAPULT)
  // @ts-ignore
  expect(new HdWallet().getNetworkFromNetworkType(NetworkType.TEST_NET)).toEqual(Network.CATAPULT_PUBLIC)
  // @ts-ignore
  expect(new HdWallet().getNetworkFromNetworkType(NetworkType.MAIN_NET)).toEqual(Network.CATAPULT_PUBLIC)
 })

 it('should throw when provided an invalid networkType', () => {
  // @ts-ignore
  expect(() => {new HdWallet().getNetworkFromNetworkType(0)}).toThrow();
  // @ts-ignore
  expect(() => {new HdWallet().getNetworkFromNetworkType(null)}).toThrow();
  // @ts-ignore
  expect(() => {new HdWallet().getNetworkFromNetworkType(undefined)}).toThrow();
 })
})

describe('getAddressesFromMnemonic', () => {
 it('should return 10 proper addresses for a TEST_NET account', () => {
  expect(HdWallet.getAddressesFromMnemonic(hdAccountData.mnemonic, 10, hdAccount.networkType))
   .toEqual([
    Address.createFromRawAddress('SAJFKFAHB4UNEK4LJM76C7L5YMBSB74AKMSAXJJ7'),
    Address.createFromRawAddress('SCSAG54ILQGI3FYF66LQYXF4GLGZSKQD4MNAL7LD'),
    Address.createFromRawAddress('SDSHGSEXS2G2YCVJIUBZFWX2RJ6QMBEUZQJAVQXD'),
    Address.createFromRawAddress('SB5YAT47PX7S7NTDVZGH6DOWPCU6CSRQNSOATHOL'),
    Address.createFromRawAddress('SA26GLXILCYZP2ROF5GJBTQEGYRHXLH6MKYMGBVM'),
    Address.createFromRawAddress('SC6VUM5MDFE3VIRNYE5SF4HUW4CQGVAEC7TJXVTW'),
    Address.createFromRawAddress('SD5X3IEOITG6ACARHNK5FCPO3OKEW35LX2GN63MO'),
    Address.createFromRawAddress('SDDSZNKC5NSRUA7YHGNFGFSQOJ3IGV7XEHOB2IDF'),
    Address.createFromRawAddress('SBR25YXDXJXYER4C6VUNCGTJ4FXNFIIXY3G42P46'),
    Address.createFromRawAddress('SCIUGE27NJLXC3OJS54WICKHCACNLYKQCYLHP5TU'),
   ])
 })

 it('should return 10 proper addresses for a MIJIN_TEST account', () => {
  expect(HdWallet.getAddressesFromMnemonic(hdAccountData.mnemonic, 10, hdAccountTestNet.networkType))
   .toEqual([
    Address.createFromRawAddress('TDI5MK645MRVXGEZF52J5OW25DCPNHXVQ5FEMLFR'),
    Address.createFromRawAddress('TA77TDXXSBEHTY72FPTFYNJGGUONJ2NT467YVE34'),
    Address.createFromRawAddress('TBV45KMJKBMIBMOSZ435FULAIC5HE7WFUJPJFRML'),
    Address.createFromRawAddress('TDJXJIDKOLX3WNI4EEGB54GLNB6BKJXTYTS5W76Y'),
    Address.createFromRawAddress('TCUKSN253F4OWYPDVZDCKIZN3ZHYIS4ZIN6ANHVW'),
    Address.createFromRawAddress('TB32PN7OACR35V7B6URPL7RY2FBKV5T3AG532O4E'),
    Address.createFromRawAddress('TB2JBDAG6KBMDDGECVASHGUONDA6XIU5CUF5WHUA'),
    Address.createFromRawAddress('TAPY4HAURO4SQMCZ5QPJPWAI5EVTIWMVJPRYK5M6'),
    Address.createFromRawAddress('TBT3M23LBTT5WFE75VLDLV2ALY3MGWKBMS7GDLUK'),
    Address.createFromRawAddress('TCYHXYZKBUVHK52L5N4D4F7PRHGBWGEGQ7EU2G3B'),
   ])
 })
})



describe('getRemoteAccountFromPrivateKey', () => {
 const password = new Password('password1')

 const mijinPrivateKeyWallet = AppWallet.createFromDTO({
  name: 'pkeyWallet',
  simpleWallet: SimpleWallet.createFromPrivateKey(
   'pkeyWallet', password, CosignAccount.privateKey, NetworkType.MIJIN_TEST,
  ),
  networkType: NetworkType.MIJIN_TEST,
  sourceType: CreateWalletType.privateKey,
 })

 it('should throw if the account index is undefined', () => {
  expect(() => {
   HdWallet.getRemoteAccountsFromPrivateKey(
    CosignAccount.privateKey,
    undefined,
    mijinPrivateKeyWallet.networkType,
    1,
   )
  }).toThrow()
 })

 it('should throw if the account index is null', () => {
  expect(() => {
   HdWallet.getRemoteAccountsFromPrivateKey(
    CosignAccount.privateKey,
    null,
    mijinPrivateKeyWallet.networkType,
    1,
   )
  }).toThrow()
 })

 it('should return the correct account, on MIJIN_TEST', () => {
  const account = HdWallet.getRemoteAccountsFromPrivateKey(
   CosignAccount.privateKey,
   1,
   NetworkType.MIJIN_TEST,
   1,
  )

  expect(account[0]).toEqual(CosignAccountRemoteMijinTest)
 })

 it('should return the correct account, on TEST_TEST', () => {
  const account = HdWallet.getRemoteAccountsFromPrivateKey(
   CosignAccount.privateKey,
   1,
   NetworkType.TEST_NET,
   1,
  )
  expect(account[0]).toEqual(CosignAccountRemoteTestNet)
 })
})

describe('getSeedWalletRemoteAccounts', () => {
  const seedWallet = AppWallet.createFromDTO(hdAccount.wallets[0])
  const privateKeys = HdWallet.getSeedWalletRemoteAccounts(
   AppAccounts().decryptString(seedWallet.encryptedMnemonic, 'password'),
   seedWallet.path,
   1,
   NetworkType.MAIN_NET,
   5,
  ).map(({privateKey}) => privateKey.toString())
  expect(privateKeys[0]).toBe('EAF23048A2C8CA2CEBE32FEA0812AADDF06AF11B2F48AD10E41157D322B7CB34')
  expect(privateKeys[1]).toBe('8F500065DF6F931FFD8097D955D722FAFDC04F7D4FE8B907B3194F3DC60576CF')
  expect(privateKeys[2]).toBe('319C22D0C915B2E7C76004A21EE81F93278F96B3D59E38ED58720A9DB98BAB51')
  expect(privateKeys[3]).toBe('F0087BAC6BC6D83EA83877B7AF84B908583CB0C98C854C9EC855A9F702C5F077')
  expect(privateKeys[4]).toBe('AE6F04732EA0020B28A3C62F094BB8C97A50F8E7815780FFB5577D55B53194B5')
  expect(privateKeys[6]).toBe(undefined)
})
