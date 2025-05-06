import { IBaseResponse } from "./IBaseResponse.js";

export interface IBaseCRUDService<
	TGetAllQuery,
	TGetAllResponse,
	TGetOneResponse,
	TCreateRequest,
	TCreateResponse,
	TUpdateRequest,
	TUpdateResponse,
	TDeleteResponse,
> {
	getAll(query: TGetAllQuery): Promise<IBaseResponse<TGetAllResponse | null>>;
	getOne(id: string): Promise<IBaseResponse<TGetOneResponse | null>>;
	create(data: TCreateRequest): Promise<IBaseResponse<TCreateResponse | null>>;
	update(id: string, data: TUpdateRequest): Promise<IBaseResponse<TUpdateResponse | null>>;
	delete(id: string): Promise<IBaseResponse<TDeleteResponse | null>>;
}
