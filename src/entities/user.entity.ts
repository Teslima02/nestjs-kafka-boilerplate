import { SharedEntity } from '../common/model/sharedEntity';
import { Column, Entity, ManyToOne } from 'typeorm';

export enum CoreProcessStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in-progress',
  SUCCESS = 'success',
  FAIL = 'fail',
}

@Entity()
export class User extends SharedEntity {
  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ select: false })
  password: string;

  @Column({ nullable: true, default: null, select: false })
  emailConfirmationOtp?: string; // otp to confirm email

  @Column({ nullable: true, default: null, select: false })
  otpConfirmation?: string; // otp to confirm change password

  @Column({ nullable: true, default: null, select: false })
  otpConfirmationExpirationTime?: Date; // otp to confirm change password expire time

  @Column({ default: false })
  otpConfirmationStatus?: boolean; // otp to confirm change password status

  @Column({ nullable: true, select: false })
  tempChangePassword?: string; // this is where user new password is store before user verify that he/she want to change password

  @Column({ nullable: true, default: false })
  isEmailVerify?: boolean;

  @Column({ nullable: false, default: false })
  emailAuthentication?: boolean;

  @Column({ nullable: true, type: 'timestamp', select: false })
  emailConfirmationOtpExpiringTime: Date; // otp for email expire time

  @Column({ nullable: true, default: null, select: false })
  phoneNumberConfirmationOtp?: string; // otp to confirm phone number

  @Column({ nullable: true, default: false })
  isPhoneVerify?: boolean;

  @Column({ nullable: false, default: false })
  phoneAuthentication?: boolean;

  @Column({ nullable: true, type: 'timestamp', select: false })
  phoneNumberConfirmationOtpExpiringTime?: Date; // otp for phone number expire time

  @Column({ default: true })
  emailOtpStatus?: boolean;

  @Column({ default: true })
  phoneOtpStatus?: boolean;

  @Column({ nullable: true, select: false })
  resetPasswordToken?: string;

  @Column({ nullable: true, type: 'timestamp', select: false })
  resetPasswordTokenExpire?: Date;

  @Column({ type: 'enum', enum: CoreProcessStatus, default: CoreProcessStatus.PENDING, nullable: true })
  coreProcessStatus: CoreProcessStatus;
}
