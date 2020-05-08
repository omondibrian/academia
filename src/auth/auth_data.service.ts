import { Injectable } from '@nestjs/common';
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
    email?: string;
  }): Promise<UserDTO> {
    return await this.UserModel.findOne({ ...args }).exec();
  }

  async saveUser(user: UserDTO): Promise<UserDTO> {
    const User = new this.UserModel(user);
    return await User.save();
  }

  async updateUser(
    updateBy: { id?: string; email?: string; name?: string },
    args: { password?: string; profileImage?: string },
  ) {
    await this.UserModel.updateOne(
      { ...updateBy },
      { $set: { ...args } },
    ).exec();
  }
  async deleteUserAccount(args: { id?: string; email?: string }) {
    return await this.UserModel.findOneAndDelete({ ...args }).exec();
  }
}
