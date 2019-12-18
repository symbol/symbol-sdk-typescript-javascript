import {networkConfig} from '@/config'
import {absoluteAmountToRelativeAmountWithTicker} from '@/core/utils'
import {NetworkCurrency} from '@/core/model'
import {getRelativeMosaicAmount} from '@/core/utils'

const {defaultDynamicFeeMultiplier} = networkConfig

export class Rent {
  private constructor(
    public absolute: number,
    public relative: number,
    public relativeWithTicker: string,
  ) {}

  public static getFromDurationInBlocks(
      duration: number,
      networkCurrency: NetworkCurrency,
    ) {
    const absoluteCost = this.getAbsoluteCostFromDuration(duration)
    const relative = getRelativeMosaicAmount(absoluteCost, networkCurrency.divisibility)
    const relativeWithTicker = absoluteAmountToRelativeAmountWithTicker(absoluteCost, networkCurrency)

    return new Rent(absoluteCost, relative, relativeWithTicker)
  }

  private static getAbsoluteCostFromDuration = (duration: number): number => {
    return duration * defaultDynamicFeeMultiplier
  }
}