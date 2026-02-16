export type GoogleAuthPayload = {
  googleToken: string;
};

export type User = {
  userId: string;
  name: string;
  email: string;
  isVerified: boolean;
  authProvider?: "google";
};
