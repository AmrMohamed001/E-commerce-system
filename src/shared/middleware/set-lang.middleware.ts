import {
	BadRequestException,
	Injectable,
	NestMiddleware,
} from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { Request } from '../interfaces/custom-request.interface';
import { LanguagesService } from 'src/languages/languages.service';
@Injectable()
export class SetLangMiddleware implements NestMiddleware {
	constructor(private langService: LanguagesService) {}
	async use(req: Request, res: Response, next: NextFunction) {
		const isLangExists = await this.langService.findByLanguage(
			req.headers['lang'] as string
		);
		if (!isLangExists)
			return next(
				new BadRequestException(
					'this language is not supported,please provide correct one '
				)
			);
		const defaultLang = await this.langService.findDefault();
		let lang = req.headers['lang'] || defaultLang.language;

		req.i18nLang = lang as string;
		next();
	}
}
