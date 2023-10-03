import { MailDto } from './MailDto';
import { smtpServer } from '../config';
import { logger } from '../main';
import nodemailer from 'nodemailer';

class MailService {
  transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: smtpServer.host,
      port: smtpServer.port,
      secure: true,
      auth: {
        user: smtpServer.user,
        pass: smtpServer.password,
      },
    });
  }

  async sendMail(mailDto: MailDto) {
    await this.transporter
      .sendMail({
        from: smtpServer.user,
        to: mailDto.recipient,
        subject: mailDto.subject,
        text: '',
        html: mailDto.message,
      })
      .catch((error) => {
        logger.error(error);
      });
  }
}

export default new MailService();
