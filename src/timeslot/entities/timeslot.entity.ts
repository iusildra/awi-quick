import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'timeslots',
})
export class Timeslot extends Model<Timeslot> {
  @Column({
    type: DataType.DATEONLY,
    primaryKey: true,
  })
  date: Date;

  @Column({
    type: DataType.TIME,
    primaryKey: true,
  })
  begin: string;

  @Column({
    type: DataType.TIME,
    allowNull: false,
  })
  end: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;
}
