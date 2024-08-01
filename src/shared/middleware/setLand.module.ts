import { Module } from '@nestjs/common';
import { LanguagesService } from 'src/languages/languages.service';
import { SetLangMiddleware } from './set-lang.middleware';
import { LanguagesModule } from 'src/languages/languages.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Language } from 'src/languages/language.entity';

@Module({
	providers: [LanguagesService, SetLangMiddleware],
	exports: [SetLangMiddleware],
	imports: [LanguagesModule, TypeOrmModule.forFeature([Language])],
})
export class SetLangModule {}
