import { EntityName } from 'src/common/enums/entity.enum';
import { Roles } from 'src/common/enums/roles.enum';
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class Migrations1722866722413 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: EntityName.User,
        columns: [
          {
            name: 'id',
            isPrimary: true,
            type: 'serial',
            isNullable: false,
          },
          {
            name: 'profileId',
            isPrimary: true,
            type: 'int',
            isNullable: true,
            isUnique: true,
          },
          {
            name: 'username',
            type: 'character varying(50)',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'phone',
            type: 'character varying(12)',
            isNullable: true,
            isUnique: true,
          },
          {
            name: 'verify_phone',
            type: 'boolean',
            isNullable: true,
            default: false,
          },
          {
            name: 'verify_email',
            type: 'boolean',
            isNullable: true,
            default: false,
          },
          {
            name: 'password',
            type: 'varchar(20)',
            isNullable: true,
            default: false,
          },
          {
            name: 'email',
            type: 'character varying(100)',
            isNullable: true,
            isUnique: true,
          },
          {
            name: 'new_email',
            type: 'varchar',
            isNullable: true,
            isUnique: false,
          },
          {
            name: 'role',
            type: 'enum',
            enum: [Roles.ADMIN, Roles.USER],
          },
        ],
      }),
      true,
    );

    // const balance = await queryRunner.hasColumn(EntityName.User, 'balance');
    // if (!balance) {
    //   // @ts-ignore
    //   await queryRunner.addColumn(EntityName.User, {
    //     name: 'balance',
    //     type: 'numeric',
    //     default: 0,
    //     isNullable: true,
    //   });
    // }

    // const username = await queryRunner.hasColumn(EntityName.User, 'username');
    // if (!username) {
    //   // @ts-ignore
    //   await queryRunner.changeColumn(
    //     EntityName.User,
    //     'username',
    //     new TableColumn({
    //       name: 'username',
    //       type: 'character varying(50)',
    //       isNullable: false,
    //       isUnique: true,
    //     }),
    //   );
    // }

    // await queryRunner.query(
    //   `ALTER TABLE user RENAME COLUMN phone TO mobile`
    // );

    await queryRunner.createTable(
      new Table({
        name: EntityName.Profile,
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'userId',
            type: 'int',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'nick_name',
            type: 'varchar(50)',
            isNullable: true,
          },
          {
            name: 'bio',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'image_profile',
            type: 'varchar',
            isNullable: true,
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      EntityName.User,
      new TableForeignKey({
        columnNames: ['profileId'],
        referencedColumnNames: ['id'],
        referencedTableName: EntityName.Profile,
      }),
    );
    await queryRunner.createForeignKey(
      EntityName.Profile,
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: EntityName.User,
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.dropColumn(EntityName.User, 'balance');
    
    const profile = await queryRunner.getTable(EntityName.Profile);
    const userForeignKey = profile.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('userId') !== -1,
    );
    if (userForeignKey)
      await queryRunner.dropForeignKey(EntityName.Profile, userForeignKey);

    const user = await queryRunner.getTable(EntityName.User);
    const profileForeignKey = user.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('profileId') !== -1,
    );
    if (profileForeignKey)
      await queryRunner.dropForeignKey(EntityName.User, profileForeignKey);

    await queryRunner.dropTable(EntityName.Profile, true);
    await queryRunner.dropTable(EntityName.User, true);
  }
}
