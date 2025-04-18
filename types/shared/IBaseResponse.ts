export interface IBaseResponse<T> {
	message: string;
	data: T | null;
	error: IBaseResponseError | null;
	success: boolean;
}

export interface IBaseResponseError {
	code: number;
	message: string;
}

export interface IGenericGetAllResponse {
	totalCount: number;
}
