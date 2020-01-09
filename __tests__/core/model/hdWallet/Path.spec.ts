import {Path} from '@/core/model/hdWallet/Path.ts'

describe('getPath', () => {
  it('should return a correct value', () => {
    expect(Path.getFromSeedIndex(0)).toBe(`m/44'/43'/0'/0'/0'`)
    expect(Path.getFromSeedIndex(1)).toBe(`m/44'/43'/1'/0'/0'`)
    expect(Path.getFromSeedIndex(2)).toBe(`m/44'/43'/2'/0'/0'`)
    expect(Path.getFromSeedIndex(3)).toBe(`m/44'/43'/3'/0'/0'`)
    expect(Path.getFromSeedIndex(4)).toBe(`m/44'/43'/4'/0'/0'`)
    expect(Path.getFromSeedIndex(5)).toBe(`m/44'/43'/5'/0'/0'`)
    expect(Path.getFromSeedIndex(6)).toBe(`m/44'/43'/6'/0'/0'`)
    expect(Path.getFromSeedIndex(7)).toBe(`m/44'/43'/7'/0'/0'`)
    expect(Path.getFromSeedIndex(8)).toBe(`m/44'/43'/8'/0'/0'`)
    expect(Path.getFromSeedIndex(9)).toBe(`m/44'/43'/9'/0'/0'`)
  })

  it('should throw when incorrect params are provided', () => {
    expect(() => {Path.getFromSeedIndex(-1)}).toThrow();
    expect(() => {Path.getFromSeedIndex(10)}).toThrow();
    expect(() => {Path.getFromSeedIndex(null)}).toThrow();
    expect(() => {Path.getFromSeedIndex(undefined)}).toThrow();
  })
})

describe('getRemoteAccountPath', () => {
  it('should return a correct value', () => {
    expect(Path.getRemoteAccountPath(`m/44'/43'/0'/0'/0'`, 1)).toBe(`m/44'/43'/0'/1'/0'`)
    expect(Path.getRemoteAccountPath(`m/44'/43'/1'/0'/0'`, 1)).toBe(`m/44'/43'/1'/1'/0'`)
    expect(Path.getRemoteAccountPath(`m/44'/43'/2'/0'/0'`, 1)).toBe(`m/44'/43'/2'/1'/0'`)
    expect(Path.getRemoteAccountPath(`m/44'/43'/3'/0'/0'`, 1)).toBe(`m/44'/43'/3'/1'/0'`)
    expect(Path.getRemoteAccountPath(`m/44'/43'/4'/0'/0'`, 1)).toBe(`m/44'/43'/4'/1'/0'`)
    expect(Path.getRemoteAccountPath(`m/44'/43'/5'/0'/0'`, 1)).toBe(`m/44'/43'/5'/1'/0'`)
    expect(Path.getRemoteAccountPath(`m/44'/43'/6'/0'/0'`, 1)).toBe(`m/44'/43'/6'/1'/0'`)
    expect(Path.getRemoteAccountPath(`m/44'/43'/7'/0'/0'`, 1)).toBe(`m/44'/43'/7'/1'/0'`)
    expect(Path.getRemoteAccountPath(`m/44'/43'/8'/0'/0'`, 1)).toBe(`m/44'/43'/8'/1'/0'`)
    expect(Path.getRemoteAccountPath(`m/44'/43'/9'/0'/0'`, 1)).toBe(`m/44'/43'/9'/1'/0'`)
    expect(Path.getRemoteAccountPath(`m/44'/43'/9'/0'/0'`, 2)).toBe(`m/44'/43'/9'/2'/0'`)
    expect(Path.getRemoteAccountPath(`m/44'/43'/9'/0'/0'`, 3)).toBe(`m/44'/43'/9'/3'/0'`)
    expect(Path.getRemoteAccountPath(`m/44'/43'/9'/0'/0'`, 4)).toBe(`m/44'/43'/9'/4'/0'`)
    expect(Path.getRemoteAccountPath(`m/44'/43'/9'/0'/0'`, 5)).toBe(`m/44'/43'/9'/5'/0'`)
    expect(Path.getRemoteAccountPath(`m/44'/43'/9'/0'/0'`, 6)).toBe(`m/44'/43'/9'/6'/0'`)
    expect(Path.getRemoteAccountPath(`m/44'/43'/9'/0'/0'`, 7)).toBe(`m/44'/43'/9'/7'/0'`)
    expect(Path.getRemoteAccountPath(`m/44'/43'/9'/0'/0'`, 8)).toBe(`m/44'/43'/9'/8'/0'`)
    expect(Path.getRemoteAccountPath(`m/44'/43'/9'/0'/0'`, 9)).toBe(`m/44'/43'/9'/9'/0'`)
    expect(Path.getRemoteAccountPath(`m/44'/43'/9'/0'/0'`, 10)).toBe(`m/44'/43'/9'/10'/0'`)
  })

  it('should throw when incorrect params are provided', () => {
    expect(() => {Path.getRemoteAccountPath(`m/44'/43'/9'/0'/0'`, 0)}).toThrow();
    expect(() => {Path.getRemoteAccountPath(`m/44'/43'/9'/0'/0'`, 11)}).toThrow();
    expect(() => {Path.getRemoteAccountPath('', null)}).toThrow();
    expect(() => {Path.getRemoteAccountPath('', undefined)}).toThrow();
  })
})
