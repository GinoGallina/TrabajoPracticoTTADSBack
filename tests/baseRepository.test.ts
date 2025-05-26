import { Repository, EntityManager, SelectQueryBuilder } from "typeorm";
import { BaseRepository } from "../repository/BaseRepository.js";
import { BaseModel } from "../models/database/BaseModel.js";

class DummyEntity extends BaseModel {
	// TODO Dummy properties si querés
	Name?: string;
}

describe("BaseRepository", () => {
	let mockRepo: jest.Mocked<Repository<DummyEntity>>;
	let baseRepository: BaseRepository<DummyEntity>;

	let mockQueryBuilder: Partial<jest.Mocked<SelectQueryBuilder<DummyEntity>>>;

	beforeEach(() => {
		mockQueryBuilder = {
			where: jest.fn().mockReturnThis(),
			andWhere: jest.fn().mockReturnThis(),
			getExists: jest.fn(),
		};

		mockRepo = {
			findOne: jest.fn(),
			findAndCount: jest.fn(),
			createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
			save: jest.fn(),
			softDelete: jest.fn(),
		} as unknown as jest.Mocked<Repository<DummyEntity>>;

		baseRepository = new BaseRepository(DummyEntity, mockRepo);
	});

	describe("getById", () => {
		it("debe llamar a findOne con condiciones excluyendo eliminados por defecto", async () => {
			mockRepo.findOne.mockResolvedValueOnce(null);

			await baseRepository.getById(1);

			expect(mockRepo.findOne).toHaveBeenCalledWith({
				where: { Id: 1, DeletedAt: expect.any(Object) },
				select: undefined,
				relations: undefined,
			});
		});

		it("debe incluir eliminados si includeDeleted es true", async () => {
			mockRepo.findOne.mockResolvedValueOnce(null);

			await baseRepository.getById(1, { includeDeleted: true });

			expect(mockRepo.findOne).toHaveBeenCalledWith({
				where: { Id: 1 },
				select: undefined,
				relations: undefined,
			});
		});
	});

	describe("findOneBy", () => {
		it("debe llamar a findOne con condiciones excluyendo eliminados por defecto", async () => {
			mockRepo.findOne.mockResolvedValueOnce(null);

			const where = { Name: "foo" };
			await baseRepository.findOneBy(where);

			expect(mockRepo.findOne).toHaveBeenCalledWith({
				where: { ...where, DeletedAt: expect.any(Object) },
				select: undefined,
				relations: undefined,
			});
		});

		it("debe incluir eliminados si includeDeleted es true", async () => {
			mockRepo.findOne.mockResolvedValueOnce(null);

			const where = { Name: "foo" };
			await baseRepository.findOneBy(where, { includeDeleted: true });

			expect(mockRepo.findOne).toHaveBeenCalledWith({
				where,
				select: undefined,
				relations: undefined,
			});
		});
	});

	describe("findAll", () => {
		it("debe llamar a findAndCount con condiciones excluyendo eliminados por defecto", async () => {
			mockRepo.findAndCount.mockResolvedValueOnce([[], 0]);

			const where = { Active: true } as any;
			await baseRepository.findAll({ where });

			expect(mockRepo.findAndCount).toHaveBeenCalledWith({
				where: { ...where, DeletedAt: expect.any(Object) },
				select: undefined,
				relations: undefined,
				order: undefined,
				skip: undefined,
				take: undefined,
			});
		});

		it("debe incluir eliminados si includeDeleted es true", async () => {
			mockRepo.findAndCount.mockResolvedValueOnce([[], 0]);

			const where = { Active: true } as any;
			await baseRepository.findAll({ where, includeDeleted: true });

			expect(mockRepo.findAndCount).toHaveBeenCalledWith({
				where,
				select: undefined,
				relations: undefined,
				order: undefined,
				skip: undefined,
				take: undefined,
			});
		});
	});

	describe("existsById", () => {
		it("retorna false si id no es número válido", async () => {
			const result = await baseRepository.existsById("notANumber");
			expect(result).toBe(false);
		});

		it("retorna false si excludeId es inválido", async () => {
			const result = await baseRepository.existsById("1", "NaN");
			expect(result).toBe(false);
		});

		it("llama al query builder con id y sin excludeId", async () => {
			(mockQueryBuilder.getExists as jest.Mock).mockResolvedValue(true);

			const result = await baseRepository.existsById("1");

			expect(mockRepo.createQueryBuilder).toHaveBeenCalledWith("entity");
			expect(mockQueryBuilder.where).toHaveBeenCalledWith("entity.Id = :id", { id: 1 });
			expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith("entity.DeletedAt IS NULL");
			expect(mockQueryBuilder.getExists).toHaveBeenCalled();
			expect(result).toBe(true);
		});

		it("llama al query builder con id y excludeId", async () => {
			(mockQueryBuilder.getExists as jest.Mock).mockResolvedValue(true);

			const result = await baseRepository.existsById("1", "2");

			expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith("entity.Id != :excludeId", { excludeId: 2 });
			expect(result).toBe(true);
		});
	});

	describe("existsBy", () => {
		it("llama al query builder con campo, valor y excludeId", async () => {
			(mockQueryBuilder.getExists as jest.Mock).mockResolvedValue(false);

			const result = await baseRepository.existsBy("Name", "foo", "3");

			expect(mockRepo.createQueryBuilder).toHaveBeenCalledWith("entity");
			expect(mockQueryBuilder.where).toHaveBeenCalledWith("entity.Name = :value", { value: "foo" });
			expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith("entity.DeletedAt IS NULL");
			expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith("entity.Id != :excludeId", { excludeId: 3 });
			expect(mockQueryBuilder.getExists).toHaveBeenCalled();
			expect(result).toBe(false);
		});
	});

	describe("create", () => {
		it("llama a save sin EntityManager", async () => {
			const entity = new DummyEntity();
			mockRepo.save.mockResolvedValue(entity);

			const result = await baseRepository.create(entity);

			expect(mockRepo.save).toHaveBeenCalledWith(entity);
			expect(result).toBe(entity);
		});

		it("llama a save con EntityManager", async () => {
			const entity = new DummyEntity();
			const manager = { getRepository: jest.fn().mockReturnValue(mockRepo) } as unknown as EntityManager;
			mockRepo.save.mockResolvedValue(entity);

			const result = await baseRepository.create(entity, manager);

			expect(manager.getRepository).toHaveBeenCalledWith(DummyEntity);
			expect(mockRepo.save).toHaveBeenCalledWith(entity);
			expect(result).toBe(entity);
		});
	});

	describe("update", () => {
		it("llama a save con EntityManager", async () => {
			const entity = new DummyEntity();
			const manager = { getRepository: jest.fn().mockReturnValue(mockRepo) } as unknown as EntityManager;
			mockRepo.save.mockResolvedValue(entity);

			const result = await baseRepository.update("1", entity, manager);

			expect(manager.getRepository).toHaveBeenCalledWith(DummyEntity);
			expect(mockRepo.save).toHaveBeenCalledWith(entity);
			expect(result).toBe(entity);
		});
	});

	describe("delete", () => {
		it("retorna false si id no es número válido", async () => {
			const result = await baseRepository.delete("noNumber");
			expect(result).toBe(false);
		});

		it("llama a softDelete con id válido y retorna true si affected > 0", async () => {
			mockRepo.softDelete.mockResolvedValue({ affected: 1 } as any);

			const result = await baseRepository.delete("1");

			expect(mockRepo.softDelete).toHaveBeenCalledWith(1);
			expect(result).toBe(true);
		});

		it("llama a softDelete y retorna false si affected es 0", async () => {
			mockRepo.softDelete.mockResolvedValue({ affected: 0 } as any);

			const result = await baseRepository.delete("1");

			expect(mockRepo.softDelete).toHaveBeenCalledWith(1);
			expect(result).toBe(false);
		});
	});
});
