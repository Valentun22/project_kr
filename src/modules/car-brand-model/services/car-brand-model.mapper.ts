import { CarBrandEntity } from '../../../database/entities/car-brand.entity';
import { CarModelEntity } from '../../../database/entities/car-model.entity';
import { BrandResDto } from '../dto/res/brand.res.dto';
import { ModelResDto } from '../dto/res/model.res.dto';
import { BrandListResDto } from '../dto/res/brand-list.res.dto';
import { ModelListResDto } from '../dto/res/model-list.res.dto';
import { BrandAndModelListReqDto } from '../dto/req/brand-model-list.req.dto';

export class CarBrandModelMapper {
  public static brandResDto(carBrandEntity: CarBrandEntity): BrandResDto {
    return {
      id: carBrandEntity.id,
      brand_name: carBrandEntity.brand_name,
    };
  }

  public static brandListResDto(
    entities: BrandResDto[],
    total: number,
    query: BrandAndModelListReqDto,
  ): BrandListResDto {
    return {
      data: entities.map(this.brandResDto),
      meta: {
        limit: query.limit,
        offset: query.offset,
        total,
      },
    };
  }
  public static modelResDto(carModelEntity: CarModelEntity): ModelResDto {
    return {
      id: carModelEntity.id,
      model_name: carModelEntity.model_name,
      brand_name: carModelEntity.car_brand
        ? carModelEntity.car_brand.brand_name
        : null,
    };
  }

  public static ModelListResDto(
    entities: ModelResDto[],
    total: number,
    query: BrandAndModelListReqDto,
  ): ModelListResDto {
    return {
      data: entities.map(this.modelResDto),
      meta: {
        limit: query.limit,
        offset: query.offset,
        total,
      },
    };
  }
}
