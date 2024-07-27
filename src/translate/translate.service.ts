import { Injectable, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class TranslationService {
	private apiKey: string;

	constructor(
		private readonly httpService: HttpService,
		private readonly configService: ConfigService
	) {
		this.apiKey = this.configService.get<string>('TRANSLATION_API_KEY');
	}

	async translateText(text: string, targetLang: string): Promise<string> {
		const url = `https://api.translation-service.com/translate`;
		const params = {
			q: text,
			target: targetLang,
			key: this.apiKey,
		};

		try {
			const response = await this.httpService.post(url, params).toPromise();
			return response.data.translatedText;
		} catch (error) {
			throw new HttpException('Translation API error', error.response);
		}
	}
}
