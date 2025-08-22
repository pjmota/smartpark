const FormatCurrency = (value: string) => {
  const numericValue = value.replace(/\D/g, '');

  if (!numericValue) return '';

  const number = parseFloat(numericValue) / 100;

  return number.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export default FormatCurrency