import nodemailer from "nodemailer";
import {smtpServer} from "../../config";
import { MailDto } from '../Dto/MailDto';
import { Logger } from '../logger/logger';

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
        }).catch(error => {
            Logger.log(error, 'ERROR')
        })

    }

}

export default new MailService();