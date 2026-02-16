import { inject, injectable } from "tsyringe";
import bcrypt from "bcrypt";
import { OAuth2Client } from "google-auth-library";
import { IAuthService } from "../core/interfaces/services/IAuthService";
import { IAuthRepository } from "../core/interfaces/repository/IAuthRepository";
import { TYPES } from "../core/types";
import { throwError } from "../utils/response";
import { MESSAGES } from "../const/messages";
import { UserResponseMapper } from "../dtos/user/userResponseMapper";
import { IUserDto, IUserLoginDTO } from "../dtos/user/IUserDto";

import { generateAccessToken, generateRefreshToken } from "../lib/jwtToken";

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.IAuthRepository)
    private  _authRepo: IAuthRepository
  ) {}

  async getUser(id: string): Promise<IUserDto> {
    const user = await this._authRepo.findById(id);
    if (!user) throwError(MESSAGES.COMMON.SERVER_ERROR);
    return  UserResponseMapper.toUserResponse(user)
  }

  async googleAuth(googleToken: string): Promise<IUserLoginDTO> {
    try {
      const clientId = process.env.GOOGLE_CLIENT_ID;
      if (!clientId) throwError("Google Client ID not configured");

      const client = new OAuth2Client(clientId);
      
      const ticket = await client.verifyIdToken({
        idToken: googleToken,
        audience: clientId,
      });

      const payload = ticket.getPayload();
      if (!payload || !payload.email) {
        throwError(MESSAGES.AUTH.INVALID_TOKEN);
      }

      const email = payload.email;
      const name = payload.name || email.split("@")[0];

      let user = await this._authRepo.findOne({ email });

      if (user) {
        const token = generateAccessToken(user._id as unknown as string, "user");
        const refreshToken = generateRefreshToken(user._id as unknown as string, "user");
        return UserResponseMapper.toLoginUserResponse(user, token, refreshToken);
      }

      const randomPassword = await bcrypt.hash(Math.random().toString(36), 10);
      user = await this._authRepo.create({
        username: name,
        email: email,
        password: randomPassword,
        isVerified: true,
        authProvider: "google",
      });

      if (!user) throwError(MESSAGES.AUTH.USER_UPDATE_FAILED);

      const token = generateAccessToken(user._id as unknown as string, "user");
      const refreshToken = generateRefreshToken(user._id as unknown as string, "user");
      return UserResponseMapper.toLoginUserResponse(user, token, refreshToken);
    } catch (error: any) {
      console.log("error ",error)
      if (error.message && !error.message.includes("Google")) {
        throw error;
      }
      throwError(MESSAGES.AUTH.INVALID_GOOGLE_CREDENTIALS);
    }
  }
}
