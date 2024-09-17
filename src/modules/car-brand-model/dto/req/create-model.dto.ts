import { PickType } from '@nestjs/swagger';
import { BaseBrandModelReqDto } from './base-brand-model.req.dto';

export class CreateModelDto extends PickType(BaseBrandModelReqDto, [
  'brand_name',
  'model_name',
]) {}
