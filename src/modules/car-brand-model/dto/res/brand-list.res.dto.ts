import { BrandResDto } from './brand.res.dto';

export class BrandListResDto {
  data: BrandResDto[];
  meta: { total: number; limit: number; offset: number };
}
