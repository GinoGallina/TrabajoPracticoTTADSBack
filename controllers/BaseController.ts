import { Request, Response } from "express";
import { IBaseCRUDService } from "../types/shared/IBaseCRUDService.js";

export class BaseController<
	TService extends IBaseCRUDService<
		TQueryGetAll,
		TGetAllResponse,
		TGetOneResponse,
		TCreateRequest,
		TCreateResponse,
		TUpdateRequest,
		TUpdateResponse,
		TDeleteResponse
	>,
	TQueryGetAll,
	TGetAllResponse,
	TGetOneResponse,
	TCreateRequest,
	TCreateResponse,
	TUpdateRequest,
	TUpdateResponse,
	TDeleteResponse,
> {
	constructor(protected readonly service: TService) {}

	getAll = async (req: Request<object, object, object, TQueryGetAll>, res: Response) => {
		const response = await this.service.getAll(req.query);
		res.status(response.success ? 200 : (response.error?.code ?? 500)).json(response);
	};

	getOne = async (req: Request<{ id: string }>, res: Response) => {
		const response = await this.service.getOne(req.params.id);
		res.status(response.success ? 200 : (response.error?.code ?? 500)).json(response);
	};

	create = async (req: Request<object, object, TCreateRequest>, res: Response) => {
		const response = await this.service.create(req.body);
		res.status(response.success ? 201 : (response.error?.code ?? 500)).json(response);
	};

	update = async (req: Request<{ id: string }, object, TUpdateRequest>, res: Response) => {
		const response = await this.service.update(req.params.id, req.body);
		res.status(response.success ? 201 : (response.error?.code ?? 500)).json(response);
	};

	delete = async (req: Request<{ id: string }>, res: Response) => {
		const response = await this.service.delete(req.params.id);
		res.status(response.success ? 200 : (response.error?.code ?? 500)).json(response);
	};
}
