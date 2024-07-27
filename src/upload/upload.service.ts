import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { FileUpload } from 'graphql-upload-ts/dist/Upload';
import { createWriteStream } from 'fs';
@Injectable()
export class UploadService {
	async uploadPhoto(file: FileUpload, resource: string) {
		let { createReadStream, filename } = file;
		filename = `${Date.now()}-${filename}`;
		const path = join(`public/uploads/${resource}`, filename);
		const stream = createReadStream();
		const out = createWriteStream(path);
		stream.pipe(out);
		await new Promise((resolve, reject) => {
			out.on('finish', resolve);
			out.on('error', reject);
		});
		return filename;
	}

	async uploadImages(files) {
		const imageUrls = [];

		for (const file of files) {
			let { createReadStream, filename } = await file;
			filename = `${Date.now()}-${filename}`;
			const path = join(`public/uploads/products`, filename);
			const stream = createReadStream();
			const out = createWriteStream(path);
			stream.pipe(out);
			await new Promise((resolve, reject) => {
				out.on('finish', resolve);
				out.on('error', reject);
			});
			imageUrls.push(filename);
		}
		return imageUrls;
	}
}
