// src/interests/dto/update-user-interests.dto.ts
import { IsArray, IsInt } from 'class-validator';

export class UpdateUserInterestsDto {
  @IsArray()
  @IsInt({ each: true })
  interestIds: number[];
}
