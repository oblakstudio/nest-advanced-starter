import { Entity, Property, PrimaryKey } from '@mikro-orm/core';

@Entity()
export class Role {
  @PrimaryKey()
  id: number;

  @Property()
  name: string;
}
