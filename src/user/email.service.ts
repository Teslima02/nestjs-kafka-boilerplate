import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailPayload, EmailSender } from 'rckg-shared-library';
import { configConstant } from '../common/constants/config.constant';

@Injectable()
export class EmailService {
  constructor(private readonly configService: ConfigService) {}

  async emailServiceToSendLoginOTP(email: string, otp: string): Promise<any> {
    const payload: EmailPayload = {
      subject: 'One Time Login Otp',
      recipients: [email],
      templateType: 'loginOTP',
      content: JSON.stringify({
        code: otp,
        subject: 'Login OTP',
      }),
    };
    await new EmailSender().send(payload);
  }

  async emailServiceToSendOTP(email: string, otp: string): Promise<any> {
    if (email) {
      const payload: EmailPayload = {
        subject: 'OTP verification',
        recipients: [email],
        templateType: 'default',
        content: JSON.stringify({
          text: `Your otp verification is ${otp} `,
          subject: 'OTP verification',
        }),
      };
      await new EmailSender().send(payload);
    }
  }

  async emailServiceToSuccessfullyChangePassword(email: string): Promise<any> {
    if (email) {
      const payload: EmailPayload = {
        subject: 'Change Password Successfully',
        recipients: [email],
        templateType: 'default',
        content: JSON.stringify({
          text: `You have successfully change your password. If you don't know anything about this kindly reach out to our customer service to complain`,
          subject: 'Change Password Successfully',
        }),
      };
      await new EmailSender().send(payload);
    }
  }

  async emailServiceToSendWelcomeEmail(email: string): Promise<any> {
    if (email) {
      const payload: EmailPayload = {
        subject: 'Welcome to Rocket',
        recipients: [email],
        templateType: 'default',
        content: JSON.stringify({
          text: `${email} Welcome to rocket`,
          subject: 'Welcome to Rocket',
        }),
      };
      await new EmailSender().send(payload);
    }
  }

  async emailServiceToSendForgetPassword(
    email: string,
    resetPasswordToken: string,
  ): Promise<any> {
    if (email) {
      const payload: EmailPayload = {
        subject: 'Forget Password',
        recipients: [email],
        templateType: 'default',
        content: JSON.stringify({
          text: `Follow this link to reset your password ${this.configService.get(
            configConstant.frontendUrl,
          )}?token=${resetPasswordToken}`,
          subject: 'Welcome to Rocket',
        }),
      };

      await new EmailSender().send(payload);
    }
  }

  async emailServiceToSendResetPassword(email: string): Promise<any> {
    if (email) {
      const payload: EmailPayload = {
        subject: 'Reset Password',
        recipients: [email],
        templateType: 'default',
        content: JSON.stringify({
          text: 'Password reset successfully',
          subject: 'Welcome to Rocket',
        }),
      };

      await new EmailSender().send(payload);
    }
  }
}
