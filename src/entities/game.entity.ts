import {
  Table,
  Column,
  Model,
  DataType,
  BelongsToMany,
} from 'sequelize-typescript';
import { GameType } from '../game/dto/create-game.dto';
import { Zone } from './zone.entity';
import { GameZone } from './game-zone-relation.entity';

@Table({
  tableName: 'games',
  timestamps: false,
})
export class Game extends Model<Game> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.ENUM('child', 'family', 'ambiance', 'initiate', 'expert'),
    allowNull: false,
  })
  type: GameType;

  @BelongsToMany(() => Zone, () => GameZone)
  zones: Zone[];
}
