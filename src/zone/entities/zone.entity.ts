import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'zones',
})
export class Zone extends Model<Zone> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
  })
  num: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;
}
