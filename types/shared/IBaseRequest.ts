export interface IGenericGetAllRequest<> {
	limit?: number;
	page?: number;
	columnSort?: string;
	sortDirection?: "asc" | "desc";
	text?: string;
}
