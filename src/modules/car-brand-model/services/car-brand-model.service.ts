import {
  ConflictException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';

import { CarBrandRepository } from '../../repository/services/car-brand.repository';
import { CarModelRepository } from '../../repository/services/car-model.repository';
import { CarBrandModelMapper } from './car-brand-model.mapper';
import { CreateBrandDto } from '../dto/req/create-brand.dto';
import { BrandResDto } from '../dto/res/brand.res.dto';
import { CreateModelDto } from '../dto/req/create-model.dto';
import { ModelResDto } from '../dto/res/model.res.dto';
import { BrandListResDto } from '../dto/res/brand-list.res.dto';
import { ModelListResDto } from '../dto/res/model-list.res.dto';
import { BrandAndModelListReqDto } from '../dto/req/brand-model-list.req.dto';

@Injectable()
export class CarBrandModelService {
  constructor(
    private readonly carBrandRepository: CarBrandRepository,
    private readonly carModelRepository: CarModelRepository,
  ) {}

  public async createBrand(dto: CreateBrandDto): Promise<BrandResDto> {
    const brandEntity = await this.carBrandRepository.findOneBy({
      brand_name: dto.brand_name,
    });

    if (brandEntity) {
      throw new UnprocessableEntityException('This brand is already exist');
    }
    const newBrand = await this.carBrandRepository.save(
      this.carBrandRepository.create({ ...dto }),
    );
    return CarBrandModelMapper.brandResDto(newBrand);
  }

  public async createModel(dto: CreateModelDto): Promise<ModelResDto> {
    const brandEntity = await this.carBrandRepository.findOneBy({
      brand_name: dto.brand_name,
    });

    if (!brandEntity) {
      throw new UnprocessableEntityException('You need to create brand first');
    }
    const modelEntity = await this.carModelRepository.findOneBy({
      brand_id: brandEntity.id,
      model_name: dto.model_name,
    });
    if (modelEntity) {
      throw new ConflictException('This model is already exist');
    }
    const entity = await this.carModelRepository.save(
      this.carModelRepository.create({
        model_name: dto.model_name,
        brand_id: brandEntity.id,
      }),
    );
    const newModel = await this.carModelRepository.findOneByWithBrand(
      entity.id,
      brandEntity.id,
    );
    return CarBrandModelMapper.modelResDto(newModel);
  }

  public async getAllBrands(
    query: BrandAndModelListReqDto,
  ): Promise<BrandListResDto> {
    const [entities, total] = await this.carBrandRepository.getAllBrands(query);
    return CarBrandModelMapper.brandListResDto(entities, total, query);
  }

  public async getAllModels(
    query: BrandAndModelListReqDto,
  ): Promise<ModelListResDto> {
    const [entities, total] = await this.carModelRepository.getAllModels(query);
    return CarBrandModelMapper.ModelListResDto(entities, total, query);
  }
}
