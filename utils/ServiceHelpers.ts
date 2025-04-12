import { QueryRunner } from "typeorm";
import { createErrorResponse } from "./ResponseHelpers.js";

interface ValidationRules {
	condition: boolean;
	field: string;
	errorMessage: string;
}

export const validateFields = async (validationRules: ValidationRules[], queryRunner: QueryRunner, entity: string) => {
	for (const rule of validationRules) {
		if (rule.condition) {
			await queryRunner.rollbackTransaction();
			return createErrorResponse("Error al crear " + entity, {
				code: 400,
				message: rule.errorMessage,
			});
		}
	}

	return null;
};
