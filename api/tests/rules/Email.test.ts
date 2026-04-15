import { Email } from "../../src/domain/value-objects/Email";

describe("Email Entity", () => {
  it("Deve lançar criar um email valido", () => {
    const email = new Email("  brecailo@gmail.com  ");
    expect(email.getValue()).toBe("brecailo@gmail.com");
  });

  it("Deve lançar um erro de email invalido ", () => {
    expect(() => {
      new Email("brecailo9ail.com");
    }).toThrow("Email inválido");
  });
  it("Deve lançar um erro de email invalido se tiver espaço", () => {
    expect(() => {
      new Email("brec ailo3@ail.com");
    }).toThrow("Email inválido");
  });
  it("Deve lançar um erro de email invalido se nao tiver o .", () => {
    expect(() => {
      new Email("brecailo3@gmailcom");
    }).toThrow("Email inválido");
  });
  it("Deve lançar um erro de email invalido se nao tiver o @", () => {
    expect(() => {
      new Email("brecailo3gmail.com");
    }).toThrow("Email inválido");
  });
  it("Deve lançar um erro de email invalido se tiver um . no lugar do @", () => {
    expect(() => {
      new Email("brecailo3.gmail.com");
    }).toThrow("Email inválido");
  });
  it("Deve lançar um erro de deve preecher o email", () => {
    expect(() => {
      new Email("");
    }).toThrow("Email inválido");
  });
});
