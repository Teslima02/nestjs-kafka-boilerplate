import { SharedEntity } from '../common/model/sharedEntity';
import { Column, Entity } from 'typeorm';
import { User } from './user.entity';

export enum CoreProcessStatus {
  ACTIVE = 'active',
  DISABLED = 'disabled',
}

@Entity()
export class Hospital extends SharedEntity {
  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  address: string;

  @Column({
    type: 'enum',
    enum: CoreProcessStatus,
    default: CoreProcessStatus.ACTIVE,
    nullable: true,
  })
  coreProcessStatus: CoreProcessStatus;

  user_id: User;
}
