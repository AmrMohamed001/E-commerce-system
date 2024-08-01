import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { LanguagesService } from './languages.service';
import { Language } from './language.entity';
import { CreateLanguageInput } from './dto/create-language.input';
import { UpdateLanguageInput } from './dto/update-language.input';
import { CreateProductType } from './types/create-language.type';

@Resolver(() => Language)
export class LanguagesResolver {
	constructor(private readonly languagesService: LanguagesService) {}

	@Mutation(() => CreateProductType)
	createLanguage(
		@Args('input', { type: () => CreateLanguageInput })
		body: CreateLanguageInput
	) {
		return this.languagesService.create(body);
	}

	@Query(() => [Language], { name: 'languages' })
	findAll() {
		return this.languagesService.findAll();
	}

	@Query(() => Language, { name: 'language' })
	findOne(@Args('id', { type: () => Int }) id: number) {
		return this.languagesService.findOne(id);
	}

	@Mutation(() => Language)
	updateLanguage(
		@Args('id') id: number,
		@Args('updateLanguageInput') updateLanguageInput: UpdateLanguageInput
	) {
		return this.languagesService.update(id, updateLanguageInput);
	}

	@Mutation(() => Language)
	removeLanguage(@Args('id', { type: () => Int }) id: number) {
		return this.languagesService.remove(id);
	}
}
