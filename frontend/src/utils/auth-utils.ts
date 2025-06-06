const ACCESS_TOKEN_KEY = 'access_token';
const EXPIRES_AT_KEY = 'expires_at';


export function isAccessTokenExpired(): boolean {
  const expiresAt = localStorage.getItem(EXPIRES_AT_KEY);
  return !expiresAt || Date.now() >= Number(expiresAt);
}

export function getAccessToken(): string | null {
    if (isAccessTokenExpired()){
        return null
    }
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token: string, expiresInSeconds: number) {
  const expiresAt = (Date.now() + expiresInSeconds * 1000).toString();
  console.log(expiresAt)
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
  localStorage.setItem(EXPIRES_AT_KEY, expiresAt);
}

export function removeAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(EXPIRES_AT_KEY);
}
