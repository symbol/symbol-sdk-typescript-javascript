import {Rent} from '@/core/services/fees/Rent.ts'
import {networkConfig} from '@/config'
import {NetworkCurrency} from '@/core/model'
const {defaultDynamicFeeMultiplier} = networkConfig

const mockNetworkMosaic: NetworkCurrency = {
  hex: 'thisIsAHex',
  divisibility: 6,
  ticker: 'XEM',
  name: 'nem.xem',
}

describe('getCostFromDurationInBlock', () => {
  it('should return correct values', () => {
    const rent = Rent.getFromDurationInBlocks(10000, mockNetworkMosaic)
    expect(rent).toBeInstanceOf(Rent)
    expect(rent.absolute).toBe(10000 * defaultDynamicFeeMultiplier)
    expect(rent.relativeWithTicker).toBe('10 XEM')
    expect(rent.relative).toBe(10000 * defaultDynamicFeeMultiplier / Math.pow(10, 6))
  })
})