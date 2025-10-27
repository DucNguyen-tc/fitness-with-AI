import { PartialType } from '@nestjs/mapped-types';
import { CreatePlanDto } from './creation-plan.dto';

export class UpdatePlanDto extends PartialType(CreatePlanDto) {}
