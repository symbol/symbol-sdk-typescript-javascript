import {Mosaic, MosaicId, UInt64} from 'symbol-sdk'
import {MosaicInputsManager} from '@/views/forms/FormTransferTransaction/MosaicInputsManager.ts'

export const mockMosaic1 = new Mosaic(
  new MosaicId('619CE7E50DB644DE'),
  UInt64.fromUint(1),
)

export const mockMosaic2 = new Mosaic(
  new MosaicId('28A59CC8B0C9E4DD'),
  UInt64.fromUint(1),
)

export const mockMosaic3 = new Mosaic(
  new MosaicId('2D58F9BF5F8C014D'),
  UInt64.fromUint(1),
)

const mockMosaics = [ mockMosaic1, mockMosaic2, mockMosaic3 ]
const mockMosaicHexIds = mockMosaics.map(({id}) => id.toHex())

describe('components/MosaicInputManager', () => {
  describe('initialize() should', () => {
    test('return an instantiated object', () => {
      expect(MosaicInputsManager.initialize(mockMosaics)).toBeInstanceOf(MosaicInputsManager)
    })
  })

  describe('hasFreeSlots() should', () => {
    test('return true after initialization with mosaics provided', () => {
      const mosaicInputsManager = MosaicInputsManager.initialize(mockMosaics)
      expect(mosaicInputsManager.hasFreeSlots()).toBeTruthy()
    })

    test('return false after initialization with empty array', () => {
      const mosaicInputsManager = MosaicInputsManager.initialize([])
      expect(mosaicInputsManager.hasFreeSlots()).toBeFalsy()
    })
  })

  describe('setSlot() should', () => {
    test('throw if a an unknown id is provided', () => {
      const mosaicInputsManager = MosaicInputsManager.initialize([])
      expect(() => mosaicInputsManager.setSlot('wrongHexId', 1)).toThrowError()
    })

    test('throw if a mosaic is already affected to the slot', () => {
      const mosaicInputsManager = MosaicInputsManager.initialize(mockMosaics)
      mosaicInputsManager.setSlot(mockMosaicHexIds[1], 2)
      expect(() => mosaicInputsManager.setSlot(mockMosaicHexIds[1], 1)).toThrowError()
    })
  })

  describe('getMosaicsBySlot() should', () => {
    test('return all mosaics after initialization with mosaics provided, for any slot', () => {
      const mosaicInputsManager = MosaicInputsManager.initialize(mockMosaics)
      expect(mosaicInputsManager.getMosaicsBySlot(0)).toStrictEqual(mockMosaicHexIds)
      expect(mosaicInputsManager.getMosaicsBySlot(1)).toStrictEqual(mockMosaicHexIds)
      expect(mosaicInputsManager.getMosaicsBySlot(2)).toStrictEqual(mockMosaicHexIds)
    })

    test('return an empty array after after initialization with empty array, for any slot', () => {
      const mosaicInputsManager = MosaicInputsManager.initialize([])
      expect(mosaicInputsManager.getMosaicsBySlot(0)).toStrictEqual([])
      expect(mosaicInputsManager.getMosaicsBySlot(1)).toStrictEqual([])
      expect(mosaicInputsManager.getMosaicsBySlot(2)).toStrictEqual([])
    })

    describe('contain expected mosaics after affectations', () => {
      const mosaicInputsManager = MosaicInputsManager.initialize(mockMosaics)
      mosaicInputsManager.setSlot(mockMosaicHexIds[1], 2)

      const slot1Mosaics = mosaicInputsManager.getMosaicsBySlot(1)
      const slot2Mosaics = mosaicInputsManager.getMosaicsBySlot(2)

      expect(slot1Mosaics).toStrictEqual([ mockMosaicHexIds[0], mockMosaicHexIds[2] ])
      expect(slot2Mosaics).toStrictEqual([ mockMosaicHexIds[1], mockMosaicHexIds[0], mockMosaicHexIds[2] ])

      mosaicInputsManager.unsetSlot(2)
      mosaicInputsManager.setSlot(mockMosaicHexIds[1], 1)
      const slot1Mosaics2 = mosaicInputsManager.getMosaicsBySlot(1)
      const slot2Mosaics2 = mosaicInputsManager.getMosaicsBySlot(2)

      expect(slot1Mosaics2).toStrictEqual([ mockMosaicHexIds[1], mockMosaicHexIds[0], mockMosaicHexIds[2] ])
      expect(slot2Mosaics2).toStrictEqual([ mockMosaicHexIds[0], mockMosaicHexIds[2] ])
    })
  })
})
