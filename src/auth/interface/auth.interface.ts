import { UserDTO } from 'src/shared/userDTO';

export interface IAuthRepository {
  /**
   * @description used to register new users by passing thier details as the payload
   * @param user
   */
  registerUser(user: UserDTO): Promise<{ token: string; user: any }>;

  /**
   * @description used to authenticate uusers
   * @param user
   */
  loginUser(user: {
    readonly name: string;
    readonly password: string;
  }): Promise<{ user: UserDTO; token: string }>;

  /**
   * @description updates user profile
   * @param userId for identification
   * @param payload profile to be updated
   */
  updateUserProfile(userId: string, payload: any);

  /**
   * @description removes a user account parmanetly from the system
   * @param userId to be removed
   * @returns true if successfull false otherwise
   */
  deleteUserAccount(userId: string): boolean;

  /**
   * @description used to reset user password
   * @param userId to update password
   * @param newPass new password
   */
  resetPass(userId: string, newPass: string): boolean;

  /**
   * @description used for password recovery
   * @param email of the user
   */
  forgotpass(email: string);
}
