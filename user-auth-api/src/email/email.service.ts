import { Injectable, Logger } from '@nestjs/common';
import * as formData from 'form-data';
import Mailgun from 'mailgun.js';



@Injectable()
export class EmailService {
    private readonly logger = new Logger(EmailService.name);
    private mailgun: any;

    constructor() {
        const mailgun = new Mailgun(formData);
        const apiKey = process.env.MAILGUN_API_KEY;
        const domain = process.env.MAILGUN_DOMAIN;


        this.mailgun = mailgun.client({
            username: 'api',
            key: apiKey,
            url: "https://api.mailgun.net"
        });
    }

    async sendEmail(to: string, subject: string, text: string) {
        const messageData = {
            from: `Excited User <mailgun@${process.env.MAILGUN_DOMAIN}>`,
            to: [to],
            subject: subject,
            text: text,
            html: `<h1>${text}</h1>`
        };

        try {
            const result = await this.mailgun.messages.create(process.env.MAILGUN_DOMAIN, messageData);
            this.logger.log(`Email sent: ${result}`);
            return result;
        } catch (error) {
            this.logger.error('Error sending email:', error.response?.body || error.message || error);
            throw new Error(`Error sending email`);
        }
    }
}


