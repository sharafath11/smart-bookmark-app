import { GoogleAuthPayload } from "@/types/user/authTypes";
import { getRequest, postRequest } from "../api";

const get = getRequest;
const post = postRequest;

export const userAuthMethods = {
  googleAuth: (payload: GoogleAuthPayload) => post("/auth/google", payload),
  me: () => get("/auth/me"),
  logout: () => post("/auth/logout", {}),
}
