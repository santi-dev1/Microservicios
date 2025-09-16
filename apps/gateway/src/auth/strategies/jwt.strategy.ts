import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { MS_USERS } from '@app/common';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        cs: ConfigService,
        @Inject(MS_USERS) private readonly usersClient: ClientProxy,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: cs.get('JWT_SECRET'),
        });
    }
    async validate(payload: any) {
        const user = await firstValueFrom(
            this.usersClient.send({ users: 'find-one' }, { id: payload.sub }),
        );
        if (!user) throw new UnauthorizedException('User not found');
        return user; 
    }
}