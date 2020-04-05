import { UserSchema, User } from '../shared/userDTO';
import * as mongoose from 'mongoose';
import { AuthDataService } from './auth_data.service';
const userModel: mongoose.Model<User> = mongoose.model('UserModel', UserSchema);

import { HttpException, HttpStatus } from '@nestjs/common';
import { initMongo } from '../../test/testutils/db';
import { Tuser } from '../../test/testutils/test.constants';

describe('AuthDataService', () => {
  beforeAll(async () => {
    await initMongo();
  }, 20);

  afterAll(async () => {
    await userModel.db.close();
    await userModel.db.dropCollection('testDb');
  }, 300);
  let service: AuthDataService;

  beforeAll(() => {
    service = new AuthDataService(userModel);
  });

  describe('saveUser ', () => {
    it('should save  the user data in the database', async () => {
      //act
      const result = await service.saveUser(Tuser);
      //assert
      expect(result.id).toBeTruthy();
      const { name, email, profileImage, mobileNumber, role } = result;
      expect({ name, email, role, profileImage, mobileNumber }).toStrictEqual({
        name: Tuser.name,
        email: Tuser.email,
        role: Tuser.role,
        profileImage: Tuser.profileImage,
        mobileNumber: Tuser.mobileNumber,
      });
      //   expect(result.password).not.toMatch(Tuser.password);
    });
  });

  describe('getUser ', () => {
    it('should should fetch the user data', async () => {

      //act
      const result = await service.getUser({ mobileNumber:Tuser.mobileNumber});
      //assert
      expect(result.id).toBeTruthy();
      const { name, email, profileImage, mobileNumber, role } = result;
      expect({ name, email, role, profileImage, mobileNumber }).toStrictEqual({
        name: Tuser.name,
        email: Tuser.email,
        role: Tuser.role,
        profileImage: Tuser.profileImage,
        mobileNumber: Tuser.mobileNumber,
      });
      //   expect(result.password).not.toMatch(Tuser.password);
    });
    it('should throw error if user is not found', async () => {
      expect(
        service.getUser({ mobileNumber: 254787654321 }),
      ).rejects.toThrowError(
        new HttpException('user not found', HttpStatus.NOT_FOUND),
      );
    });
  });
});
