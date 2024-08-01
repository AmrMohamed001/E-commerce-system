import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLanguageInput } from './dto/create-language.input';
import { UpdateLanguageInput } from './dto/update-language.input';
import { Repository } from 'typeorm';
import { Language } from './language.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class LanguagesService {
	constructor(
		@InjectRepository(Language) private langRepo: Repository<Language>
	) {}
	async create(createLanguageInput: CreateLanguageInput) {
		// check if default language is already set
		if (createLanguageInput.isDefault) {
			const defaultLang = await this.langRepo.findOne({
				where: { isDefault: true },
			});
			if (defaultLang) {
				defaultLang.isDefault = false;
				await this.langRepo.save(defaultLang);
			}
		}

		const lang = this.langRepo.create(createLanguageInput);
		await this.langRepo.save(lang);

		return { message: 'Languages created successfully' };
	}

	findAll() {
		return this.langRepo.find();
	}

	async findOne(id: number) {
		const lang = await this.langRepo.findOne({ where: { id } });
		if (!lang) throw new NotFoundException('Language not found');
		return lang;
	}

	findDefault() {
		return this.langRepo.findOne({ where: { isDefault: true } });
	}

	async findByLanguage(language: string) {
		return this.langRepo.findOne({ where: { language } });
	}

	async update(id: number, updateLanguageInput: UpdateLanguageInput) {
		const lang = await this.findOne(id);
		if (!lang) throw new NotFoundException('Language not found');

		if (updateLanguageInput.isDefault) {
			const defaultLang = await this.langRepo.findOne({
				where: { isDefault: true },
			});
			if (defaultLang) {
				defaultLang.isDefault = false;
				await this.langRepo.save(defaultLang);
			}
		}

		Object.assign(lang, updateLanguageInput);
		return this.langRepo.save(lang);
	}

	async remove(id: number) {
		const lang = await this.findOne(id);
		if (!lang) throw new NotFoundException('Language not found');
		return this.langRepo.remove(lang);
	}
}
