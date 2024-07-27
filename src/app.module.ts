import {
	MiddlewareConsumer,
	Module,
	NestModule,
	Type,
	ExecutionContext,
} from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';

import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { APP_FILTER } from '@nestjs/core';
import { UploadModule } from './upload/upload.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { SubcategoryModule } from './subcategory/subcategory.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { QueryFailedExceptionFilter } from './shared/filters/query-failed.filter';
import { TranslateModule } from './translate/translate.module';
import {
	AcceptLanguageResolver,
	GraphQLWebsocketResolver,
	I18nModule,
	QueryResolver,
} from 'nestjs-i18n';
import * as path from 'path';
import { CustomI18nResolver } from './shared/resolvers/custom-i18n.resolver';
import { DataloaderModule } from './dataloader/dataloader.module';
@Module({
	imports: [
		GraphQLModule.forRoot<ApolloDriverConfig>({
			driver: ApolloDriver,
			autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
			playground: true,
			path: '/graphql',
		}),
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
		I18nModule.forRoot({
			fallbackLanguage: 'ar',
			loaderOptions: {
				path: path.join(__dirname, '/i18n/'),
				watch: true,
			},
			resolvers: [
				AcceptLanguageResolver,
				QueryResolver,
				CustomI18nResolver,
				GraphQLWebsocketResolver,
			],
		}),
		DatabaseModule,
		UserModule,
		AuthModule,
		MailModule,
		UploadModule,
		ProductModule,
		CategoryModule,
		SubcategoryModule,
		TranslateModule,
		DataloaderModule,
	],
	providers: [
		{
			provide: APP_FILTER,
			useClass: QueryFailedExceptionFilter,
		},
	],
})
export class AppModule {}
