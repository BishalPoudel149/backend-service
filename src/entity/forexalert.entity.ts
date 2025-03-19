// src/entities/forex-alert.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class ForexAlert {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  baseCurrency: string; // e.g., "EUR"

  @Column()
  targetCurrency: string; // e.g., "USD"

  @Column('decimal', { precision: 10, scale: 4 })
  lowThreshold: number; // e.g., 1.10

  @Column('decimal', { precision: 10, scale: 4 })
  highThreshold: number; // e.g., 1.20

  @Column({ default: false })
  isTriggered: boolean; // To track if the alert has been triggered
}