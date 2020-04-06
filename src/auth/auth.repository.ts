import { IAuthRepository } from './interface/auth.interface';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UserDTO } from 'src/shared/userDTO';
import { AuthDataService } from './auth_data.service';

@Injectable()
export class AuthRepository implements IAuthRepository {
  constructor(private dataService: AuthDataService) {}

  APP_SECRET = process.env.APP_SECRET || 'hdgfkfkfgk';
  /**
   * @description  used to register users in the db
   * @param {*} args
   */
  //   @UsePipes(new JoiValidationPipe(this.Regschema))
  async registerUser(args: UserDTO) {
    const { password, mobileNumber } = args;

    const userToSave = await this.dataService.getUser({ mobileNumber });

    if (userToSave) {
      throw new HttpException('user already exists', HttpStatus.NOT_ACCEPTABLE);
    }
    const encrptedPass = await bcrypt.hash(password, 10);

    const newUser = await this.dataService.saveUser({
      ...args,
      password: encrptedPass,
    });
    const token = await this.signPayload({ id: newUser.id });

    return {
      token,
      user: newUser,
    };
  }
  private async signPayload(payload: { id: string }) {
    return jwt.sign(payload, this.APP_SECRET, {
      expiresIn: '7d',
    });
  }
  async validatejwt(payload: { id: string }) {
    const { id } = payload;
    return await this.dataService.getUser({ id });
  }
  async loginUser(user: { name: string; password: string }) {
    const { name, password } = user;
    const userToLogIn = await this.dataService.getUser({ name });
    const validPass = await bcrypt.compare(password, userToLogIn.password);
    if (!validPass)
      throw new HttpException(
        'Error authenticating please try again',
        HttpStatus.UNAUTHORIZED,
      );
    const payload = { id: userToLogIn.id };
    const token = await this.signPayload(payload);
    return { user: userToLogIn, token };
  }
  updateUserProfile(userId: string, payload: any) {
    throw new Error('Method not implemented.');
  }
  deleteUserAccount(userId: string): boolean {
    throw new Error('Method not implemented.');
  }
  resetPass(userId: string, newPass: string): boolean {
    throw new Error('Method not implemented.');
  }
  forgotpass(email: string) {
    throw new Error('Method not implemented.');
  }
}
export default AuthRepository;
