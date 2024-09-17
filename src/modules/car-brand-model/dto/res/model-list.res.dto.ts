import { ModelResDto } from './model.res.dto';

export class ModelListResDto {
  data: ModelResDto[];
  meta: { limit: number; offset: number; total: number };
}
