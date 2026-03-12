import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken(): string | undefined {
  // 优先从 localStorage 读取（对接 intelligent-community-node），回退到 Cookie
  return localStorage.getItem(TokenKey) || Cookies.get(TokenKey)
}

export function setToken(token: string): string | undefined {
  localStorage.setItem(TokenKey, token)
  return Cookies.set(TokenKey, token)
}

export function removeToken(): void {
  localStorage.removeItem(TokenKey)
  Cookies.remove(TokenKey)
}
