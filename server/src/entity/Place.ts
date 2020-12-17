import {
  Entity, Column, PrimaryGeneratedColumn, BaseEntity,
} from 'typeorm';

@Entity()
export default class Place extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column('varchar', { array: true })
  indigenousNames!: string[];

  @Column()
  indigenousPeople!: string;

  @Column('text')
  indigenousNameMeaning!: string;

  @Column('real')
  latitude!: number;

  @Column('real')
  longitude!: number;
}
