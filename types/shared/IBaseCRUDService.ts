import { IBaseResponse } from "./IBaseResponse.js";

export interface IBaseCRUDService<TGetAllQuery, TGetAllResponse, TGetOneResponse, TCreateRequest, TCreateResponse, TDeleteResponse> {
	getAll(query: TGetAllQuery): Promise<IBaseResponse<TGetAllResponse | null>>;
	getOne(id: string): Promise<IBaseResponse<TGetOneResponse | null>>;
	create(data: TCreateRequest): Promise<IBaseResponse<TCreateResponse | null>>;
	delete(id: string): Promise<IBaseResponse<TDeleteResponse | null>>;
}
