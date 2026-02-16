import { AuthController } from "../../controller/auth.controller";
import { BookmarkController } from "../../controller/bookmark.controller";
import { AuthRepository } from "../../repository/authRepository";
import { BookmarkRepository } from "../../repository/bookmarkRepository";
import { AuthService } from "../../services/auth.Service";
import { BookmarkService } from "../../services/bookmark.Service";
import { IAuthController } from "../interfaces/controllers/IAuth.Controller";
import { IBookmarkController } from "../interfaces/controllers/IBookmark.Controller";
import { IAuthRepository } from "../interfaces/repository/IAuthRepository";
import { IBookmarkRepository } from "../interfaces/repository/IBookmarkRepository";
import { IAuthService } from "../interfaces/services/IAuthService";
import { IBookmarkService } from "../interfaces/services/IBookmarkService";
import { TYPES } from "../types";
import { container } from "tsyringe";

container.registerSingleton<IAuthService>(TYPES.IAuthServices, AuthService);
container.registerSingleton<IAuthController>(TYPES.IAuthController, AuthController);
container.registerSingleton<IAuthRepository>(TYPES.IAuthRepository, AuthRepository);
container.registerSingleton<IBookmarkService>(TYPES.IBookmarkService, BookmarkService);
container.registerSingleton<IBookmarkController>(TYPES.IBookmarkController, BookmarkController);
container.registerSingleton<IBookmarkRepository>(TYPES.IBookmarkRepository, BookmarkRepository);

export { container };
