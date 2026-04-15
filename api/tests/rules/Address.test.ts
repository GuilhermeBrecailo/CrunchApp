import { Address } from "../../src/domain/value-objects/Address";

describe("Address Entity", () => {
  it("Deve criar um Address válido", () => {
    const address = new Address({
      city: "Apucarana",
      localZipCode: "86812-210",
      number: "500",
      road: "Rua das Palmeiras",
      state: "PR",
      description: "teste",
    });

    expect(address.getCity()).toBe("Apucarana");
    expect(address.getLocalZipCode()).toBe("86812210");
    expect(address.getNumber()).toBe("500");
    expect(address.getRoad()).toBe("Rua das Palmeiras");
    expect(address.getState()).toBe("PR");
    expect(address.getDescription()).toBe("teste");
  });

  it("Deve criar um Address válido e depois modificá-lo", () => {
    const address = new Address({
      city: "Apucarana",
      localZipCode: "86812-210",
      number: "100",
      road: "Rua das Palmeiras",
      state: "PR",
    });

    address.setCity("Londrina");
    expect(address.getCity()).toBe("Londrina");

    address.setLocalZipCode("85812-210");
    expect(address.getLocalZipCode()).toBe("85812210");

    address.setNumber("300");
    expect(address.getNumber()).toBe("300");

    address.setRoad("Rua das Acácias");
    expect(address.getRoad()).toBe("Rua das Acácias");

    address.setState("RJ");
    expect(address.getState()).toBe("RJ");

    address.setDescription("Nova descrição");
    expect(address.getDescription()).toBe("Nova descrição");
  });

  it("Deve lançar erro se city não existir", () => {
    expect(() => {
      new Address({
        city: "",
        localZipCode: "86812-210",
        road: "Rua Teste",
        number: "100",

        state: "PR",
      });
    }).toThrow("Cidade não é válida");
  });

  it("Deve lançar erro se localZipCode não existir", () => {
    expect(() => {
      new Address({
        city: "Apucarana",
        localZipCode: "",
        road: "Rua Teste",
        number: "100",

        state: "PR",
      });
    }).toThrow("Cep da empresa não é válido");
  });

  it("Deve lançar erro se localZipCode for 00000-000", () => {
    expect(() => {
      new Address({
        city: "Apucarana",
        localZipCode: "00000-000",
        number: "100",
        road: "Rua Teste",
        state: "PR",
      });
    }).toThrow("Cep da empresa não pode ser 00000-000");
  });

  it("Deve lançar erro se road não existir", () => {
    expect(() => {
      new Address({
        city: "Apucarana",
        localZipCode: "86812-210",
        road: "",
        number: "100",

        state: "PR",
      });
    }).toThrow("Rua não é válida");
  });

  it("Deve lançar erro se state não existir", () => {
    expect(() => {
      new Address({
        city: "Apucarana",
        localZipCode: "86812-210",
        road: "Rua Teste",
        state: "",
        number: "100",
      });
    }).toThrow("Estado não é válido");
  });

  it("Deve lançar erro se state não for um estado válido", () => {
    expect(() => {
      new Address({
        city: "Apucarana",
        number: "100",

        localZipCode: "86812-210",
        road: "Rua Teste",
        state: "YT",
      });
    }).toThrow("Estado não existe");
  });

  it("Deve lançar erro ao tentar modificar number para inválido", () => {
    const address = new Address({
      city: "Apucarana",
      localZipCode: "86812-210",
      number: "100",
      road: "Rua Teste",
      state: "PR",
    });

    expect(() => {
      address.setNumber("");
    }).toThrow("Número não é válido");
  });

  it("Deve lançar erro ao tentar modificar complement para inválido", () => {
    const address = new Address({
      city: "Apucarana",
      localZipCode: "86812-210",
      number: "100",
      road: "Rua Teste",
      state: "PR",
    });

    expect(() => {
      address.setComplement("");
    }).toThrow("Complemento não é válido");
  });
});
