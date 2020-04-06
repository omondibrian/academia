import { Module } from '@nestjs/common';
import { UserValidationSchema } from './user_validation_schema.service';

@Module({
  imports: [],
  providers: [UserValidationSchema],
  exports: [UserValidationSchema],
})
export class SharedServices {}
