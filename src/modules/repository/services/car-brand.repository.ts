import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CarBrandEntity } from '../../../database/entities/car-brand.entity';
import { BrandResDto } from '../../car-brand-model/dto/res/brand.res.dto';
import { BrandAndModelListReqDto } from '../../car-brand-model/dto/req/brand-model-list.req.dto';

@Injectable()
export class CarBrandRepository extends Repository<CarBrandEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(CarBrandEntity, dataSource.manager);
  }
  public async getAllBrands(
    query: BrandAndModelListReqDto,
  ): Promise<[BrandResDto[], number]> {
    const qb = this.createQueryBuilder('brands');
    qb.take(query.limit);
    qb.skip(query.offset);
    return await qb.getManyAndCount();
  }
}
