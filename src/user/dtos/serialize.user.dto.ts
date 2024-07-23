import { Expose } from 'class-transformer';

export class UserSerializerDto {
	@Expose()
	id: number;

	@Expose()
	username: string;

	@Expose()
	email: string;

	@Expose()
	phone: string;

	@Expose()
	image: string;
}
