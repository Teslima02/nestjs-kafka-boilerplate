import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SMSPayload, SMSSender } from 'rckg-shared-library';

@Injectable()
export class SMSService {
  constructor(private readonly configService: ConfigService) {}

  async smsServiceToSendOTP(phone: string, otp: string): Promise<any> {
    if (phone) {
      const payload: SMSPayload = {
        recipients: [phone],
        message: `Your otp verification is ${otp} `,
      };
      const smsSender = new SMSSender('url');
      await smsSender.send(payload);
    }
  }

  async smsServiceToSuccessfullyChangePassword(phone: string): Promise<any> {
    if (phone) {
      const payload: SMSPayload = {
        recipients: [phone],
        message: `You have successfully change your password. If you don't know anything about this kindly reach out to our customer service to complain`,
      };
      const smsSender = new SMSSender('url');
      await smsSender.send(payload);
    }
  }

  async smsServiceToSendWelcomeEmail(phone: string): Promise<any> {
    if (phone) {
      const payload: SMSPayload = {
        recipients: [phone],
        message: `${phone} Welcome to rocket`,
      };
      const smsSender = new SMSSender('url');
      await smsSender.send(payload);
    }
  }
}
