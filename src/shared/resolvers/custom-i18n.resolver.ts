// src/custom-i18n.resolver.ts
import { I18nResolver } from 'nestjs-i18n';
import { Injectable, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class CustomI18nResolver implements I18nResolver {
	async resolve(context: ExecutionContext): Promise<string | string[]> {
		const request: Request = context.switchToHttp().getRequest();
		return (request.headers['lang'] as string) || 'en'; // Default to 'en' if no 'lang' header is provided
	}
}
