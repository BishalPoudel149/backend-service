// src/services/email.service.ts
import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    // Configure the email transporter
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // Use your email service (e.g., Gmail, SendGrid)
      auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASSWORD, // Your email password or app-specific password
      },
    });

    // Log the email configuration
    this.logger.log(`Email service configured for user: ${process.env.EMAIL_USER}`);
  }

  // Send an email notification
  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER, // Sender email address
        to, // Recipient email address
        subject, // Email subject
        text: body, // Email body
      };

      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent to ${to}`);
    } catch (error) {
      this.logger.error('Failed to send email', error);
      throw error;
    }
  }
}