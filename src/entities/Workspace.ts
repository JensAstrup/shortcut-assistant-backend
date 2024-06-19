import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

import { User } from '@sb/entities/User'


@Entity()
export class Workspace {
  @PrimaryGeneratedColumn()
    id: number

  @Column({ unique: true })
    shortcutId: string

  @Column()
    name: string

  @Column()
    vectorStorageId: string

  @OneToMany(() => User, user => user.workspace)
    users: User[]

  @CreateDateColumn()
    createdAt: Date

  @UpdateDateColumn()
    updatedAt: Date
}
