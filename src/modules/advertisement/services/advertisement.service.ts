import {
  ConflictException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';

import { StatusTypeEnum } from '../../../database/enums/status-type.enum';
import { IUserData } from '../../auth/interfaces/user-data.interface';
import { AdvertisementRepository } from '../../repository/services/advertisement.repository';
import { CarRepository } from '../../repository/services/car.repository';
import { CarBrandRepository } from '../../repository/services/car-brand.repository';
import { CarModelRepository } from '../../repository/services/car-model.repository';
import { StatisticRepository } from '../../repository/services/statistic.repository';
import { AdvertisementMapper } from './advertisement.mapper';
import { CurrencyService } from './currency.service';
import { BaseAdvertisementReqDto } from '../dto/req/base-advertisement.req.dto';
import { AdvertisementResDto } from '../dto/res/advertisement.res.dto';
import { UpdateAdvertisementDto } from '../dto/req/update-advertisement.dto';
import { AdvertisementListReqDto } from '../dto/req/advertisement-list.req.dto';
import { AdvertisementListResDto } from '../dto/res/advertisement-list.res.dto';

@Injectable()
export class AdvertisementService {
  constructor(
    private readonly currencyService: CurrencyService,
    private readonly advertisementRepository: AdvertisementRepository,
    private readonly carRepository: CarRepository,
    private readonly carBrandRepository: CarBrandRepository,
    private readonly carModelRepository: CarModelRepository,
    private readonly statisticRepository: StatisticRepository,
  ) {}

  public async create(
    userData: IUserData,
    dto: BaseAdvertisementReqDto,
  ): Promise<AdvertisementResDto> {
    const {
      description,
      body,
      title,
      region,
      car_model,
      car_brand,
      availability_of_registration,
      accidents,
      currency,
      mileage,
      image,
      year,
      prise,
      color,
    } = dto;
    const [brandEntity] = await Promise.all([
      this.carBrandRepository.findOneBy({
        brand_name: car_brand,
      }),
    ]);
    if (!brandEntity) {
      throw new UnprocessableEntityException('There is no such brand');
    }
    const [modelEntity] = await Promise.all([
      this.carModelRepository.findOneBy({
        brand_id: brandEntity.id,
        model_name: car_model,
      }),
    ]);
    if (!modelEntity) {
      throw new UnprocessableEntityException('There is no such model');
    }
    const newAdvertisement = {
      title,
      body,
      description,
      region,
      user_id: userData.userId,
    };
    const newCar = {
      currency,
      mileage,
      image,
      year,
      prise,
      color,
      accidents,
      availability_of_registration,
    };

    const carEntity = await this.carRepository.save(
      this.carRepository.create({
        ...newCar,
        brand_id: brandEntity.id,
        model_id: modelEntity.id,
        user_id: userData.userId,
      }),
    );

    const advertisementEntity = await this.advertisementRepository.save(
      this.advertisementRepository.create({
        ...newAdvertisement,
        car_id: carEntity.id,
        status: StatusTypeEnum.ACTIVE,
      }),
    );
    return AdvertisementMapper.toResponseDto(advertisementEntity, carEntity);
  }

  public async update(
    userData: IUserData,
    dto: UpdateAdvertisementDto,
    advertisementId: string,
  ): Promise<AdvertisementResDto> {
    const {
      description,
      body,
      title,
      color,
      availability_of_registration,
      mileage,
      accidents,
      prise,
    } = dto;
    const advertisementDto = { description, body, title };
    const carDto = {
      color,
      mileage,
      availability_of_registration,
      prise,
      accidents,
    };
    const advertisementEntity = await this.advertisementRepository.findOneBy({
      user_id: userData.userId,
      id: advertisementId,
    });
    if (!advertisementEntity) {
      throw new ConflictException('You cannot update this ad');
    }
    const carEntity = await this.carRepository.findOneBy({
      id: advertisementEntity.car_id,
    });
    await this.advertisementRepository.save(
      this.advertisementRepository.merge(advertisementEntity, advertisementDto),
    );
    await this.carRepository.save(this.carRepository.merge(carEntity, carDto));
    return AdvertisementMapper.toResponseDto(advertisementEntity, carEntity);
  }

  public async getById(
    userData: IUserData,
    advertisementId: string,
  ): Promise<AdvertisementResDto> {
    const advertisementEntity =
      await this.advertisementRepository.getAdvertisementById(advertisementId);
    if (advertisementEntity.user_id !== userData.userId) {
      await this.statisticRepository.save(
        this.statisticRepository.create({ advertisement_id: advertisementId }),
      );
    }
    const { currency, prise } = advertisementEntity.car;
    await this.currencyService.convertPriceToUAH(prise, currency);
    return AdvertisementMapper.toResponseDtoById(advertisementEntity);
  }

  public async getAll(
    userData: IUserData,
    query: AdvertisementListReqDto,
  ): Promise<AdvertisementListResDto> {
    const [entities, total] = await this.advertisementRepository.getAll(query);

    return AdvertisementMapper.ToListResponseDto(entities, total, query);
  }

  public async delete(
    userData: IUserData,
    advertisementId: string,
  ): Promise<void> {
    const advertisementEntity = await this.advertisementRepository.findOneBy({
      user_id: userData.userId,
      id: advertisementId,
    });
    if (!advertisementEntity) {
      throw new ConflictException("I can't remove this ad");
    }
    const carEntity = await this.carRepository.findOneBy({
      id: advertisementEntity.car_id,
    });
    await this.advertisementRepository.delete({ id: advertisementId });

    await this.carRepository.delete({ id: carEntity.id });
  }
}
