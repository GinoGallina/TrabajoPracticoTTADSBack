import "reflect-metadata";
import express, { json } from "express";
import cors from "cors";

// Dont env config
import "./config/env";

// Database config
import { createDatabaseIfNotExists, db } from "./config/database.js";

// Routes config
import createRoutes from "./routes/index.js";
import { seedDatabase } from "./utils/SeederHelper.js";
import { authenticateJWT } from "./middleware/Jwt/Authenticate.js";

// Inyectables
import { registerInyectables } from "./config/inyectabes.js";
import { ContextService } from "./services/ContextService.js";

// Check required environment variables
const requiredEnvVars = ["PORT", "DB_HOST", "DB_PORT", "DB_USER", "DB_PASS", "DB_NAME"];
requiredEnvVars.forEach((varName) => {
	if (!process.env[varName]) {
		console.error(`Error: Falta la variable de entorno ${varName}`);
		process.exit(1);
	}
});

const app = express();

app.use(json());
app.use(cors());

// TODO
// app.use(helmet()); // Agrega encabezados de seguridad HTTP
// app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(",") || "*" })); // Restringe accesos
app.disable("x-powered-by");

const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
	try {
		await createDatabaseIfNotExists();

		await seedDatabase(db);

		registerInyectables();

		// JWT
		app.use((req, _, next) => {
			ContextService.run(req, () => {
				next();
			});
		}, authenticateJWT);

		app.use("/api", createRoutes());

		app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
	} catch (error) {
		console.error("Error:", error);
		process.exit(1);
	}
}

startServer();
