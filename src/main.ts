import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { graphqlUploadExpress } from 'graphql-upload-ts/dist/graphqlUploadExpress';
import { SetLangMiddleware } from './shared/middleware/set-lang.middleware';
async function bootstrap() {
	const app = await NestFactory.create(AppModule, { cors: true });

	app.setGlobalPrefix('api');
	app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
	app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));
	app.use(new SetLangMiddleware().use);
	app.use(helmet());
	await app.listen(3000);
}
bootstrap();
