import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'timeslots',
  timestamps: false,
})
export class Timeslot extends Model<Timeslot> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  begin: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  end: Date;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;
}
