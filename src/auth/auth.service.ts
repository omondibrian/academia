import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UserDTO } from 'src/shared/userDTO';
import AuthRepository from './auth.repository';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}
  async registerNewUser(
    newUser: UserDTO,
  ): Promise<{
    user: {
      name: string;
      id: string;
      email: string;
      profileImage: string;
    };
    token:string
  }> {
    try {
      const {user,token} = await this.authRepository.registerUser(newUser);
      return {
        user: { name:user.name, id:user.id, email:user.email,profileImage:user.profileImage },
        token
      };
    } catch (error) {
      throw new HttpException(
        'error registering user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
