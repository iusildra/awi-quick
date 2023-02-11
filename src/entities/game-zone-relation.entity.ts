import { Table, Model, ForeignKey, Column } from 'sequelize-typescript';
import { Game, Zone } from './';

@Table({
  tableName: 'game_zone',
  timestamps: false,
})
export class GameZone extends Model<GameZone> {
  @ForeignKey(() => Zone)
  @Column
  zoneId: number;

  @ForeignKey(() => Game)
  @Column
  gameId: string;
}
