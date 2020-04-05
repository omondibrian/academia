import { UserSchema, User } from '../shared/userDTO';
import * as mongoose from 'mongoose';
import { AuthDataService } from './auth_data.service';
const userModel: mongoose.Model<User> = mongoose.model('UserModel', UserSchema);

import AuthRepository from './auth.repository';
import { initMongo } from '../../test/testutils/db';
import { TRepuser, TRepuser2 } from '../../test/testutils/test.constants';

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
  });
});
