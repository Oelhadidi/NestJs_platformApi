// src/interests/dto/create-interest.dto.ts
import { IsString } from 'class-validator';

export class CreateInterestDto {
  @IsString()
  name: string;
}
