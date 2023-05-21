import nodemailer, {Transporter} from "nodemailer";
import {clientServer, smtpServer} from "../../config";

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

    async sendActivationMail(recipient: string, link: string) {
        await this.transporter.sendMail({
            from: smtpServer.user,
            to: recipient,
            subject: 'Account activation on ' + clientServer.url,
            text: '',
            html:
                `
            <div>
                <h1>Для активации перейдите по ссылке</h1>
                <a href="${link}">Activate your account</a>
            </div>
            `
        })
    }

}

export default new MailService();