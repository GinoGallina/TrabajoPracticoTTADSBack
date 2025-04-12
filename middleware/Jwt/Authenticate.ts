import { expressjwt as jwt } from "express-jwt";

export const authenticateJWT = jwt({
	secret: process.env.JWT_SECRET!,
	algorithms: ["HS256"],
	requestProperty: "auth",
});
