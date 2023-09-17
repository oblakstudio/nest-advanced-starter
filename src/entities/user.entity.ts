import { BaseEntity } from '@common/database';
import { Role } from '@entities';
import {
  Entity,
  Property,
  BeforeCreate,
  BeforeUpdate,
  BeforeUpsert,
  ManyToOne,
} from '@mikro-orm/core';
import * as bcrypt from 'bcrypt';

@Entity()
export class User extends BaseEntity {
  @Property()
  firstName: string;

  @Property()
  lastName: string;

  @Property({ default: false })
  isBlocked: boolean;

  @Property()
  jmbg: string;

  @Property()
  department: string;

  @ManyToOne(() => Role)
  role!: Role;

  @Property({ unique: true })
  email: string;

  /**
   * Grafana user identifier - used for authentication
   */
  sub?: string;

  @Property({ unique: true })
  username: string;

  // @Property({ hidden: true, columnType: 'text', lazy: true })
  @Property()
  password!: string;

  @BeforeCreate()
  @BeforeUpdate()
  @BeforeUpsert()
  async hashPassword() {
    if (!this.password.startsWith('$2')) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
}
