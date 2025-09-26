import FormatCurrency from './formatCurrency'

describe('FormatCurrency', () => {
  describe('Formatação básica', () => {
    it('deve formatar valores numéricos corretamente', () => {
      expect(FormatCurrency('1000')).toBe('10,00')
      expect(FormatCurrency('12345')).toBe('123,45')
      expect(FormatCurrency('100')).toBe('1,00')
    })

    it('deve formatar valores grandes corretamente', () => {
      expect(FormatCurrency('100000')).toBe('1.000,00')
      expect(FormatCurrency('1234567')).toBe('12.345,67')
      expect(FormatCurrency('999999999')).toBe('9.999.999,99')
    })

    it('deve formatar valores pequenos corretamente', () => {
      expect(FormatCurrency('1')).toBe('0,01')
      expect(FormatCurrency('10')).toBe('0,10')
      expect(FormatCurrency('99')).toBe('0,99')
    })
  })

  describe('Tratamento de casos especiais', () => {
    it('deve retornar string vazia para entrada vazia', () => {
      expect(FormatCurrency('')).toBe('')
    })

    it('deve remover caracteres não numéricos', () => {
      expect(FormatCurrency('R$ 1.000,00')).toBe('1.000,00')
      expect(FormatCurrency('abc123def')).toBe('1,23')
      expect(FormatCurrency('1.2.3.4.5')).toBe('123,45')
    })

    it('deve tratar strings com apenas caracteres não numéricos', () => {
      expect(FormatCurrency('abc')).toBe('')
      expect(FormatCurrency('R$')).toBe('')
      expect(FormatCurrency('.,/-')).toBe('')
    })

    it('deve tratar zero corretamente', () => {
      expect(FormatCurrency('0')).toBe('0,00')
      expect(FormatCurrency('00')).toBe('0,00')
      expect(FormatCurrency('000')).toBe('0,00')
    })
  })

  describe('Casos extremos', () => {
    it('deve tratar valores muito grandes', () => {
      expect(FormatCurrency('99999999999')).toBe('999.999.999,99')
    })

    it('deve tratar espaços e caracteres especiais', () => {
      expect(FormatCurrency(' 1 2 3 4 ')).toBe('12,34')
      expect(FormatCurrency('1@2#3$4%')).toBe('12,34')
    })
  })
})