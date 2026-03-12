// Token 存储使用 localStorage（与 intelligent-community-node 后端联调）
const TokenKey = 'Admin-Token'

export function getToken(): string | null {
  return localStorage.getItem(TokenKey)
}

export function setToken(token: string): void {
  localStorage.setItem(TokenKey, token)
}

export function removeToken(): void {
  localStorage.removeItem(TokenKey)
}
