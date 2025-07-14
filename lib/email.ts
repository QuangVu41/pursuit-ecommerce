import nodemailer from 'nodemailer';

export class Email {
  to: string;
  from: string;
  token?: string;

  constructor(email: string, token?: string) {
    this.from = `Pursuit Verification <${process.env.SENDGRID_EMAIL_FROM}>`;
    this.to = email;
    this.token = token;
  }

  newTransport() {
    return nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: process.env.SENDGRID_USER,
        pass: process.env.SENDGRID_PASS,
      },
    });
  }

  async send(html: string, subject: string) {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
    };
    await this.newTransport().sendMail(mailOptions);
  }

  async sendEmailVerification() {
    await this.send(`<p>Your email verification code: ${this.token}</p>`, 'Email Verification');
  }

  async sendPasswordReset() {
    await this.send(
      `<p>Your password reset link: <a href='${process.env.APP_URL}/auth/reset-password?token=${this.token}'>Click here</a></p>`,
      'Password Reset'
    );
  }

  async sendEmailProductPurchase(html: string) {
    await this.send(html, 'Product Purchase Successful');
  }
}
