import { DataSource, EntityManager } from "typeorm";
import { db } from "../config/database.js";

export async function withTransaction<T>(
	task: (manager: EntityManager) => Promise<T>,
	dataSource: DataSource = db,
): Promise<T> {
	const queryRunner = dataSource.createQueryRunner();
	await queryRunner.connect();
	await queryRunner.startTransaction();

	try {
		const result = await task(queryRunner.manager);
		await queryRunner.commitTransaction();
		return result;
	} catch (error) {
		await queryRunner.rollbackTransaction();
		throw error;
	} finally {
		await queryRunner.release();
	}
}

// export function hasManager<T>(
// 	repository: Repository<T>,
// 	manager?: EntityManager,
// ) {
// 	manager ? manager.getRepository(T) : repository;
// }
