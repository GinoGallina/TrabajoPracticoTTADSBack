import { Repository } from "typeorm";

export interface IDatabase {
	getRepository<T>(entity: T): Repository<T>;
}
