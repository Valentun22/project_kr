import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { RolesGuard } from '../../common/guards/role.guard';
import { RolesEnum } from '../../database/enums/roles.enum';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { IUserData } from '../auth/interfaces/user-data.interface';
import { BadWordsValidation } from './guards/bad-words-validation.guard';
import { MoreAdvertisementsAllowedGuard } from './guards/more-advertisements-allowed.guard';
import { AdvertisementService } from './services/advertisement.service';
import { CreateAdvertisementDto } from './dto/req/create-advertisement.dto';
import { AdvertisementResDto } from './dto/res/advertisement.res.dto';
import { UpdateAdvertisementDto } from './dto/req/update-advertisement.dto';
import { AdvertisementListReqDto } from './dto/req/advertisement-list.req.dto';
import { AdvertisementListResDto } from './dto/res/advertisement-list.res.dto';
import { RoleUser } from '../../common/decorators/check.role';

@ApiTags('Advertisement')
@Controller('advertisements')
export class AdvertisementController {
  constructor(private readonly advertisementService: AdvertisementService) {}

  @ApiBearerAuth()
  @RoleUser(RolesEnum.SELLER, RolesEnum.ADMINISTRATOR, RolesEnum.MANAGER)
  @UseGuards(BadWordsValidation, RolesGuard, MoreAdvertisementsAllowedGuard)
  @ApiOperation({
    summary: 'Allowed for users with SELLER, ADMIN MANAGER role',
  })
  @Post()
  public async create(
    @CurrentUser() userData: IUserData,
    @Body() dto: CreateAdvertisementDto,
  ): Promise<AdvertisementResDto> {
    return await this.advertisementService.create(userData, dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update' })
  @Put(':advertisementId')
  public async update(
    @Param('advertisementId', ParseUUIDPipe) advertisementId: string,
    @CurrentUser() userData: IUserData,
    @Body() dto: UpdateAdvertisementDto,
  ): Promise<AdvertisementResDto> {
    return await this.advertisementService.update(
      userData,
      dto,
      advertisementId,
    );
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get advertisement by id' })
  @Get(':advertisementId')
  public async getById(
    @Param('advertisementId', ParseUUIDPipe) advertisementId: string,
    @CurrentUser() userData: IUserData,
  ): Promise<AdvertisementResDto> {
    return await this.advertisementService.getById(userData, advertisementId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all advertisements' })
  @Get()
  public async getAll(
    @CurrentUser() userData: IUserData,
    @Query() query: AdvertisementListReqDto,
  ): Promise<AdvertisementListResDto> {
    return await this.advertisementService.getAll(userData, query);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete' })
  @Delete(':advertisementId')
  public async delete(
    @Param('advertisementId', ParseUUIDPipe) advertisementId: string,
    @CurrentUser() userData: IUserData,
  ): Promise<void> {
    await this.advertisementService.delete(userData, advertisementId);
  }
}
