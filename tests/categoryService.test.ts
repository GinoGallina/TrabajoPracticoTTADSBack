import { CategoryService } from "../services/CategoryService.js";
import { CategoryRepository } from "../repository/CategoryRepository.js";
import { DataSource, QueryRunner } from "typeorm";
// import { Category } from "../models/database/Category.js";

const mockQueryRunner = {
	connect: jest.fn(),
	startTransaction: jest.fn(),
	rollbackTransaction: jest.fn(),
	commitTransaction: jest.fn(),
	release: jest.fn(),
	manager: {},
} as unknown as QueryRunner;

const mockDataSource = {
	createQueryRunner: jest.fn(() => mockQueryRunner),
} as unknown as DataSource;

const mockCategoryRepo = {
	getRepo: jest.fn(),
	getAll: jest.fn(),
	getById: jest.fn(),
	getCombo: jest.fn(),
	existsBy: jest.fn(),
	existsById: jest.fn(),
	create: jest.fn(),
	update: jest.fn(),
	delete: jest.fn(),
} as unknown as CategoryRepository;

describe("CategoryService", () => {
	let service: CategoryService;

	beforeEach(() => {
		jest.clearAllMocks();
		service = new CategoryService(mockDataSource, mockCategoryRepo);
	});

	describe("getAll", () => {
		it("should return all categories", async () => {
			mockCategoryRepo.getAll = jest.fn().mockResolvedValue({
				items: [{ Id: 1, Name: "Ropa", CreatedAt: new Date("2024-01-01") }],
				totalCount: 1,
			});

			const result = await service.getAll({ page: 1, limit: 10 });

			expect(result.success).toBe(true);
			expect(result.data?.totalCount).toBe(1);
			expect(result.data?.categories[0].name).toBe("Ropa");
		});
	});

	describe("getOne", () => {
		it("should return a category if found", async () => {
			mockCategoryRepo.getById = jest.fn().mockResolvedValue({
				Id: 1,
				Name: "Ropa",
				CreatedAt: new Date("2024-01-01"),
			});

			const result = await service.getOne("1");

			expect(result.message).toBe("Categoría obtenida correctamente.");
			expect(result.success).toBe(true);
			expect(result.data?.name).toBe("Ropa");
		});

		it("should return 404 if category not found", async () => {
			mockCategoryRepo.getById = jest.fn().mockResolvedValue(null);

			const result = await service.getOne("99");

			expect(result.message).toBe("Categoría no encontrada.");
			expect(result.success).toBe(false);
			expect(result.error?.code).toBe(404);
		});
	});

	describe("getCombo", () => {
		it("should return combo list", async () => {
			mockCategoryRepo.getCombo = jest.fn().mockResolvedValue([{ id: "1", description: "Ropa" }]);

			const result = await service.getCombo();

			expect(result.success).toBe(true);
			expect(result.data?.items.length).toBe(1);
		});
	});

	describe("create", () => {
		it("should create a category", async () => {
			mockCategoryRepo.existsBy = jest.fn().mockResolvedValue(false);
			mockCategoryRepo.create = jest.fn().mockResolvedValue({
				Id: 1,
				Name: "Indumentaria",
				CreatedAt: new Date("2024-01-01"),
			});

			const result = await service.create({ Name: "Indumentaria" });

			expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
			expect(mockCategoryRepo.create).toHaveBeenCalled();
			expect(result.success).toBe(true);
			expect(result.message).toBe("Categoría creada correctamente.");
			expect(result.data?.name).toBe("Indumentaria");
		});

		it("should fail on duplicate name", async () => {
			mockCategoryRepo.existsBy = jest.fn().mockResolvedValue(true);

			const result = await service.create({ Name: "Indumentaria" });

			expect(result.success).toBe(false);
			expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
			expect(result.error?.code).toBe(400);
		});
	});

	describe("update", () => {
		it("should update a category", async () => {
			mockCategoryRepo.existsBy = jest.fn().mockResolvedValue(false);
			mockCategoryRepo.getById = jest.fn().mockResolvedValue({
				Id: 1,
				Name: "Original",
				CreatedAt: new Date("2024-01-01"),
			});
			mockCategoryRepo.update = jest.fn();

			const result = await service.update("1", { Name: "Actualizada" });

			expect(mockCategoryRepo.update).toHaveBeenCalled();
			expect(result.message).toBe("Categoría editada correctamente.");
			expect(result.success).toBe(true);
			expect(result.data?.name).toBe("Actualizada");
		});

		it("should return error if category not found", async () => {
			mockCategoryRepo.existsBy = jest.fn().mockResolvedValue(false);
			mockCategoryRepo.getById = jest.fn().mockResolvedValue(null);

			const result = await service.update("99", { Name: "Nada" });

			expect(result.success).toBe(false);
			expect(result.error?.code).toBe(404);
		});
	});

	describe("delete", () => {
		it("should delete a category", async () => {
			mockCategoryRepo.existsById = jest.fn().mockResolvedValue(true);
			mockCategoryRepo.delete = jest.fn().mockResolvedValue(true);

			const result = await service.delete("1");

			expect(mockCategoryRepo.delete).toHaveBeenCalledWith("1", expect.anything());
			expect(result.message).toBe("Categoría eliminada correctamente.");
			expect(result.success).toBe(true);
		});

		it("should return error if category not found", async () => {
			mockCategoryRepo.existsById = jest.fn().mockResolvedValue(null);

			const result = await service.delete("99");

			expect(result.success).toBe(false);
			expect(result.error?.code).toBe(404);
		});
	});
});
