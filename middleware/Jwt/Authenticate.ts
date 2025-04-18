import { expressjwt } from "express-jwt";

export const authenticateJWT = expressjwt({
	secret: process.env.JWT_SECRET!,
	algorithms: ["HS256"],
	requestProperty: "auth",
}).unless({
	path: [
		{ url: "/api/auth/login", methods: ["POST"] },
		{ url: "/api/auth/register", methods: ["POST"] },
		{ url: "/api/role/getCombo", methods: ["GET"] },
	],
});
