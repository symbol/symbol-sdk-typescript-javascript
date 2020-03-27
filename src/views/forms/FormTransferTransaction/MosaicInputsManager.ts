// internal dependencies
import Vue from 'vue'
import {Mosaic} from 'symbol-sdk'

export class MosaicInputsManager {
  /**
   * Maps mosaic hex ids to slots (input indexes)
   * @private
   */
  private mosaicMap: Record<string, number | null> = {}

  /**
   * Initialize a new instance of MosaicInputsManager
   * @static
   * @param {Mosaic[]} mosaics
   * @param {MosaicService} mosaicService
   * @returns {MosaicInputsManager}
   */
  public static initialize(mosaics: Mosaic[]): MosaicInputsManager {
    return new MosaicInputsManager(mosaics || [])
  }

  /**
   * Creates an instance of MosaicInputsManager.
   * @param {Mosaic[]} mosaics
   */
  private constructor(mosaics: Mosaic[]) {
    // Set mosaicMap with null values
    mosaics.forEach(({id}) => Vue.set(this.mosaicMap, id.toHex(), null))
  }

  /**
   * Add mosaics to the manager after initialization
   * @param {Mosaic[]} mosaics
   */
  public addMosaics(mosaics: Mosaic[]): void {
    mosaics.forEach(({id}) => {
      // skip if the mosaic is known
      if (this.mosaicMap[id.toHex()]) return 
      // add the mosaic
      Vue.set(this.mosaicMap, id.toHex(), null)
    })
  }

  /**
   * Whether the mosaicMap has a free slot
   * If yes, a new mosaic input can be created
   * @returns {boolean}
   */
  public hasFreeSlots(): boolean {
    return Object.values(this.mosaicMap).find(values => values === null) !== undefined
  }

  /**
   * Allocates a mosaic hex to a slot
   * @param {string} hexId
   * @param {number} index
   */
  public setSlot(hexId: string, index: number): void {
    // get the slot
    const slot = this.mosaicMap[hexId]

    // throw if a slot does not exist for the provided mosaic id
    if (slot === undefined) {
      throw new Error(`${hexId} does not exist in ${JSON.stringify(this.mosaicMap)}`)
    }

    // throw if the slot is already allocated to another input
    if (slot !== null && slot !== index) {
      throw new Error(`${hexId} is already allocated to input ${slot}`)
    }

    // unset the current slot allocation
    this.unsetSlot(index)

    // allocate the entry
    Vue.set(this.mosaicMap, hexId, index)
  }

  /**
   * Set a slot to null
   * @param {number} index
   */
  public unsetSlot(index: number): void {
    // get the slot entry
    const entry = this.getEntryBySlot(index)

    // ignore if the slot had no allocated entry
    if (entry === undefined) return

    // unset the entry slot allocation
    const [hexId] = entry
    Vue.set(this.mosaicMap, hexId, null)
  }

  /**
   * Returns mosaics that can be used by a slot
   * @param {number} index
   * @returns {string[]}
   */
  public getMosaicsBySlot(index: number): string[] {
    // get allocated mosaic
    const allocatedEntry = this.getEntryBySlot(index)

    // get non-allocated entries
    const nonAllocatedEntries = Object.entries(this.mosaicMap)
      .filter(([ , slot ]) => slot === null)
      .map(([hex]) => hex)

    return allocatedEntry
      ? [ allocatedEntry[0], ...nonAllocatedEntries ]
      : nonAllocatedEntries
  }

  /**
   * Returns an entry given a slot number
   * @private
   * @param {number} index
   * @returns {([string, number] | undefined)}
   */
  private getEntryBySlot(index: number): [string, number] | undefined {
    return Object.entries(this.mosaicMap).find(([ , slot ]) => slot == index)
  }
}
