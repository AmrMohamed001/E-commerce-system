import {
	Catch,
	ArgumentsHost,
	HttpStatus,
	BadRequestException,
} from '@nestjs/common';
import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class QueryFailedExceptionFilter implements GqlExceptionFilter {
	catch(exception: QueryFailedError, host: ArgumentsHost) {
		if (exception['code'] === '23505') {
			//@ts-ignore
			throw new BadRequestException(exception.detail);
		} else if (exception.message.includes('violates foreign key constraint')) {
			throw new BadRequestException(
				'Cannot delete or update because of related records in other tables.'
			);
		}
	}
}
