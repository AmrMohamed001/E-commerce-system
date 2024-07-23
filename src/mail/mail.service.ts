import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
@Injectable()
export class MailService {
	private transporter;

	constructor(private configService: ConfigService) {
		this.transporter = nodemailer.createTransport({
			service: 'gmail',
			host: this.configService.get('SMTP_HOST'),
			port: +this.configService.get('SMTP_PORT'),
			secure: false,
			auth: {
				user: this.configService.get('SMTP_USER'),
				pass: this.configService.get('SMTP_PASS'),
			},
		});
	}

	async sendVerificationEmail(email: string, subject: string, text: string) {
		const mailOptions = {
			from: this.configService.get('SMTP_USER'),
			to: email,
			subject,
			text,
		};

		await this.transporter.sendMail(mailOptions);
	}
}
