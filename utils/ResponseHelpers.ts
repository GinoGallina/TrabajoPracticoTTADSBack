import {
	IBaseResponse,
	IBaseResponseError,
} from "../schemas/shared/IBaseResponse.js";

export function createSuccessResponse<T>(
	message: string,
	data: T,
): IBaseResponse<T> {
	return {
		message,
		data,
		error: null,
		success: true,
	};
}

export function createErrorResponse(
	message: string,
	error?: IBaseResponseError,
): IBaseResponse<null> {
	return {
		message,
		data: null,
		error: error || { Code: 500, Message: "Error interno del servidor" },
		success: false,
	};
}
