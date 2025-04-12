import { RoleEnum } from "../IRole.js";

export interface IToken {
	user: {
		id: string;
		roles: RoleEnum[];
		username: string;
		email: string;
	};
}
