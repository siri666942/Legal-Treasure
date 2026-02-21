// pages/login/login.js
const app = getApp();

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

    // 模拟登录请求（实际应调用云函数或API）
    await this.sleep(1500);
    
    // 模拟登录成功
    const mockResult = {
      success: true,
      token: 'mock_token_' + Date.now(),
      userInfo: { username, role: 'client' } // 角色可根据实际业务确定
    };

    wx.hideLoading();
    this.setData({ loading: false });

    if (mockResult.success) {
      // 🔥 关键修复：设置全局登录状态
      app.globalData.isLogin = true;
      app.globalData.token = mockResult.token;
      app.globalData.userInfo = mockResult.userInfo;

      // 存入缓存，保证小程序重启后依然登录
      wx.setStorageSync('lubao_token', mockResult.token);
      wx.setStorageSync('lubao_userInfo', mockResult.userInfo);

      wx.showToast({ title: '登录成功', icon: 'success', duration: 1500 });

      setTimeout(() => {
        // 跳转到角色选择页（请确认路径正确）
        wx.redirectTo({ url: '/pages/role-select/role-select' });
      }, 1500);
    } else {
      this.showErrorToast(mockResult.message || '登录失败');
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
  sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); },

  onShow() {
    const lastUsername = wx.getStorageSync('last_username');
    if (lastUsername) this.setData({ username: lastUsername });
  },

  onUnload() {
    if (this.data.username.trim()) wx.setStorageSync('last_username', this.data.username);
  },

  onShareAppMessage() { return { title: '律宝 - 专业法律服务平台', path: '/pages/login/login' }; }
});