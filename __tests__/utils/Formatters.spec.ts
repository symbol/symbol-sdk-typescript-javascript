import { Formatters } from '@/core/utils/Formatters'

describe('splitArrayByDelimiter', () => {
  test('should throw a error when pass in Array, one of its element is not an string ', () => {
    const testArr = ['1', {}]
    expect(() => Formatters.splitArrayByDelimiter(testArr as Array<string>)).toThrow()
  })
  test('should return a string when pass in Array without delimiter', () => {
    const testArr = ['1', '2']
    expect(Formatters.splitArrayByDelimiter(testArr)).toBe(testArr.join(' '))
  })
  test('should return a string which is joined the delimiter when pass in Array with a delimiter', () => {
    const testArr = ['1', '2']
    expect(Formatters.splitArrayByDelimiter(testArr, '?')).toBe(testArr.join('?'))
  })
})
