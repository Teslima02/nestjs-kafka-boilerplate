export class ResetPasswordDto {
  readonly email: string;
  readonly newPassword: string;
  readonly resetPasswordToken: string;
  readonly currentPassword: string;
}
