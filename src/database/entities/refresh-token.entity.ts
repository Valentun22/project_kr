import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import { TableNameEnum } from '../enums/table-name.enum';
import { BaseModel } from './models/base.model';
import { UserEntity } from './user.entity';

@Entity(TableNameEnum.REFRESH_TOKEN)
export class RefreshTokenEntity extends BaseModel {
  @Column('text')
  refreshToken: string;

  @Index()
  @Column('text')
  deviceId: string;

  @Column()
  user_id: string;
  @ManyToOne(() => UserEntity, (entity) => entity.refreshTokens, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;
}
