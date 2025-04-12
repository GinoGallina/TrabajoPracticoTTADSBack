import { Router } from "express";
import { RoleController } from "../controllers/RoleController.js";

import { DataSource } from "typeorm";
import { Role } from "../models/database/Role.js";
import { RoleService } from "../services/RoleService.js";
import { RoleRepository } from "../repository/RoleRepository.js";

export const RoleRouter = (db: DataSource) => {
	const router = Router();

	const roleRepository = new RoleRepository(db.getRepository(Role));

	const roleService = new RoleService(roleRepository, db);
	const roleController = new RoleController(roleService);

	router.get("/getCombo", roleController.getCombo.bind(roleController));

	return router;
};
