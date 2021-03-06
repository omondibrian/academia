import { AuthService } from './auth.service';
import AuthRepository from './auth.repository';
import { User, UserSchema } from '../shared/userDTO';
import { AuthDataService } from './auth_data.service';
import * as mongoose from 'mongoose';
import { initMongo } from '../../test/testutils/db';
import { newUser, Tuser } from '../../test/testutils/test.constants';

const userModel: mongoose.Model<User> = mongoose.model('UserModel', UserSchema);

describe('AuthService', () => {
  beforeAll(async () => {
    await initMongo();
  }, 20);

  afterAll(async () => {
    await userModel.db.close();
    await userModel.db.dropCollection('testDb');
  }, 300);
  describe('Register new User ', () => {
    let mockAuthRepository: AuthRepository;
    let service: AuthService;
    let data: AuthDataService;

    beforeAll(() => {
      data = new AuthDataService(userModel);
      mockAuthRepository = new AuthRepository(data);
      service = new AuthService(mockAuthRepository);
    });

    it('should register new user based on the details passed to the repository', async () => {
      //act
      const result = await service.registerNewUser(newUser);
      //assert
      const { name, email, profileImage } = result.user;
      expect({ name, email, profileImage }).toStrictEqual({
        name: newUser.name,
        email: newUser.email,
        profileImage: newUser.profileImage,
      });
      expect(result.token).toBeTruthy();
    });
  });
});
