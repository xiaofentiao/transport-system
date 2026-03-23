/**
 * 用户相关接口配置
 */
const user = {
  /** 用户登录 */
  loginIn: { method: "post", url: "/user/login" },
  /** 用户登出 */
  logout: {method: 'post', url: '/user/logout'},
  /** 获取用户权限 */
  permission: { method: "post", url: "/user/permission" },
  /** 获取验证码 */
  captcha: { method: "get", url: "/user/captcha" },
};

export default user;
