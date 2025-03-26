export interface IBaseResponse<T> {
	message: string;
	data: T | null;
	error: IBaseResponseError | null;
	success: boolean;
}

export interface IBaseResponseError {
	Code: number;
	Message: string;
}
