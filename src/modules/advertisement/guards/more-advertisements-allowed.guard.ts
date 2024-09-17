import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { AccountTypeEnum } from '../../../database/enums/account-type.enum';
import { UserRepository } from '../../repository/services/user.repository';

@Injectable()
export class MoreAdvertisementsAllowedGuard implements CanActivate {
  constructor(private readonly userRepository: UserRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userAdvertisementId = request.params.userId;
    const userWithAdvertisement = await this.userRepository.findOne({
      where: { id: userAdvertisementId },
      relations: ['advertisements'],
    });
    if (
      userWithAdvertisement.accountType === AccountTypeEnum.BASE_ACCOUNT &&
      userWithAdvertisement.advertisements.length > 0
    ) {
      throw new ForbiddenException(
        `Error. To add more ads, upgrade to ${AccountTypeEnum.PREMIUM_ACCOUNT} account.`,
      );
    }
    return true;
  }
}
