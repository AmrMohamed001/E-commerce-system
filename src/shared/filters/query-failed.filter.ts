import { Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class QueryFailedExceptionFilter implements GqlExceptionFilter {
	catch(exception: QueryFailedError, host: ArgumentsHost) {
		const gqlHost = GqlArgumentsHost.create(host);

		const ctx = host.switchToHttp();
		const gqlCtx = gqlHost.getContext();

		const isHttp = !!ctx.getRequest();
		const isGql = !!gqlCtx;

		const status = HttpStatus.BAD_REQUEST;
		let message = exception.message;

		if (exception['code'] === '23505') {
			// Unique violation error code
			message = 'Duplicate key value violates unique constraint';
		} else if (exception.message.includes('violates foreign key constraint')) {
			// Handle foreign key constraint violation
			message =
				'Cannot delete or update because of related records in other tables.';
		}

		if (isHttp) {
			const response = ctx.getResponse();
			const request = ctx.getRequest();

			response.status(status).json({
				statusCode: status,
				timestamp: new Date().toISOString(),
				path: request.url,
				message,
			});
		} else if (isGql) {
			gqlCtx.response.status(status).json({
				statusCode: status,
				timestamp: new Date().toISOString(),
				path: gqlCtx.req.url,
				message,
			});
		}
	}
}
