import { IsNotEmpty, IsIn, IsOptional, IsNumber, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class TargetMetricsDto {
  @IsOptional()
  @IsNumber()
  weightChange?: number;

  @IsOptional()
  @IsNumber()
  @Min(1, { message: 'Timeframe phải lớn hơn 0' })
  timeframe?: number;

  @IsOptional()
  @IsNumber()
  bodyFatPercentage?: number;
}

export class CreateGoalDto {
  @IsNotEmpty({ message: 'Name không được để trống' })
  name: string;

  description: string;

  @IsNotEmpty({ message: 'Giới tính không được để trống' })
  @IsIn(['Nam', 'Nữ'], { message: 'Giới tính phải là "Nam" hoặc "Nữ"' })
  gender: string;

  @IsNotEmpty({ message: 'goalCategoryId không được để trống' })
  goalCategoryId: string;

@IsOptional()
  @ValidateNested()
  @Type(() => TargetMetricsDto)
  targetMetrics?: TargetMetricsDto;
}
