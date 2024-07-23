import { Injectable, BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Injectable()
export class UploadService {
	customFileName(req, file, cb) {
		const fileExtName = extname(file.originalname);
		cb(null, `img-${req.user.id}-${Date.now()}${fileExtName}`);
	}

	imageFileFilter(req, file, cb) {
		if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
			return cb(
				new BadRequestException('Only image files are allowed!'),
				false
			);
		}
		cb(null, true);
	}

	// Multer options
	getMulterOptions(resource: string) {
		return {
			storage: diskStorage({
				destination: `./public/uploads/${resource}`,
				filename: this.customFileName,
			}),
			fileFilter: this.imageFileFilter,
		};
	}
}
