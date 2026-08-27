import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  async sendTaskCreatedEmail(
    taskTitle: string,
    priority: string,
  ) {
    await this.transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: 'TaskFlow - New Task Created',
      text: `A new task has been created.

Task: ${taskTitle}
Priority: ${priority}`,
    });
  }
}