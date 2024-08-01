import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { LanguagesService } from 'src/languages/languages.service';

export class CheckLang implements NestInterceptor {
	constructor(private LangService: LanguagesService) {}
	intercept(context: ExecutionContext, next: CallHandler<any>) {
		return next.handle();
	}
}
