import {renderMosaicNames} from '@/core/utils/mosaics.ts'
import {MosaicId} from 'nem2-sdk';
import {mockNetworkCurrency} from '@MOCKS/index';

const mockMosaics = [
 {
   "id": new MosaicId([2600585410, 557977951]),
   "amount": {
     "lower": 2000,
     "higher": 0
   },
 },
 {
   "id": new MosaicId([557850352, 1974403924]),
   "amount": {
     "lower": 1000000,
     "higher": 0
   }
 }
]

const mockAppMosaics = {
 "75AF035421401EF0": {
   "hex": "75AF035421401EF0",
   "balance": 21554.220108,
   "expirationHeight": "Forever",
   "name": "nem.xem",
   "namespaceHex": "D525AD41D95FCF29",
   "properties": 'mockProperties',
 },
 "2142115F9B01C8C2": {
   "hex": "2142115F9B01C8C2",
   "balance": 299715.001,
   "expirationHeight": "Forever",
   "name": "decentraliser.shark.sats",
   "namespaceHex": "C0641063CAED1F96",
   "properties": 'mockProperties',
 },
}

describe('renderMosaicNames', () => {
  it('should sort names with nem.xem in first position', () => {
   const mockStore = {
    state: {
     account: {
      mosaics: mockAppMosaics,
      networkCurrency: mockNetworkCurrency,
     }
    }
   }
   // @ts-ignore
   const mosaicNames = renderMosaicNames(mockMosaics, mockStore)
   expect(mosaicNames).toBe("nem.xem, decentraliser.shark.sats")
  })

  it('should return N/A when the mosaic is not found in the mosaic list', () => {
   const mockStore = {
    state: {
     account: {
      mosaics: {},
      networkCurrency: mockNetworkCurrency,
     }
    }
   }
   // @ts-ignore
   const mosaicNames = renderMosaicNames(mockMosaics, mockStore)
   expect(mosaicNames).toBe("N/A")
  })

  it('should return N/A when no mosaic are provided', () => {
   const mockStore = {
    state: {
     account: {
      mosaics: mockAppMosaics,
      networkCurrency: mockNetworkCurrency,
     }
    }
   }
   // @ts-ignore
   const mosaicNames = renderMosaicNames([], mockStore)
   expect(mosaicNames).toBe("N/A")
  })
})

