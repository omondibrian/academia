import { UserSchema, User } from '../shared/userDTO';
import * as mongoose from 'mongoose';
import { AuthDataService } from './auth_data.service';
const userModel: mongoose.Model<User> = mongoose.model('UserModel', UserSchema);

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
      const result = await service.getUser({
        mobileNumber: Tuser.mobileNumber,
      });
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
    // it('should throw error if user is not found', async () => {
    //   //arrange
    //   // jest.spyOn(service,'getUser').mockImplementation(()=>{
    //   //   throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    //   // })
    //   expect(
    //     service.getUser({ mobileNumber: 2547654321 }),
    //   ).rejects.toThrowError(
    //     new HttpException('user not found', HttpStatus.NOT_FOUND),
    //   );
    // });
  });
  describe('update user profile', () => {
    it("should update user's password", async () => {
      await service.updateUser(
        { email: Tuser.email },
        { password: 'testpass' },
      );
      const result = await userModel.findOne({ email: Tuser.email });

      expect(result.password).toEqual('testpass');
    });
    it("should update user's profileImage", async () => {
      await service.updateUser(
        { email: Tuser.email },
        { profileImage: 'testimagepath' },
      );
      const result = await userModel.findOne({ email: Tuser.email });
      //assert
      expect(result.profileImage).toEqual('testimagepath');
    });
  });

  describe('deleteUserAccount', () => {
    it('should delete user account', async () => {
      const result = await service.deleteUserAccount({ email: Tuser.email });
      const isUserAccPresent = await service.getUser({ email: Tuser.email });
      expect(isUserAccPresent).toBeFalsy();

      //assert
      expect(result).toBeTruthy();
    });
  });
});
