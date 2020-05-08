import { IAuthRepository } from './interface/auth.interface';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UserDTO } from 'src/shared/userDTO';
import { AuthDataService } from './auth_data.service';
import { generate } from 'randomstring';

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
  async validatejwt(payload: { id?: string; email?: string }) {
    return await this.dataService.getUser({ ...payload });
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

  async updateUserProfile(
    args: { userId?: string; email?: string },
    payload: { password?: string; file?: string },
  ) {
    try {
      if (payload.password) {
        //encrpte the password
        const encrptedPass = await bcrypt.hash(payload.password, 10);
        await this.dataService.updateUser(
          { ...args },
          { password: encrptedPass },
        );
      }
      if (payload.file) {
        const name = Date.now() + ' ' + payload.file;
        const image = `/uploads/${encodeURIComponent(name)}`;
        await this.dataService.updateUser({ ...args }, { profileImage: image });
      }

      return await this.dataService.getUser({ ...args });
    } catch (error) {
      throw new HttpException(
        'Error while updating profile',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async deleteUserAccount(args: { id?: string; email?: string }) {
    let user: UserDTO;
    try {
      user = await this.dataService.deleteUserAccount({ ...args });
    } catch (error) {
      throw new HttpException(
        'Error while deleting account',
        HttpStatus.NON_AUTHORITATIVE_INFORMATION,
      );
    }

    if (user) return new Promise(res => res(true)) as Promise<boolean>;
  }

  async forgotpass(email: string) {
    try {
      const secreateToken = generate(7);
      //encrpte the password
      const salt = await bcrypt.genSalt(10);
      const encrptedPass = await bcrypt.hash(secreateToken, salt);
      await this.dataService.updateUser(
        { email: email },
        { password: encrptedPass },
      );
      //compose an email
      // const html = `
      //     Hello ${user.name},<br/>
      //     please enter the verification code below to acess your account
      //     please enter the following token<br/>
      //     Token:${secreateToken}<br/>
      //     Have a nice day.
      //     `;
      //send the email
      //  await sendemail(process.env.User,req.body.email,'Password Reset Request',html)
      return {
        message: 'password changed successfully please check your email',
        secreateToken,
      };
    } catch (error) {
      throw new HttpException(
        'Error while updating profile',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
export default AuthRepository;
