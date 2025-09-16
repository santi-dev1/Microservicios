import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { MS_USERS } from '@app/common';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        @Inject(MS_USERS) private readonly usersClient: ClientProxy, 
    ) { }

    async validateUser(email: string, password: string) {
        try {
            const user = await firstValueFrom(
                this.usersClient.send({ cmd: 'validate_user' }, { email, password }),
            );

            if (!user) {
                throw new UnauthorizedException('Invalid credentials');
            }

            return user;
        } catch (error) {
            throw new UnauthorizedException('Invalid credentials');
        }
    }

    async login(user: any) {
        const payload = { sub: user.id, email: user.email };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
