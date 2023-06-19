import nodemailer, {Transporter} from "nodemailer";
import {clientServer, smtpServer} from "../../config";
import { MailDto, MailSubject } from '../Dto/MailDto';
import { Logger } from '../logger/logger';
import { ApiError } from '../Errors/ApiErrors';
import { errorMiddleware } from '../middlewares/errorMiddleware';

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