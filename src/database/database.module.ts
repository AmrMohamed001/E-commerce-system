import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (config: ConfigService) => {
				return {
					type: 'postgres',
					host: config.get<string>('DB_HOST'),
					port: +config.get<number>('DB_PORT'),
					username: config.get<string>('DB_USERNAME'),
					password: config.get<string>('DB_PASSWORD'),
					database: config.get<string>('DB_DATABASE'),
					autoLoadEntities: true,
					// synchronize: true,
				};
			},
		}),
	],
})
export class DatabaseModule {}
