import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserValidationSchema } from 'src/shared/user_validation_schema.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/shared/userDTO';
@Module({
  imports: [
    UserValidationSchema,
    MongooseModule.forFeature([{ name: 'UserModel', schema: UserSchema }]),
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class Auth {}
