import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/shared/userDTO';
import { SharedServices } from 'src/shared/shared.module';
import { JwtStrategy } from './jwt.strategy';
@Module({
  imports: [
    SharedServices,
    MongooseModule.forFeature([{ name: 'UserModel', schema: UserSchema }]),
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtStrategy],
})
export class Auth {}
