import { z } from "zod";

export const departmentSchema = z.object({
  id: z.string().uuid(),
  crunchId: z.string().uuid(),
  name: z.string().trim().min(1, "Nome do ministério é obrigatório"),
  leaderId: z.string().uuid(),
  isActive: z.boolean().default(true),
});

export type DepartmentDTO = z.infer<typeof departmentSchema>;

export class Department {
  private _id: string;
  private _crunchId: string;
  private _name: string;
  private _leaderId: string;
  private _isActive: boolean;

  constructor(props: DepartmentDTO) {
    this._id = props.id;
    this._crunchId = props.crunchId;
    this._name = props.name;
    this._leaderId = props.leaderId;
    this._isActive = props.isActive;
  }

  // Getters e Setters
  get id() {
    return this._id;
  }
  get name() {
    return this._name;
  }
  get leaderId() {
    return this._leaderId;
  }
  get isActive() {
    return this._isActive;
  }

  get crunchId() {
    return this._crunchId;
  }
  set id(value: string) {
    this._id = value;
  }
  set name(value: string) {
    this._name = value;
  }
  set leaderId(value: string) {
    this._leaderId = value;
  }
  set isActive(value: boolean) {
    this._isActive = value;
  }

  set crunchId(value: string) {
    this._crunchId = value;
  }
}
