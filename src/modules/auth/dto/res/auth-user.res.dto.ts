import { TokenResDto } from './token.res.dto';
import { UserResDto } from '../../../user/dto/res/user.res.dto';

export class AuthUserResDto {
  tokens: TokenResDto;
  user: UserResDto;
}
