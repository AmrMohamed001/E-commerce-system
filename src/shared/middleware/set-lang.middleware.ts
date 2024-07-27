import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { Request } from '../interfaces/custom-request.interface';
@Injectable()
export class SetLangMiddleware implements NestMiddleware {
	use(req: Request, res: Response, next: NextFunction) {
		let lang = req.headers['lang'] || 'en';
		req.i18nLang = lang as string;
		next();
	}
}
