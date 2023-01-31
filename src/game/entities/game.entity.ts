import { Table, Column, Model, DataType } from 'sequelize-typescript';
import { GameType } from '../dto/create-game.dto';

@Table
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
}
