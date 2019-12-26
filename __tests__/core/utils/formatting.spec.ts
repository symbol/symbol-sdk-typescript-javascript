import * as formatting from '@/core/utils/formatting.ts'
import {mockNetworkCurrency} from '@MOCKS/index'

describe('formatNumber', () => {
    it('1 should be formatted as 1 with formatNumber function', () => {
        expect(formatting.formatNumber(1)).toBe('1')
    })

    it('123456.789 should be formatted as 123,456.789 with formatNumber function', () => {
        expect(formatting.formatNumber(123456.789)).toBe('123,456.789')
    })

    it('123456 should be formatted as 123,456 with formatNumber function', () => {
        expect(formatting.formatNumber(123456)).toBe('123,456')
    })

    it('0.123456 should be formatted as 0.123456 with formatNumber function', () => {
        expect(formatting.formatNumber(0.123456)).toBe('0.123456')
    })

    describe('absoluteAmountToRelativeAmountWithTicker', () => {
        it('should return a proper string', () => {
            const string = formatting.absoluteAmountToRelativeAmountWithTicker(1888884123456, mockNetworkCurrency)
            expect(string).toBe('1,888,884.123456 XEM')
        })
    })
})
