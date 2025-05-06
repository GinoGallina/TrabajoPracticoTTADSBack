// Base response
export interface IBaseResponse<T> {
	message: string;
	data: T | null;
	error: IBaseResponseError | null;
	success: boolean;
}
// Error
export interface IBaseResponseError {
	code: number;
	message: string;
}
// Get All
export interface IGenericGetAllResponse {
	totalCount: number;
}
// Delete
export interface IGenericDeleteResponse {
	id: string;
}
