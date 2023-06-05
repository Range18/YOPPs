import nodemailer, {Transporter} from "nodemailer";
import {clientServer, smtpServer} from "../../config";
import { MailDto, MailSubject } from '../Dto/MailDto';

class MailService {
    transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: smtpServer.host,
            port: smtpServer.port,
            secure: true,
            auth: {
                user: smtpServer.user,
                pass: smtpServer.password
            }
        })
    }

    async sendMail(mailDto: MailDto) {
        await this.transporter.sendMail({
            from: smtpServer.user,
            to: mailDto.recipient,
            subject: mailDto.subject,
            text: '',
            html: mailDto.message
        })
    }

}

export default new MailService();