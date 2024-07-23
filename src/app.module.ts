import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { APP_FILTER } from '@nestjs/core';
import { QueryFailedFilter } from './shared/filters/query-failed.filter';
import { UploadModule } from './upload/upload.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { SubcategoryModule } from './subcategory/subcategory.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
	imports: [
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '..', 'public'),
			serveRoot: '/',
		}),
		ConfigModule.forRoot({ isGlobal: true, expandVariables: true }),
		ThrottlerModule.forRoot([
			{
				ttl: 60000,
				limit: 10,
			},
		]),
		DatabaseModule,
		UserModule,
		AuthModule,
		MailModule,
		UploadModule,
		ProductModule,
		CategoryModule,
		SubcategoryModule,
	],
	providers: [
		{
			provide: APP_FILTER,
			useClass: QueryFailedFilter,
		},
	],
})
export class AppModule {}
