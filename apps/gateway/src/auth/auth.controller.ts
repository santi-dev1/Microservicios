import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards';

@Controller('auth')
export class AuthController {
    constructor(private readonly auth: AuthService) { }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    login(@Req() req: any) {
        return this.auth.login(req.user);
    }
}
