import { DataSource } from "typeorm";
import { IBaseResponse } from "../schemas/shared/IBaseResponse.js";
import { createErrorResponse } from "../utils/ResponseHelpers.js";
import { IGetCombo } from "../schemas/shared/IGetCombo.js";
import { RoleRepository } from "../repository/RoleRepository.js";

export class RoleService {
	constructor(
		private readonly roleRepository: RoleRepository,
		private readonly db: DataSource,
	) {}

	async getCombo(): Promise<IBaseResponse<IGetCombo | null>> {
		try {
			const items = await this.roleRepository.getCombo();
			return {
				message: "",
				data: {
					items,
				},
				error: null,
				success: true,
			};
		} catch (e) {
			console.log(e);
			return createErrorResponse("Error obteniendo combo de roles", {
				code: e instanceof Error ? 500 : 500, // TODO: CODE DE error si es instance of Error
				message: "",
			});
		}
	}
}
