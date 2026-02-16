import {IUserDto, IUserLoginDTO } from "../../../dtos/user/IUserDto";

export interface IAuthService {
    googleAuth(googleToken: string): Promise<IUserLoginDTO>
    getUser(id:string):Promise<IUserDto>
}
