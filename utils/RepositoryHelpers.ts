// export const findValidFields = <T>(fields: Partial<T>) =>
// 	Object.fromEntries(
// 		Object.entries(fields).filter(([, value]) => ["string", "number", "boolean"].includes(typeof value) || value === null),
// 	);

import { IGenericGetAllRequest } from "../types/shared/IBaseRequest.js";

export function createValidOrderColumns<T>(columns: (keyof T)[]): Record<string, keyof T> {
	return Object.fromEntries(columns.map((c) => [c.toString().toLowerCase(), c])) as Record<string, keyof T>;
}

export function getAllPaginationOptions<T>(
	rq: IGenericGetAllRequest,
	validOrderColumns: Record<string, keyof T>,
	defaultOrderBy: keyof T = "CreatedAt" as keyof T,
) {
	const page = rq.page && rq.page > 0 ? rq.page : 1;
	const limit = rq.limit && rq.limit > 0 ? rq.limit : 10;
	const orderBy = validOrderColumns[rq.columnSort ?? ""] ?? defaultOrderBy;
	const direction = rq.sortDirection === "asc" ? "ASC" : "DESC";

	return {
		skip: (page - 1) * limit,
		take: limit,
		order: {
			[orderBy]: direction,
		},
		page,
		limit,
	};
}
