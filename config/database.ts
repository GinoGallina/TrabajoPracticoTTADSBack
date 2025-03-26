import { DataSource } from "typeorm";
import "./env";

let db = new DataSource({
	type: "postgres",
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT),
	username: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: "postgres",
	synchronize: false,
	logging: false,
});

async function createDatabaseIfNotExists() {
	try {
		await db.initialize();

		const queryRunner = db.createQueryRunner();

		const result = await queryRunner.query(`
            SELECT 1 FROM pg_database WHERE datname = '${process.env.DB_NAME}'
        `);

		if (result.length === 0) {
			console.log(
				`Database ${process.env.DB_NAME} doesn't existe. Starting createing it...`,
			);
			await queryRunner.query(`
                CREATE DATABASE "${process.env.DB_NAME}"
            `);
			console.log(
				`Database ${process.env.DB_NAME} created successfully.`,
			);
		}

		await db.destroy();

		db = new DataSource({
			type: "postgres",
			host: process.env.DB_HOST,
			port: Number(process.env.DB_PORT),
			username: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_NAME,
			entities: ["models/database/*.ts"],
			synchronize: true,
			logging: false,
		});

		await db.initialize();
		console.log("Database connected");
	} catch (error) {
		console.error("Error while creating or connecting Database:", error);
		process.exit(1);
	}
}

export { db, createDatabaseIfNotExists };
