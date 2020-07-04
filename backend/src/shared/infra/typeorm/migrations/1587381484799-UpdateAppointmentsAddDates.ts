import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class UpdateAppointmentsAddDates1587381484799
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('appointments', [
      new TableColumn({
        name: 'created_at',
        type: 'timestamp',
        default: 'now()',
        isNullable: false,
      }),
      new TableColumn({
        name: 'updated_at',
        type: 'timestamp',
        default: 'now()',
        isNullable: false,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('appointments', [
      new TableColumn({ name: 'created_at', type: 'timestamp' }),
      new TableColumn({ name: 'updated_at', type: 'timestamp' }),
    ]);
  }
}
