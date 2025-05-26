import { Entity, Column } from "typeorm";
import { BaseModel } from "./BaseModel.js";
import { RoleEnum } from "../../types/IRole.js";

@Entity("Role")
export class Role extends BaseModel {
	@Column({ type: "enum", enum: RoleEnum, default: RoleEnum.User })
	Name!: RoleEnum.Admin | RoleEnum.User | RoleEnum.Seller;
}
