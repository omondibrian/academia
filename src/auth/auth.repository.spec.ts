import { UserSchema, User } from '../shared/userDTO';
import * as mongoose from 'mongoose';
import { AuthDataService } from './auth_data.service';
const userModel: mongoose.Model<User> = mongoose.model('UserModel', UserSchema);

import AuthRepository from './auth.repository';
import { initMongo } from '../../test/testutils/db';
import { TRepuser, TRepuser2 } from '../../test/testutils/test.constants';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('AuthRepository', () => {
  beforeAll(async () => {
    await initMongo();
  }, 20);

  afterAll(async () => {
    await userModel.db.model('UserModel').remove({});
    await userModel.db.close();
    await userModel.db.dropCollection('testDb');
  }, 300);
  let service: AuthDataService;
  let repo: AuthRepository;

  beforeAll(() => {
    service = new AuthDataService(userModel);
    repo = new AuthRepository(service);
  });

  describe('registerUser ', () => {
    it('should register new user without errors', async () => {
      //act
      const result = await repo.registerUser(TRepuser2);
      //assert
      expect(result.user.id).toBeTruthy();
      const { name, email, profileImage, mobileNumber, role } = result.user;
      expect({ name, email, role, profileImage, mobileNumber }).toStrictEqual({
        name: TRepuser.name,
        email: TRepuser.email,
        role: TRepuser.role,
        profileImage: TRepuser.profileImage,
        mobileNumber: TRepuser.mobileNumber,
      });
      expect(result.user.password).not.toMatch(TRepuser.password);
    });
    it('should throw error if user already exists', async () => {
      expect(repo.registerUser(TRepuser2)).rejects.toThrowError(
        new HttpException('user already exists', HttpStatus.NOT_ACCEPTABLE),
      );
    });
  });

  describe('login', () => {
    const mockUser = {
      name: TRepuser2.name,
      password: TRepuser2.password,
    };
    it('should login user if the provided login details are correct', async () => {
      const result = await repo.loginUser(mockUser);
      expect(result.token).toBeDefined();
    });

    it('should throw error when provided wrong password', async () => {
      const mockUser = {
        name: TRepuser2.name,
        password: 'wrongPassword',
      };
      expect(repo.loginUser(mockUser)).rejects.toThrowError(
        new HttpException(
          'Error authenticating please try again',
          HttpStatus.UNAUTHORIZED,
        ),
      );
    });
  });

  describe('validatejwt', () => {
    it('should call get user data service passing in the right parameters', async () => {
      jest.spyOn(service, 'getUser');
      await repo.validatejwt({ email: TRepuser2.email });
      expect(service.getUser).toHaveBeenCalled();
      expect(service.getUser).toHaveBeenCalledWith({ email: TRepuser2.email });
    });
  });
  describe('updateUserProfile', () => {
    it("should successfully update user's password", async () => {
      const result = await repo.updateUserProfile(
        { email: TRepuser2.email },
        { password: 'testingupdatepass' },
      );
      expect(result.password).toBeDefined();
    });
    it("should successfully update user's image", async () => {
      const result = await repo.updateUserProfile(
        { email: TRepuser2.email },
        { file: 'updateimagepath' },
      );
      console.log(result);
      expect(result.profileImage).toBeTruthy();
    });
    // it("should throw an error when updating user's profile is not successful", async () => {
    //   jest.spyOn(service, 'updateUser').mockImplementation(() => {
    //     throw new Error();
    //   });
    //   expect(
    //     repo.updateUserProfile(
    //       { email: TRepuser2.email },
    //       { password: TRepuser2.password },
    //     ),
    //   ).rejects.toThrowError(
    //     new HttpException(
    //       'Error while updating profile',
    //       HttpStatus.INTERNAL_SERVER_ERROR,
    //     ),
    //   );
    // });
  });

  describe('forgotpass', () => {
    it('should automatically reset your password returning the new password', async () => {
      //act
      const result = await repo.forgotpass(TRepuser2.email);
      //assert
      expect(result.secreateToken).toBeDefined();
    });
    // it('should throw an error when reseting user\'s password is not successful',async ()=>{
    //   jest.spyOn(service,'updateUser').mockImplementation(()=>{
    //     throw new Error()
    //   })
    //   expect(repo.forgotpass(TRepuser2.email)).rejects.toThrowError(
    //     new HttpException(
    //       'Error while updating profile',
    //       HttpStatus.INTERNAL_SERVER_ERROR,
    //     ),
    //   );
    // })
  });

  describe('deleteUserAccount', () => {
    it('should successfully delete users account', async () => {
      const result = await repo.deleteUserAccount({ email: TRepuser2.email });

      console.log(result);
      expect(result).toBeTruthy();
    });
    it('should throw an error when deleting user account is not successful', async () => {
      jest.spyOn(service, 'deleteUserAccount').mockImplementation(() => {
        throw new Error();
      });
      expect(
        repo.deleteUserAccount({ email: TRepuser2.email }),
      ).rejects.toThrowError(
        new HttpException(
          'Error while deleting account',
          HttpStatus.NON_AUTHORITATIVE_INFORMATION,
        ),
      );
    });
  });
});
