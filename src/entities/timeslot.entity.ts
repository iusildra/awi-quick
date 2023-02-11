import {
  Table,
  Column,
  Model,
  DataType,
  BelongsToMany,
} from 'sequelize-typescript';
import { VolunteerAssignment } from './volunteer-assignment.entity';
import { Volunteer } from './volunteer.entity';
import { Zone } from './zone.entity';

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

  @BelongsToMany(() => Zone, {
    through: { model: () => VolunteerAssignment, unique: false },
  })
  zones: Zone[];

  @BelongsToMany(() => Volunteer, {
    through: { model: () => VolunteerAssignment, unique: false },
  })
  volunteers: Volunteer[];
}
