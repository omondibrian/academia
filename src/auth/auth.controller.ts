import {  Get, Controller } from '@nestjs/common';
import { AuthService } from "./auth.service";

@Controller()
export class AuthController {
    @Get()
    login(){
        AuthService.name
    }
}
