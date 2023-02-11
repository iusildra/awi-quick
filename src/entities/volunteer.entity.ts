import {
  Table,
  Column,
  Model,
  DataType,
  BelongsToMany,
} from 'sequelize-typescript';
import { Timeslot } from './timeslot.entity';
import { VolunteerAssignment } from './volunteer-assignment.entity';
import { Zone } from './zone.entity';

@Table({
  tableName: 'volunteers',
  timestamps: false,
})
export class Volunteer extends Model<Volunteer> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  username: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  firstName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  lastName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isAdmin: boolean;

  @BelongsToMany(() => Zone, {
    through: { model: () => VolunteerAssignment, unique: false },
  })
  zones: Zone[];

  @BelongsToMany(() => Timeslot, {
    through: { model: () => VolunteerAssignment, unique: false },
  })
  timeslots: Timeslot[];
}
