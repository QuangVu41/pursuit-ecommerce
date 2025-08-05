import nodemailer from 'nodemailer';

export class Email {
  to: string;
  from: string;
  token?: string;

  constructor(email: string, token?: string) {
    this.from = `Pursuit Verification <${process.env.GOOGLE_EMAIL_SMTP_USER}>`;
    this.to = email;
    this.token = token;
  }

  newTransport() {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.GOOGLE_EMAIL_SMTP_USER,
        clientId: process.env.GOOGLE_EMAIL_CLIENT_ID,
        clientSecret: process.env.GOOGLE_EMAIL_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_EMAIL_REFRESH_TOKEN,
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
