import { CEP } from "../../src/domain/value-objects/CEP";

describe("CEP Entity", () => {
  it("Deve criar um CEP válido", () => {
    const cep = new CEP({
      cepInitial: "86812-210",
      cepFinal: "86812-630",
    });

    expect(cep.cepInitial).toBe("86812210");
    expect(cep.cepFinal).toBe("86812630");

    const CEPSecond = new CEP({
      cepInitial: "86812210",
      cepFinal: "86812630",
    });

    expect(CEPSecond.cepInitial).toBe("86812210");
    expect(CEPSecond.cepFinal).toBe("86812630");
  });
  it("Deve lançar um erro se o cep inicial for igual ao cep final", () => {
    expect(() => {
      new CEP({
        cepInitial: "86812-210",
        cepFinal: "86812-210",
      });
    }).toThrow("Cep inicial não pode ser igual ao cep final");
  });
  it("Deve lançar um erro se o cep inicial não existir", () => {
    expect(() => {
      new CEP({
        cepInitial: null as unknown as string,
        cepFinal: "86812-210",
      });
    }).toThrow("Cep inicial não é válido");
  });
  it("Deve lançar um erro se o cep inicial for igual a 00000-000", () => {
    expect(() => {
      new CEP({
        cepInitial: "00000-000",
        cepFinal: "86812-210",
      });
    }).toThrow("O valor de Cep inicial não pode ser igual a 00000-000");
  });
  it("Deve lançar um erro se o cep inicial não conter apenas números", () => {
    expect(() => {
      new CEP({
        cepInitial: "86812l65",
        cepFinal: "86812-210",
      });
    }).toThrow("O Cep inicial precisa conter apenas números");
  });
  it("Deve lançar um erro se o cep inicial não conter exatamente 8 caracteres", () => {
    expect(() => {
      new CEP({
        cepInitial: "86812-2100",
        cepFinal: "86812-210",
      });
    }).toThrow("O Cep inicial deve conter exatamente 8 caracteres");

    expect(() => {
      new CEP({
        cepInitial: "86812-21",
        cepFinal: "86812-210",
      });
    }).toThrow("O Cep inicial deve conter exatamente 8 caracteres");
  });
  it("Deve lançar um erro se o cep final não existir", () => {
    expect(() => {
      new CEP({
        cepInitial: "86812-210",
        cepFinal: null as unknown as string,
      });
    }).toThrow("Cep final não é válido");
  });
  it("Deve lançar um erro se o cep final for igual a 00000-000", () => {
    expect(() => {
      new CEP({
        cepInitial: "86812-210",
        cepFinal: "00000-000",
      });
    }).toThrow("O valor de Cep final não pode ser igual a 00000-000");
  });
  it("Deve lançar um erro se o cep final não conter apenas números", () => {
    expect(() => {
      new CEP({
        cepInitial: "86812-210",
        cepFinal: "86812l21",
      });
    }).toThrow("O Cep final precisa conter apenas números");
  });
  it("Deve lançar um erro se o cep final não conter exatamente 8 caracteres", () => {
    expect(() => {
      new CEP({
        cepInitial: "86812-210",
        cepFinal: "86812-2106",
      });
    }).toThrow("O Cep final deve conter exatamente 8 caracteres");

    expect(() => {
      new CEP({
        cepInitial: "86812-210",
        cepFinal: "86812-21",
      });
    }).toThrow("O Cep final deve conter exatamente 8 caracteres");
  });
});
