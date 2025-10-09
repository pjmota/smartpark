import FormatCurrency from './formatCurrency'

describe('FormatCurrency', () => {
  describe('Basic formatting', () => {
    it('should format numeric values correctly', () => {
      expect(FormatCurrency('1000')).toBe('10,00')
      expect(FormatCurrency('12345')).toBe('123,45')
      expect(FormatCurrency('100')).toBe('1,00')
    })

    it('should format large values correctly', () => {
      expect(FormatCurrency('100000')).toBe('1.000,00')
      expect(FormatCurrency('1234567')).toBe('12.345,67')
      expect(FormatCurrency('999999999')).toBe('9.999.999,99')
    })

    it('should format small values correctly', () => {
      expect(FormatCurrency('1')).toBe('0,01')
      expect(FormatCurrency('10')).toBe('0,10')
      expect(FormatCurrency('99')).toBe('0,99')
    })
  })

  describe('Special cases handling', () => {
    it('should return empty string for empty input', () => {
      expect(FormatCurrency('')).toBe('')
    })

    it('should remove non-numeric characters', () => {
      expect(FormatCurrency('R$ 1.000,00')).toBe('1.000,00')
      expect(FormatCurrency('abc123def')).toBe('1,23')
      expect(FormatCurrency('1.2.3.4.5')).toBe('123,45')
    })

    it('should handle strings with only non-numeric characters', () => {
      expect(FormatCurrency('abc')).toBe('')
      expect(FormatCurrency('R$')).toBe('')
      expect(FormatCurrency('.,/-')).toBe('')
    })

    it('should handle zero correctly', () => {
      expect(FormatCurrency('0')).toBe('0,00')
      expect(FormatCurrency('00')).toBe('0,00')
      expect(FormatCurrency('000')).toBe('0,00')
    })
  })

  describe('Edge cases', () => {
    it('should handle very large values', () => {
      expect(FormatCurrency('99999999999')).toBe('999.999.999,99')
    })

    it('should handle spaces and special characters', () => {
      expect(FormatCurrency(' 1 2 3 4 ')).toBe('12,34')
      expect(FormatCurrency('1@2#3$4%')).toBe('12,34')
    })
  })
})