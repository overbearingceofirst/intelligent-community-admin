import request from "@/utils/request";
import type {
  SysRegister,
  LoginInfoResult,
  UserInfoResult,
  CaptchaInfoResult,
  AjaxResult,
} from "@/types";

// 登录方法
export function login(
  username: string,
  password: string,
  code: string,
  uuid: string,
): Promise<LoginInfoResult> {
  const data = {
    username,
    password,
    code,
    uuid,
  };
  const loginUrl = import.meta.env.VITE_APP_LOGIN_API || "/login";

  return request({
    url: loginUrl,
    headers: {
      isToken: false,
      repeatSubmit: false,
    },
    method: "post",
    data: data,
  }).then((res: any) => {
    console.log("Login response:", res);
    // 兼容后端不同的返回格式：
    // 1) { code, msg, token }
    // 2) { code, msg, data: { token } }
    // 3) { code, msg, data: { access_token } }
    // 4) { code, msg, access_token }
    // 统一将 token 放到顶层的 token 字段，方便上层调用（如 setToken(res.token)）
    if (!res) return res;
    if (res.token) return res;
    // data 里可能包含 token 或 access_token
    const d = res.data || {};
    if (d.token) {
      res.token = d.token;
      return res;
    }
    if (d.access_token) {
      res.token = d.access_token;
      return res;
    }
    // 有些后端直接返回 access_token 在顶层
    if (res.access_token) {
      res.token = res.access_token;
      return res;
    }
    return res;
  });
}

// 注册方法
export function register(data: SysRegister): Promise<AjaxResult> {
  const registerUrl =
    import.meta.env.VITE_APP_REGISTER_API || "/api/auth/register";
  return request({
    url: registerUrl,
    headers: {
      isToken: false,
    },
    method: "post",
    data: data,
  }).then((res: any) => {
    // 后端可能返回裸对象 { id, username }，也可能返回 { code,msg,data }
    if (!res) return res;
    // 如果已是 AjaxResult（含 code 字段），直接返回
    if (
      typeof res === "object" &&
      (res.code !== undefined || res.ok !== undefined)
    )
      return res;
    // 否则把返回的对象放在 data 字段中，返回 code=200
    return {
      code: 200,
      msg: "",
      data: res,
    } as AjaxResult;
  });
}

// 获取用户详细信息
export function getInfo(): Promise<UserInfoResult> {
  const infoUrl = import.meta.env.VITE_APP_GETINFO_API || "/api/auth/me";
  return request({
    url: infoUrl,
    method: "get",
  }).then((res: any) => {
    // 后端 /api/auth/me 返回的是 user 对象（未包裹在 { code, msg, data } 中）
    // 将其转换为前端期望的 UserInfoResult 结构：{ user, roles, permissions, ... }
    if (!res) return res;
    if (res.user) return res;
    const userObj = res;
    const roleField =
      userObj.role && typeof userObj.role === "string" ? [userObj.role] : [];
    return {
      code: 200,
      msg: "",
      user: userObj,
      roles: roleField.length ? roleField : ["ROLE_DEFAULT"],
      permissions: [],
    } as UserInfoResult;
  });
}

// 退出方法
export function logout() {
  const logoutUrl = import.meta.env.VITE_APP_LOGOUT_API || "/api/auth/logout";
  return request({
    url: logoutUrl,
    method: "post",
  });
}

// 获取验证码
export function getCodeImg(): Promise<CaptchaInfoResult> {
  // 后端智能社区骨架目前不一定实现验证码接口。
  // 优先使用环境变量覆盖；若未设置，则视为未启用验证码并返回 captchaEnabled=false。
  const captchaUrl = import.meta.env.VITE_APP_CAPTCHA_API || "";
  if (!captchaUrl) {
    return Promise.resolve({
      captchaEnabled: false,
      uuid: "",
      img: "",
    } as CaptchaInfoResult);
  }
  return request({
    url: captchaUrl,
    headers: {
      isToken: false,
    },
    method: "get",
    timeout: 20000,
  })
    .then((res: any) => {
      // 兼容不同后端返回：
      // 1) { uuid, img, captchaEnabled }
      // 2) { code,msg,data: { uuid, img, captchaEnabled } }
      if (!res) return res;
      if (res.uuid || res.img || res.captchaEnabled !== undefined) return res;
      const d = res.data || {};
      return {
        uuid: d.uuid || "",
        img: d.img || "",
        captchaEnabled:
          d.captchaEnabled === undefined ? true : d.captchaEnabled,
      } as CaptchaInfoResult;
    })
    .catch(() => {
      // 请求出错（例如 404），认为未启用验证码
      return { captchaEnabled: false, uuid: "", img: "" } as CaptchaInfoResult;
    });
}
