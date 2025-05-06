import { container } from "tsyringe";
import { db } from "./database.js";
import { ProductRepository } from "../repository/ProductRepository.js";
import { UserService } from "../services/UserService.js";
import { CategoryService } from "../services/CategoryService.js";
import { Product } from "../models/database/Product.js";
import { ProductService } from "../services/ProductService.js";
import { ProductController } from "../controllers/ProductController.js";
import { Category } from "../models/database/Category.js";
import { CategoryRepository } from "../repository/CategoryRepository.js";
import { User } from "../models/database/User.js";
import { Role } from "../models/database/Role.js";
import { UserRepository } from "../repository/UserRepository.js";
import { UserController } from "../controllers/UserController.js";
import { CategoryController } from "../controllers/CategoryController.js";
import { AuthService } from "../services/AuthService.js";
import { AuthController } from "../controllers/AuthController.js";
import { RoleController } from "../controllers/RoleController.js";
import { RoleService } from "../services/RoleService.js";
import { RoleRepository } from "../repository/RoleRepository.js";
import { PaymentTypeController } from "../controllers/PaymentTypeController.js";
import { PaymentTypeService } from "../services/PaymentTypeService.js";
import { PaymentTypeRepository } from "../repository/PaymentTypeRepository.js";
import { PaymentType } from "../models/database/PaymentType.js";
import { Order } from "../models/database/Order.js";
import { OrderRepository } from "../repository/OrderRepository.js";
import { OrderService } from "../services/OrderService.js";
import { OrderController } from "../controllers/OrderController.js";
import { ReviewController } from "../controllers/ReviewController.js";
import { ReviewService } from "../services/ReviewService.js";
import { ReviewRepository } from "../repository/ReviewRepository.js";
import { Review } from "../models/database/Review.js";

export const registerInyectables = () => {
	// Database
	container.register("DataSource", { useValue: db });

	// TypeORM repositories
	container.register("ProductTypeORMRepository", {
		useValue: db.getRepository(Product),
	});
	container.register("CategoryTypeORMRepository", {
		useValue: db.getRepository(Category),
	});
	container.register("UserTypeORMRepository", {
		useValue: db.getRepository(User),
	});
	container.register("RoleTypeORMRepository", {
		useValue: db.getRepository(Role),
	});
	container.register("PaymentTypeTypeORMRepository", {
		useValue: db.getRepository(PaymentType),
	});
	container.register("OrderTypeORMRepository", {
		useValue: db.getRepository(Order),
	});
	container.register("ReviewTypeORMRepository", {
		useValue: db.getRepository(Review),
	});

	// Repositories
	container.register("ProductRepository", { useClass: ProductRepository });
	container.register("CategoryRepository", { useClass: CategoryRepository });
	container.register("UserRepository", { useClass: UserRepository });
	container.register("RoleRepository", { useClass: RoleRepository });
	container.register("PaymentTypeRepository", { useClass: PaymentTypeRepository });
	container.register("OrderRepository", { useClass: OrderRepository });
	container.register("ReviewRepository", { useClass: ReviewRepository });

	// Services
	container.register("CategoryService", { useClass: CategoryService });
	container.register("ProductService", { useClass: ProductService });
	container.register("UserService", { useClass: UserService });
	container.register("AuthService", { useClass: AuthService });
	container.register("RoleService", { useClass: RoleService });
	container.register("PaymentTypeService", { useClass: PaymentTypeService });
	container.register("OrderService", { useClass: OrderService });
	container.register("ReviewService", { useClass: ReviewService });

	// Controllers
	container.register("ProductController", { useClass: ProductController });
	container.register("CategoryController", { useClass: CategoryController });
	container.register("UserController", { useClass: UserController });
	container.register("AuthController", { useClass: AuthController });
	container.register("RoleController", { useClass: RoleController });
	container.register("PaymentTypeController", { useClass: PaymentTypeController });
	container.register("OrderController", { useClass: OrderController });
	container.register("ReviewController", { useClass: ReviewController });
};
