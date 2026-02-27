import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateGameDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100000)
  startingChips?: number;
}
