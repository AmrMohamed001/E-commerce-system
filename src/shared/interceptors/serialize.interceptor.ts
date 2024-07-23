import {
	CallHandler,
	ExecutionContext,
	NestInterceptor,
	UseInterceptors,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { map, Observable } from 'rxjs';
import { ClassConstructor } from '../interfaces/class-constructor.interface';

export const Serialize = (dto: ClassConstructor) =>
	UseInterceptors(new SerializeInterceptor(dto));

export class SerializeInterceptor implements NestInterceptor {
	constructor(private dto: ClassConstructor) {}
	intercept(
		context: ExecutionContext,
		next: CallHandler<any>
	): Observable<any> | Promise<Observable<any>> {
		return next.handle().pipe(
			map((data) => {
				return plainToClass(this.dto, data, {
					excludeExtraneousValues: true,
				});
			})
		);
	}
}
