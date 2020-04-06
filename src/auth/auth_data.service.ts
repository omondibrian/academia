import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { User, UserDTO } from 'src/shared/userDTO';
import { Model } from 'mongoose';
import { IRepository } from './interface/repository.interface';
@Injectable()
export class AuthDataService implements IRepository {
  constructor(
    @InjectModel('UserModel') private readonly UserModel: Model<User>,
  ) {}

  async getUser(args: {
    id?: string;
    mobileNumber?: number;
    name?: string;
  }): Promise<UserDTO> {
    try {
      const result = await this.UserModel.findOne(args).exec();
      // if (!result) throw new Error();
      return result;
    } catch (error) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }
  }

  async saveUser(user: UserDTO): Promise<UserDTO> {
    try {
      const User = new this.UserModel(user);
      return await User.save();
    } catch (error) {
      throw new HttpException(
        'sorry ,,Unable to save user data at the moment try again',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
