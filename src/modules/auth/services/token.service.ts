import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { Config, JwtConfig } from '../../../configs/config.type';
import { TokenType } from '../enums/token-type.enum';
import { JwtPayload } from '../types/jwt-payload.type';
import { TokenResDto } from '../dto/res/token.res.dto';

@Injectable()
export class TokenService {
  private jwtConfig: JwtConfig;

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService<Config>,
  ) {
    this.jwtConfig = this.configService.get<JwtConfig>('jwt');
  }

  public async generateAuthTokens(payload: JwtPayload): Promise<TokenResDto> {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.jwtConfig.accessSecret,
      expiresIn: this.jwtConfig.accessExpiresIn,
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.jwtConfig.refreshSecret,
      expiresIn: this.jwtConfig.refreshExpiresIn,
    });

    return { accessToken, refreshToken };
  }

  public async verifyToken(
    token: string,
    type: TokenType,
  ): Promise<JwtPayload> {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: this.getSecret(type),
      });
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('invalid token');
    }
  }

  private async generateToken(
    payload: JwtPayload,
    type: TokenType,
  ): Promise<string> {
    const secret = this.getSecret(type);
    const expiresIn = this.getExpiresIn(type);

    return await this.jwtService.signAsync(payload, { expiresIn, secret });
  }
  //todo

  private getSecret(type: TokenType): string {
    let secret: string;
    switch (type) {
      case TokenType.ACCESS:
        secret = this.jwtConfig.accessSecret;
        break;
      case TokenType.REFRESH:
        secret = this.jwtConfig.refreshSecret;
        break;
      default:
        throw new Error('Unknown token type');
    }
    return secret;
  }

  private getExpiresIn(type: TokenType): number {
    switch (type) {
      case TokenType.ACCESS:
        return this.jwtConfig.accessExpiresIn;
      case TokenType.REFRESH:
        return this.jwtConfig.refreshExpiresIn;
    }
  }
}
