import { randomUUID } from 'node:crypto';

import { BeforeUpdate, Index, PrimaryKey, Property } from '@mikro-orm/core';
import { ApiHideProperty } from '@nestjs/swagger';

/**
 * Base entity class for mikroorm models, that all other entities of the same type should extend.
 */

export abstract class BaseEntity {
  @ApiHideProperty()
  @PrimaryKey()
  @Index()
  id!: number;

  /**
   *  The unique id of the entity
   */
  @Property({
    columnType: 'varchar(36)',
  })
  @Index()
  idx?: string = randomUUID();

  /**
   *  To enable or disable the entity
   */
  @Property()
  isActive? = true;

  /**
   *  Marked true when entity is soft deleted
   */
  @Property({ hidden: true })
  isDeleted? = false;

  /**
   *  The date that the entity was soft-deleted. Nullable because it's not set until the entity is soft-deleted.
   */
  @Property()
  deletedAt?: Date | null;

  /**
   *  The date that the entity was created
   */
  @Property()
  createdAt? = new Date();

  /**
   *  The date that the entity was last updated
   */
  @Property({
    onUpdate: () => new Date(),
    hidden: true,
  })
  updatedAt? = new Date();

  @BeforeUpdate()
  updateDeletedAt() {
    if (this.isDeleted) {
      this.deletedAt = new Date();
    }
  }
}
