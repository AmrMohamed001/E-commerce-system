import { Module } from '@nestjs/common';
import { TranslationService } from './translate.service';
import { HttpModule } from '@nestjs/axios';
@Module({
	imports: [HttpModule],
	providers: [TranslationService],
	exports: [TranslationService],
})
export class TranslateModule {}
