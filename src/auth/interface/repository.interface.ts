import { UserDTO } from "src/shared/userDTO";

export interface IRepository {
    saveUser(user:UserDTO):Promise<UserDTO>
    getUser(args:{id?:string,mobileNumber?:number}):Promise<UserDTO>
}