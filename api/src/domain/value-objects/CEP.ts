import { DomainError } from "./utils/DomainError";

export class CEP {
  public readonly cepInitial: string;
  public readonly cepFinal: string;

  constructor(props: { cepInitial: string; cepFinal: string }) {
    if (props.cepInitial === props.cepFinal) {
      throw new DomainError("Cep inicial não pode ser igual ao cep final");
    }
    this.cepInitial = this.validadeCep(props.cepInitial, "Cep inicial");
    this.cepFinal = this.validadeCep(props.cepFinal, "Cep final");
  }

  private validadeCep(cep: string, text: string): string {
    const cepFormat = cep?.replace(/[^a-zA-Z0-9]/g, "").trim();
    if (!cepFormat) {
      throw new DomainError(`${text} não é válido`);
    }
    if (cepFormat === "00000000") {
      throw new DomainError(
        `O valor de ${text} não pode ser igual a 00000-000`,
      );
    }
    if (/[a-zA-Z]/.test(cepFormat)) {
      throw new DomainError(`O ${text} precisa conter apenas números`);
    }
    if (!/^.{8}$/.test(cepFormat)) {
      throw new DomainError(`O ${text} deve conter exatamente 8 caracteres`);
    }
    return cepFormat;
  }
}
