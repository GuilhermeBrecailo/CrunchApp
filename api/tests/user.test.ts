import { User } from "../src/domain/entities/User";

describe("User Entity", () => {
  it("Deve criar um usuario valido", () => {
    const user = new User({
      id: "1",
      name: "Guilherme Brecailo",
      email: "brecailo3@gmail.com",
    });

    expect(user.getId()).toBe("1");
    expect(user.getName()).toBe("Guilherme Brecailo");
    expect(user.getEmail()).toBe("brecailo3@gmail.com");
  });
  it("Deve lancar um erro se id estiver vazio", () => {
    expect(() => {
      new User({
        id: "",
        name: "Guilherme Brecailo",
        email: "brecailo3@gmail.com",
      });
    }).toThrow("Id não é valido");
  });
  it("Deve lancar um erro se name estiver vazio", () => {
    expect(() => {
      new User({
        id: "1",
        name: "",
        email: "brecailo3@gmail.com",
      });
    }).toThrow("Nome é obrigatorio");
  });
  it("Deve lancar um erro se email estiver vazio", () => {
    expect(() => {
      new User({
        id: "1",
        name: "Guilherme Brecailo",
        email: "",
      });
    }).toThrow("Email é obrigatorio");
  });
});
