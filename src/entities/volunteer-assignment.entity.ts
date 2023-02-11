import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';

import { Timeslot } from './timeslot.entity';
import { Volunteer } from './volunteer.entity';
import { Zone } from './zone.entity';

@Table({
  tableName: 'volunteer_assignments',
  timestamps: false,
})
export class VolunteerAssignment extends Model<VolunteerAssignment> {
  @ForeignKey(() => Volunteer)
  @Column({
    primaryKey: true,
    type: DataType.UUID,
  })
  volunteerId: string;

  @ForeignKey(() => Zone)
  @Column({
    primaryKey: true,
    type: DataType.INTEGER,
  })
  zoneId: number;

  @ForeignKey(() => Timeslot)
  @Column({
    primaryKey: true,
    type: DataType.INTEGER,
  })
  timeslotId: number;
}
