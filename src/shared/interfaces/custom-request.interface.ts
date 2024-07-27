import { Request } from 'express';

declare global {
	namespace Express {
		interface Request {
			i18nLang: string;
		}
	}
}
export { Request };
