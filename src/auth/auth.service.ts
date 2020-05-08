import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UserDTO } from 'src/shared/userDTO';
import AuthRepository from './auth.repository';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}
  /**
   * @description used to register new users by passing thier details as the payload
   * @param user
   */
  async registerNewUser(
    newUser: UserDTO,
  ): Promise<{
    user: {
      name: string;
      id: string;
      email: string;
      profileImage: string;
    };
    token: string;
  }> {
    try {
      const { user, token } = await this.authRepository.registerUser(newUser);
      return {
        user: {
          name: user.name,
          id: user.id,
          email: user.email,
          profileImage: user.profileImage,
        },
        token,
      };
    } catch (error) {
      throw new HttpException(
        'error registering user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  /**
   * @description used to authenticate uusers
   * @param user
   */
  async login(payload: { name: string; password: string }) {
    return this.authRepository.loginUser(payload);
  }

  async validateJwtPayload(payload: { id: string }) {
    return await this.authRepository.validatejwt(payload);
  }
  /**
   * @description updates user profile
   * @param userId for identification
   * @param payload profile to be updated
   */
  async updateProfile(
    args: {
      userId?: string;
      email?: string;
    },
    payload: {
      password?: string;
      file?: string;
    },
  ) {
    return await this.authRepository.updateUserProfile(
      { ...args },
      { ...payload },
    );
  }
  /**
   * @description used for password recovery
   * @param email of the user
   */
  async forgotPassword(email: string) {
    return await this.authRepository.forgotpass(email);
  }
  /**
   * @description removes a user account parmanetly from the system
   * @param userId to be removed
   * @returns true if successfull false otherwise
   */
  async deleteAccount(args: { id?: string; email?: string }) {
    return await this.authRepository.deleteUserAccount({ ...args });
  }
}
