import { ObjectLiteral, Repository } from "typeorm";

export interface IDatabase {
	getRepository<T extends ObjectLiteral>(entity: T): Repository<T>;
}
