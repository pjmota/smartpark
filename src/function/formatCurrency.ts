const FormatCurrency = (value: string) => {
  // Remove tudo que não for número
  const numericValue = value.replace(/\D/g, '');

  if (!numericValue) return '';

  // Transforma em número para formatar
  const number = parseFloat(numericValue) / 100;

  // Formata com pontos e vírgula, sem R$
  return number.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export default FormatCurrency