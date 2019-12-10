import {AppNamespace} from '@/core/model/AppNamespace.ts'
import {
 NamespaceName, NamespaceId, UInt64, Alias, AddressAlias,
 Address, NamespaceInfo, PublicAccount, NetworkType, EmptyAlias,
} from 'nem2-sdk';

const namespaceNamesMock = [
 new NamespaceName(
  new NamespaceId([3147028180, 4167244227]),
  'child',
  new NamespaceId([2246869892, 2299530832])
 ),
 new NamespaceName(
  new NamespaceId([2246869892, 2299530832]),
  'parent',
  new NamespaceId([1903945010, 2641873382])
 ),
 new NamespaceName(
  new NamespaceId([1903945010, 2641873382]),
  'grandparent',
 ),
]

const addressAlias = new AddressAlias(Address.createFromRawAddress('TCBIA24P5GO4QNI6H2TIRPXALWF7UKHPI6QOOVDM'))

const namespaceInfoMock = new NamespaceInfo(
 true,
 0,
 '5DE446EF94C9C20D9C0D60B6',
 1,
 3,
 [
  new NamespaceId([1903945010, 2641873382]),
  new NamespaceId([2246869892, 2299530832]),
  new NamespaceId([3147028180, 4167244227]),
 ],
 new NamespaceId([2246869892, 2299530832]),
 PublicAccount.createFromPublicKey(
  '7B05E175646E759D9A484A8E2E100DBAB66A42F7D0D628EF94CC585B41741182', NetworkType.MIJIN_TEST,
 ),
 new UInt64([22678, 0]),
 new UInt64([1195478, 0]),
 addressAlias,
)

const namespaceInfoNoAliasMock = new NamespaceInfo(
 true,
 0,
 '5DE446EF94C9C20D9C0D60B6',
 1,
 3,
 [
  new NamespaceId([1903945010, 2641873382]),
  new NamespaceId([2246869892, 2299530832]),
  new NamespaceId([3147028180, 4167244227]),
 ],
 new NamespaceId([2246869892, 2299530832]),
 PublicAccount.createFromPublicKey(
  '7B05E175646E759D9A484A8E2E100DBAB66A42F7D0D628EF94CC585B41741182', NetworkType.MIJIN_TEST,
 ),
 new UInt64([22678, 0]),
 new UInt64([1195478, 0]),
 new EmptyAlias(),
)


describe('fromNamespaceNames', () => {
 it('should return AppNamespaces with full names', () => {
  const namespaceNames = AppNamespace.fromNamespaceNames(namespaceNamesMock)
  expect(namespaceNames[0].name).toEqual('grandparent.parent.child')
  expect(namespaceNames[1].name).toEqual('grandparent.parent')
  expect(namespaceNames[2].name).toEqual('grandparent')
 });
});

describe('fromNamespaceName', () => {
 it('should return a child\'s name when its parent is not found', () => {
  const namespaceNames = AppNamespace.fromNamespaceNames([namespaceNamesMock[0]])
  expect(namespaceNames[0].name).toEqual('child')
 });
});

describe('fromNamespaceInfo', () => {
 it('should instantiate an AppNamespace with correct values', () => {
  const appNamespace = AppNamespace.fromNamespaceInfo(namespaceInfoMock, namespaceNamesMock)
  expect(appNamespace.hex).toBe('F86319C3BB93D6D4')
  expect(appNamespace.namespaceInfo).toBe(namespaceInfoMock)
  expect(appNamespace.isActive).toBe(true)
  expect(appNamespace.alias).toBe(addressAlias)
  expect(appNamespace.levels).toBe(3)
  expect(appNamespace.endHeight).toBe(1195478)
  expect(appNamespace.name).toBe('grandparent.parent.child')
 });

 it('should throw when not finding a matching namespace name', () => {
  expect(() => {AppNamespace.fromNamespaceInfo(namespaceInfoMock, [])}).toThrow()
 });
});

describe('isLinked', () => {
 it('should return true when linked', () => {
  expect(AppNamespace.fromNamespaceInfo(namespaceInfoMock, namespaceNamesMock).isLinked()).toBeTruthy()
 });

 it('should return false when not linked', () => {
  expect(AppNamespace.fromNamespaceInfo(namespaceInfoNoAliasMock, namespaceNamesMock).isLinked()).toBeFalsy()
 });
});

describe('fromNamespaceUpdate', () => {
 it('should return an updated AppNamespace', () => {
  const appNamespaceWithAlias = AppNamespace.fromNamespaceInfo(namespaceInfoMock, namespaceNamesMock)
  const appNamespaceNoAlias = AppNamespace.fromNamespaceInfo(namespaceInfoNoAliasMock, namespaceNamesMock)

  expect(appNamespaceNoAlias.hex).toBe('F86319C3BB93D6D4')
  expect(appNamespaceNoAlias.namespaceInfo).toBe(namespaceInfoNoAliasMock)
  expect(appNamespaceNoAlias.isActive).toBe(true)
  expect(appNamespaceNoAlias.alias).toBeInstanceOf(EmptyAlias)
  expect(appNamespaceNoAlias.levels).toBe(3)
  expect(appNamespaceNoAlias.endHeight).toBe(1195478)
  expect(appNamespaceNoAlias.name).toBe('grandparent.parent.child')
  expect(appNamespaceNoAlias.isLinked()).toBe(false)

  const fromNamespaceUpdate = AppNamespace.fromNamespaceUpdate(appNamespaceNoAlias, appNamespaceWithAlias)

  expect(fromNamespaceUpdate.hex).toBe('F86319C3BB93D6D4')
  expect(fromNamespaceUpdate.namespaceInfo).toBe(namespaceInfoMock)
  expect(fromNamespaceUpdate.isActive).toBe(true)
  expect(fromNamespaceUpdate.alias).toBe(addressAlias)
  expect(fromNamespaceUpdate.levels).toBe(3)
  expect(fromNamespaceUpdate.endHeight).toBe(1195478)
  expect(fromNamespaceUpdate.name).toBe('grandparent.parent.child')
  expect(fromNamespaceUpdate.isLinked()).toBe(true)
 });
});

describe('expirationInfo', () => {
 const appNamespace = AppNamespace.fromNamespaceInfo(namespaceInfoMock, namespaceNamesMock)

 it('should return null if currentHeight is not provided', () => {
  const expirationInfo = appNamespace.expirationInfo(undefined)
  expect(expirationInfo).toBe(null)
 });

 it('should return proper values', () => {
  const expirationInfo = appNamespace.expirationInfo(1200000)
  expect(expirationInfo.expired).toBeTruthy()
  expect(expirationInfo.remainingBeforeDeletion.blocks).toEqual(-4522)
  expect(expirationInfo.remainingBeforeDeletion.time).toEqual('- 18 h 50 m ')
  expect(expirationInfo.remainingBeforeExpiration.blocks).toEqual(-177322)
  expect(expirationInfo.remainingBeforeExpiration.time).toEqual('- 30 d 18 h 50 m ')
  expect(expirationInfo)
 });
});