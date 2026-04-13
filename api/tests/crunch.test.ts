import { Crunch, CrunchDTO } from "../src/domain/entities/Crunch";
import { ZodError } from "zod";

const makeValidCrunchProps = (): CrunchDTO => ({
  id: "any_id",
  name: "Igreja Central",
  slug: "igreja-central",
  isActive: true,
  createdAt: new Date(),
  users: [],
  departaments: ["Jovens", "Música"],
});

describe("Crunch (Church) Entity - Casos atualizados com Zod e DDD", () => {
  describe("Success Cases", () => {
    it("should create a new instance with valid data using create factory", () => {
      const props = makeValidCrunchProps();
      const sut = Crunch.create(props);

      expect(sut.id).toBe(props.id);
      expect(sut.name).toBe(props.name);
      expect(sut.isActive).toBe(true);
      expect(sut.departaments).toContain("Jovens");
      expect(sut.createdAt).toBeInstanceOf(Date);
    });

    it("should allow updating the name and slug via native setters", () => {
      const sut = Crunch.create(makeValidCrunchProps());

      sut.name = "Novo Nome";
      sut.slug = "novo-slug";

      expect(sut.name).toBe("Novo Nome");
      expect(sut.slug).toBe("novo-slug");
    });
  });

  describe("Validation (Error) Cases", () => {
    it("should throw validation error (Zod) if name is empty during creation", () => {
      const props = makeValidCrunchProps();
      props.name = "   "; // O .trim() do Zod limpará a string e fará o .min(1) falhar

      expect(() => Crunch.create(props)).toThrow(/Nome é obrigatório/);
    });

    it("should throw validation error (Zod) if id is invalid during creation", () => {
      const props = makeValidCrunchProps();
      props.id = "";

      expect(() => Crunch.create(props)).toThrow(/Id não é válido/);
    });

    it("should throw validation error (Zod) if slug is empty during creation", () => {
      const props = makeValidCrunchProps();
      props.slug = "  ";

      expect(() => Crunch.create(props)).toThrow(/Slug é obrigatório/);
    });

    it("should throw Error if id is completely missing during restore", () => {
      const props = makeValidCrunchProps();
      delete (props as any).id;

      // O Zod vai capturar primeiro a ausência da string e disparar o erro configurado no schema
      expect(() => Crunch.restore(props)).toThrow(/Id não é válido/);
    });
  });
});
