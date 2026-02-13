import { DomainError } from "../value-objects/utils/DomainError";

export class User {
  private id: string | undefined = undefined;
  private name: string = "";
  private email: string = "";
  private crunch?: string;

  private createdAt?: Date = new Date();

  constructor(props: UserDto) {
    if (!props.id?.trim()) {
      throw new DomainError("Id não é valido");
    }

    if (props.id) this.id = props.id;

    this.createdAt = props.createdAt;
    this.setName(props.name);
    this.setEmail(props.email);
  }

  public getId(): string {
    if (!this.id?.trim()) {
      throw new DomainError(
        "Esse id ainda não foi definido para nenhum contratante",
      );
    }
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getEmail(): string {
    return this.email;
  }

  public getCrunch(): string | undefined {
    return this.crunch;
  }

  public getCreatedAt(): Date | undefined {
    return this.createdAt;
  }

  public setName(name: string): void {
    if (!name?.trim()) {
      throw new DomainError("Nome é obrigatorio");
    }
    this.name = name;
  }

  public setEmail(email: string): void {
    if (!email?.trim()) {
      throw new DomainError("Email é obrigatorio");
    }
    this.email = email;
  }

  public setCrunch(crunch: string | undefined) {
    if (!crunch?.trim()) {
      throw new DomainError("Igreja é obrigatorio");
    }
    this.crunch = crunch;
  }
}

export interface UserDto {
  id: string;
  name: string;
  email: string;
  createdAt?: Date;
  Crunch?: string;
}
