import { AsyncLocalStorage } from "async_hooks";
import { Request } from "express";

type Context = {
	req: Request;
};

const asyncLocalStorage = new AsyncLocalStorage<Context>();

export const ContextService = {
	run(req: Request, callback: () => void) {
		asyncLocalStorage.run({ req }, callback);
	},

	getRequest(): Request {
		const store = asyncLocalStorage.getStore();
		if (!store) {
			throw new Error("No hay contexto disponible para este request");
		}
		return store.req;
	},
};
