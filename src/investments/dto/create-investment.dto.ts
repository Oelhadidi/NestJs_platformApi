import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreateInvestmentDto {
  @IsUUID()
  @IsNotEmpty()
  projectId: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;
} 