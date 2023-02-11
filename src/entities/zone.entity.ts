import {
  Table,
  Column,
  Model,
  DataType,
  BelongsToMany,
} from 'sequelize-typescript';
import { GameZone, Game, Volunteer, VolunteerAssignment, Timeslot } from './';

@Table({
  tableName: 'zones',
  timestamps: false,
})
export class Zone extends Model<Zone> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  // TODO: rework associations for it to be part of PK
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  num: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @BelongsToMany(() => Game, () => GameZone)
  games: Game[];

  @BelongsToMany(() => Volunteer, {
    through: { model: () => VolunteerAssignment, unique: false },
  })
  volunteers: Volunteer[];

  @BelongsToMany(() => Timeslot, {
    through: { model: () => VolunteerAssignment, unique: false },
  })
  timeslots: Timeslot[];
}
