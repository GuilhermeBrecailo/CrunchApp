import { DomainError } from "./utils/DomainError";

export class Document {
  public readonly documento: string;

  constructor(value: string) {
    this.documento = this.validateDocument(value);
  }

  private validateDocument(value: string): string {
    if (!value?.trim()) throw new DomainError("Documento não é válido");

    // Remove tudo que não for dígito
    const documentFormatted = value.replace(/\D/g, "");

    if (!/^\d+$/.test(documentFormatted)) {
      throw new DomainError("Documento contém caracteres inválidos");
    }

    if (documentFormatted.length === 11) {
      // CPF
      const cpf = documentFormatted;
      if (/^(\d)\1{10}$/.test(cpf)) throw new DomainError("CPF inválido"); // todos os dígitos iguais

      let sum = 0;
      for (let i = 0; i < 9; i++) sum += parseInt(cpf[i]) * (10 - i);
      let check = (sum * 10) % 11;
      if (check === 10) check = 0;
      if (check !== parseInt(cpf[9])) throw new DomainError("CPF inválido");

      sum = 0;
      for (let i = 0; i < 10; i++) sum += parseInt(cpf[i]) * (11 - i);
      check = (sum * 10) % 11;
      if (check === 10) check = 0;
      if (check !== parseInt(cpf[10])) throw new DomainError("CPF inválido");
    } else if (documentFormatted.length === 14) {
      const cnpj = documentFormatted;
      if (/^(\d)\1{13}$/.test(cnpj)) throw new DomainError("CNPJ inválido"); // todos os dígitos iguais

      const calcCheckDigit = (base: string, weights: number[]) => {
        let sum = 0;
        for (let i = 0; i < weights.length; i++) {
          sum += parseInt(base[i]) * weights[i];
        }
        const remainder = sum % 11;
        return remainder < 2 ? 0 : 11 - remainder;
      };

      const firstWeights = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
      const secondWeights = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

      const firstDigit = calcCheckDigit(cnpj.substring(0, 12), firstWeights);
      const secondDigit = calcCheckDigit(
        cnpj.substring(0, 12) + firstDigit,
        secondWeights,
      );

      if (
        parseInt(cnpj[12]) !== firstDigit ||
        parseInt(cnpj[13]) !== secondDigit
      ) {
        throw new DomainError("CNPJ inválido");
      }
    } else {
      throw new DomainError("Documento deve conter 11 ou 14 dígitos");
    }

    return documentFormatted;
  }
}
