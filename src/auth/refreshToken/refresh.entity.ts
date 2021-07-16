import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RefreshToken extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    userId: number;

    @Column("varchar", { length: 1000 })
    token: string;

}
