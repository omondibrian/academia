import { IAuthRepository } from './interface/auth.interface';
import {
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UserDTO } from 'src/shared/userDTO';
import { AuthDataService } from './auth_data.service';


@Injectable()
export class AuthRepository implements IAuthRepository {
  constructor(
    private dataService: AuthDataService,
    
  ) {}
 
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

    const APP_SECRET = process.env.APP_SECRET || 'hdgfkfkfgk';
    const newUser = await this.dataService.saveUser({
      ...args,
      password: encrptedPass,
    });
    const token = jwt.sign({ userId: newUser.id }, APP_SECRET);

    return {
      token,
      user: newUser,
    };
  }

  loginUser(user: any) {
    throw new Error('Method not implemented.');
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
