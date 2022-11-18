import { User } from '../entities/user.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  constructor() {
    super();
  }

  findUserByEmailWithCredentials(email: string): Promise<User> {
    console.log(email, 'email');
    return this.findOne({
      where: { email: email },
      select: [
        'id',
        'email',
        'password',
        'otpConfirmation',
        'otpConfirmationExpirationTime',
        'emailAuthentication',
        'emailOtpStatus',
      ],
    });
  }

  findUserAndGetVerificationDetails(email: string): Promise<User> {
    return this.findOne({
      where: { email: email },
      select: [
        'id',
        'email',
        'emailAuthentication',
        'phone',
        'emailConfirmationOtp',
        'otpConfirmation',
        'otpConfirmationStatus',
        'isEmailVerify',
        'emailConfirmationOtpExpiringTime',
        'phoneNumberConfirmationOtp',
        'isPhoneVerify',
        'phoneNumberConfirmationOtpExpiringTime',
        'emailOtpStatus',
        'phoneOtpStatus',
      ],
    });
  }

  getUserBasicDetails(userId: string): Promise<User> {
    return this.findOne({
      where: { id: userId },
      select: [
        'id',
        'email',
        'emailAuthentication',
        'phone',
        'phoneAuthentication',
        'isEmailVerify',
        'isPhoneVerify',
      ],
    });
  }

  findUserById(userId: string): Promise<User> {
    return this.findOne({
      where: { id: userId },
      select: ['id', 'email', 'emailAuthentication'],
    });
  }

  findUserByEmail(email: string): Promise<User> {
    return this.findOne({
      where: { email: email },
      select: [
        'id',
        'email',
        'otpConfirmation',
        'otpConfirmationExpirationTime',
        'emailAuthentication',
        'emailOtpStatus',
      ],
    });
  }

  registrationResponse(userId: string): Promise<User> {
    return this.findOne({
      where: { id: userId },
      select: [
        'id',
        'email',
        'emailConfirmationOtpExpiringTime',
        'coreProcessStatus',
      ],
    });
  }

  loginResponse(email: string): Promise<User> {
    return this.findOne({
      where: [{ email: email }],
      select: [
        'id',
        'otpConfirmationExpirationTime',
        'otpConfirmation',
        'emailAuthentication',
        'password',
        'email',
      ],
    });
  }

  currentUserResponse(userId: string): Promise<User> {
    return this.findOne({
      where: [{ id: userId }],
      select: ['id', 'email', 'emailAuthentication', 'isEmailVerify'],
    });
  }
}
