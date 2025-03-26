export interface IAuthOUser {
	given_name: string;
	family_name: string;
	nickname: string;
	name: string;
	picture: string;
	locale: string;
	updated_at: string;
	email: string;
	email_verified: boolean;
	sub: string;
}

export interface ILoginAuth0 {
	email: string;
	username: string;
	type: string;
	address: string;
	state: string;
}
