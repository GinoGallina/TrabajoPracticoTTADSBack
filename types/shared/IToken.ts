import { RoleEnum } from "../IRole.js";

export interface IToken {
	user: IUserToken;
}
export interface IUserToken {
	id: string;
	roles: RoleEnum[];
	username: string;
	email: string;
}

export interface AuthenticatedRequest extends Request {
	auth?: IUserToken;
}
