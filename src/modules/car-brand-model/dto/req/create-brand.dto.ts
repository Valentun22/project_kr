import { PickType } from '@nestjs/swagger';
import { BaseBrandModelReqDto } from './base-brand-model.req.dto';

export class CreateBrandDto extends PickType(BaseBrandModelReqDto, [
  'brand_name',
]) {}
