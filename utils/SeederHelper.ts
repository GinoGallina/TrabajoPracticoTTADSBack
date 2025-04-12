import { DataSource } from "typeorm";
import { Role } from "../models/database/Role.js";
import { User } from "../models/database/User.js";
import bcrypt from "bcrypt";
import { RoleEnum } from "../schemas/IRole.js";

export async function seedDatabase(db: DataSource) {
	const roleRepo = db.getRepository(Role);
	const userRepo = db.getRepository(User);

	const roleNames = Object.values(RoleEnum);

	for (const name of roleNames) {
		const exists = await roleRepo.findOneBy({ Name: name });
		if (!exists) {
			const role = roleRepo.create({ Name: name });
			await roleRepo.save(role);
			console.log(`Rol creado: ${name}`);
		}
	}
	// TODO: ver si anda
	// const admin = await userRepo.findOne({
	// 	relations: ["Roles"],
	// 	where: {
	// 		Roles: {
	// 			Name: RoleEnum.Admin,
	// 		},
	// 	},
	// });

	const users = await userRepo.find({
		relations: ["Roles"],
	});

	const admin = users.find((user) => user.Roles.some((role) => role.Name === RoleEnum.Admin));

	if (!admin) {
		const adminRole = await roleRepo.findOneBy({ Name: RoleEnum.Admin });

		if (!adminRole) {
			throw new Error("Rol admin no encontrado");
		}

		const newAdmin = userRepo.create({
			Email: "admin@localhost.com",
			Username: "Admin Admin",
			Address: "Brown 174881",
			// TODO: Check Hash password
			Password: await bcrypt.hash("Password1!", 10),
			Roles: [adminRole],
		});

		await userRepo.save(newAdmin);
		console.log("Usuario admin creado");
	}
}
