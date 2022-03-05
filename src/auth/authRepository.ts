import { User } from '../entities/user.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(User)
export class AuthRepository extends Repository<User> {
  constructor() {
    super();
  }

  findUserByEmail(email: string): Promise<User> {
    return this.findOne({
      where: { email: email },
      select: [
        'id',
        'email',
        'otpConfirmation',
        'otpConfirmationExpirationTime',
      ],
    });
  }
}
