import { Module } from '@nestjs/common';
import { LanguagesService } from './languages.service';
import { LanguagesResolver } from './languages.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Language } from './language.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Language])],
	providers: [LanguagesResolver, LanguagesService],
	exports: [LanguagesService],
})
export class LanguagesModule {}
