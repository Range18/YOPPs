export type MailSubject = 'activate' | 'PWDReset'


export class MailDto{
    mailType: string;
    recipient: string;
    subject: string;
    message: string;
    constructor(mailType: MailSubject, recipient: string, link: string) {
        this.mailType = mailType;
        this.recipient = recipient;
        this.subject = mailType == 'activate' ? 'Account activation on YOPPs' : 'Reset your password'
        this.message = mailType == 'activate' ?
          `
           <div>
              <h1>Follow this link to activate your account</h1>
              <a href='${link}'>Activate your account</a>
           </div>       
      `
      :
      `
           <div>
                <h1>Follow this link to reset your password</h1>
                <a href='${link}'>Reset password</a>
           </div>
`;
    }
}
