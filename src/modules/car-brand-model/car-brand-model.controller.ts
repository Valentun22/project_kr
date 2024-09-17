import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { IUserData } from '../auth/interfaces/user-data.interface';
import { CarBrandModelService } from './services/car-brand-model.service';
import { CreateBrandDto } from './dto/req/create-brand.dto';
import { BrandResDto } from './dto/res/brand.res.dto';
import { CreateModelDto } from './dto/req/create-model.dto';
import { ModelResDto } from './dto/res/model.res.dto';
import { BrandListResDto } from './dto/res/brand-list.res.dto';
import { ModelListResDto } from './dto/res/model-list.res.dto';
import { BrandAndModelListReqDto } from './dto/req/brand-model-list.req.dto';

@ApiTags('Brand/model')
@Controller('brands')
export class CarBrandModelController {
  constructor(private readonly carBrandModelService: CarBrandModelService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new brand  name' })
  @Post()
  public async createBrand(
    @CurrentUser() userData: IUserData,
    @Body() dto: CreateBrandDto,
  ): Promise<BrandResDto> {
    return await this.carBrandModelService.createBrand(dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new model' })
  @Post('/model')
  public async createModel(
    @CurrentUser() userData: IUserData,
    @Body() dto: CreateModelDto,
  ): Promise<ModelResDto> {
    return await this.carBrandModelService.createModel(dto);
  }
  @ApiBearerAuth()
  @ApiOperation({ summary: 'All brands' })
  @Get('/brands')
  public async getAllBrands(
    @Query() query: BrandAndModelListReqDto,
  ): Promise<BrandListResDto> {
    return await this.carBrandModelService.getAllBrands(query);
  }
  @ApiBearerAuth()
  @ApiOperation({ summary: 'All models' })
  @Get('/models')
  public async getAllModels(
    @Query() query: BrandAndModelListReqDto,
  ): Promise<ModelListResDto> {
    return await this.carBrandModelService.getAllModels(query);
  }
}
