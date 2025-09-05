import { IsNotEmpty} from 'class-validator';

export class CreateGoalCategoryDto {

  @IsNotEmpty({ message: 'Code không được để trống'})
  code: string;

  @IsNotEmpty({ message: 'Name không được để trống'})
  name: string;

  description: string;

}