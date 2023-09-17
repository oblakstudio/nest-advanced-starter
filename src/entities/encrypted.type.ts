import { EntityProperty, Type, ValidationError } from '@mikro-orm/core';
import { decrypt, encrypt } from 'helper-fns';

export class EncryptedType extends Type {
  private readonly encKey =
    process.env?.ENC_KEY ||
    '38cb2f959c9673796233a0f6b55bcea39601faed9bff415ca9982d2762bdcc45';
  private readonly encIV =
    process.env?.ENC_IV || '7f4b458b0a507b71658959fd191e1975';

  convertToDatabaseValue(value: string | undefined): string {
    if (value && !(typeof value.valueOf() === 'string')) {
      throw ValidationError.invalidType(EncryptedType, value, 'JS');
    }

    return encrypt({
      text: value.toString(),
      config: { key: this.encKey, iv: this.encIV },
    });
  }

  convertToJSValue(value: string): string {
    if (!value) {
      return value;
    }

    return decrypt({
      text: value,
      config: { key: this.encKey, iv: this.encIV },
    });
  }

  getColumnType(property: EntityProperty) {
    return `varchar(${property.length})`;
  }
}
