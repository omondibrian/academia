import { AuthService } from './auth.service';
import AuthRepository from './auth.repository';
import { User, UserSchema, UserDTO } from '../shared/userDTO';
import { AuthDataService } from './auth_data.service';
import * as mongoose from 'mongoose';
import { initMongo } from '../../test/testutils/db';
import { newUser } from '../../test/testutils/test.constants';

const userModel: mongoose.Model<User> = mongoose.model('UserModel', UserSchema);

describe('AuthService', () => {
  beforeAll(async () => {
    await initMongo();
  }, 20);

  afterAll(async () => {
    await userModel.db.close();
    await userModel.db.dropCollection('testDb');
  }, 300);
  let mockAuthRepository: AuthRepository;
  let service: AuthService;
  let data: AuthDataService;

  beforeAll(() => {
    data = new AuthDataService(userModel);
    mockAuthRepository = new AuthRepository(data);
    service = new AuthService(mockAuthRepository);
  });
  describe('Register new User ', () => {
    it('should register new user based on the details passed to the repository', async () => {
      //act
      const result = await service.registerNewUser(newUser);
      //assert
      expect(result).toBeDefined();
      const { name, email, profileImage } = result.user;
      expect({ name, email, profileImage }).toStrictEqual({
        name: newUser.name,
        email: newUser.email,
        profileImage: newUser.profileImage,
      });
      expect(result.token).toBeTruthy();
    });
  });
  describe('validateJwtPayload', () => {
    it('should return  user when passed a valid token', async () => {
      ///arrange
      jest.spyOn(service, 'validateJwtPayload').mockImplementation(() => {
        return new Promise<UserDTO>(res => res(newUser));
      });
      //act
      const result = await service.validateJwtPayload({ id: '1' });
      //assert
      expect(result).toBeDefined();
    });
  });
  describe('login', () => {
    it('should return the users details and a valid token', async () => {
      //assert
      const result = await service.login({
        name: newUser.name,
        password: newUser.password,
      });
      expect(result).toBeTruthy();
      expect(result.user).toBeDefined();
      expect(result.token).toBeTruthy();
    });
  });
});
