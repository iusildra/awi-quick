import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'game_zone',
  timestamps: false,
})
export class GameZone extends Model<GameZone> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    // TODO: add foreign key
  })
  zoneId: number;

  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    // TODO: add foreign key
  })
  zoneNumber: number;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    primaryKey: true,
    // TODO: add foreign key
  })
  gameId: string;
}
