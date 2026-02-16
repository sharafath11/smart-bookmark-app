const COOKIE_NAME = "sb_auth";

export const setAuthCookie = () => {
  const maxAge = 60 * 60 * 24 * 7;
  const secure =
    typeof window !== "undefined" && window.location.protocol === "https:"
      ? " Secure;"
      : "";
  console.log("[AuthCookie] Setting sb_auth cookie for middleware routing");
  document.cookie = `${COOKIE_NAME}=1; Path=/; Max-Age=${maxAge}; SameSite=Lax;${secure}`;
};

export const clearAuthCookie = () => {
  const secure =
    typeof window !== "undefined" && window.location.protocol === "https:"
      ? " Secure;"
      : "";
  console.log("[AuthCookie] Clearing sb_auth cookie");
  document.cookie = `${COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax;${secure}`;
};

export const authCookieName = COOKIE_NAME;
