// pages/login/login.js
const app = getApp();
const request = require('../../common/utils/request.js');

Page({
  data: {
    username: '',
    password: '',
    loading: false
  },

  onLoad() {
    // 如果已登录，直接跳转到角色选择（避免重复登录）
    if (app.globalData.isLogin) {
      wx.redirectTo({ url: '/pages/role-select/role-select' });
    }
  },

  onUsernameInput(e) { this.setData({ username: e.detail.value }); },
  onPasswordInput(e) { this.setData({ password: e.detail.value }); },

  async onLoginTap() {
    const { username, password } = this.data;
    if (!username.trim()) return this.showErrorToast('请输入用户名');
    if (!password.trim()) return this.showErrorToast('请输入密码');
    if (password.length < 6) return this.showErrorToast('密码至少6位');

    this.setData({ loading: true });
    wx.showLoading({ title: '登录中...', mask: true });

    try {
      const { data } = await request.post('/auth/login', { username: username.trim(), password }, false);
      const token = data.access_token;
      const user = data.user || {};
      const userInfo = {
        userId: user.id,
        username: user.username,
        role: user.role || null,
        avatar: user.avatar || null,
        phone: user.phone || null,
        email: user.email || null
      };

      wx.hideLoading();
      this.setData({ loading: false });

      app.globalData.isLogin = true;
      app.globalData.token = token;
      app.globalData.userInfo = userInfo;
      app.globalData.userRole = userInfo.role || null;

      wx.setStorageSync('lubao_token', token);
      wx.setStorageSync('lubao_userInfo', userInfo);
      wx.setStorageSync('lubao_userRole', userInfo.role || null);

      wx.showToast({ title: '登录成功', icon: 'success', duration: 1500 });
      setTimeout(() => {
        wx.redirectTo({ url: '/pages/role-select/role-select' });
      }, 1500);
    } catch (err) {
      wx.hideLoading();
      this.setData({ loading: false });
      this.showErrorToast(err.message || '登录失败');
    }
  },

  // 快速体验
  onQuickExperience() {
    this.setData({ username: 'demo_user', password: '123456' });
    setTimeout(() => this.onLoginTap(), 300);
  },

  onRegisterTap() { wx.navigateTo({ url: '/pages/register/register' }); },
  onForgetPasswordTap() { wx.navigateTo({ url: '/pages/forget-password/forget-password' }); },

  showErrorToast(msg) { wx.showToast({ title: msg, icon: 'none', duration: 2000 }); },

  onShow() {
    const lastUsername = wx.getStorageSync('last_username');
    if (lastUsername) this.setData({ username: lastUsername });
  },

  onUnload() {
    if (this.data.username.trim()) wx.setStorageSync('last_username', this.data.username);
  },

  onShareAppMessage() { return { title: '律宝 - 专业法律服务平台', path: '/pages/login/login' }; }
});