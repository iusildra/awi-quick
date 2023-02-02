import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'volunteer_assignments',
  timestamps: false,
})
export class VolunteerAssignment extends Model<VolunteerAssignment> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    // TODO: add foreign key
  })
  volunteerId: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
    // TODO: add foreign key
  })
  zoneId: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
    // TODO: add foreign key
  })
  zoneNumber: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
    // TODO: add foreign key
  })
  timeslotId: number;
}
