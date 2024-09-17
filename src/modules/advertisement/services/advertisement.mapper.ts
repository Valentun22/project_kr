import { AdvertisementEntity } from '../../../database/entities/advertisement.entity';
import { CarEntity } from '../../../database/entities/car.entity';
import { AdvertisementResDto } from '../dto/res/advertisement.res.dto';
import { AdvertisementListReqDto } from '../dto/req/advertisement-list.req.dto';
import { AdvertisementListResDto } from '../dto/res/advertisement-list.res.dto';

export class AdvertisementMapper {
  public static toResponseDto(
    advertisementEntity: AdvertisementEntity,
    carEntity: CarEntity,
  ): AdvertisementResDto {
    return {
      advertisement_id: advertisementEntity.id,
      title: advertisementEntity.title,
      description: advertisementEntity.description,
      body: advertisementEntity.description,
      status: advertisementEntity.status,
      region: advertisementEntity.region,
      user_id: advertisementEntity.user_id,
      car: {
        car_id: carEntity.id,
        year: carEntity.year,
        color: carEntity.color,
        mileage: carEntity.mileage,
        prise: carEntity.prise,
        currency: carEntity.currency,
        image: carEntity.image,
        availability_of_registration: carEntity.availability_of_registration,
        accidents: carEntity.accidents,
      },
    };
  }

  public static toResponseDtoById(
    advertisementEntity: AdvertisementEntity,
  ): AdvertisementResDto {
    return {
      advertisement_id: advertisementEntity.id,
      title: advertisementEntity.title,
      description: advertisementEntity.description,
      body: advertisementEntity.description,
      status: advertisementEntity.status,
      region: advertisementEntity.region,
      user_id: advertisementEntity.user_id,
      car: advertisementEntity.car
        ? {
            car_id: advertisementEntity.car.id,
            year: advertisementEntity.car.year,
            color: advertisementEntity.car.color,
            mileage: advertisementEntity.car.mileage,
            prise: advertisementEntity.car.prise,
            currency: advertisementEntity.car.currency,
            image: advertisementEntity.car.image,
            accidents: advertisementEntity.car.accidents,
            availability_of_registration:
              advertisementEntity.car.availability_of_registration,
          }
        : null,
    };
  }

  public static ToListResponseDto(
    entities: AdvertisementEntity[],
    total: number,
    query: AdvertisementListReqDto,
  ): AdvertisementListResDto {
    return {
      data: entities.map(this.toResponseDtoById),
      meta: {
        limit: query.limit,
        offset: query.offset,
        total,
      },
    };
  }
}
