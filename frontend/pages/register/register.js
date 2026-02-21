// pages/register/register.js
const app = getApp();
const request = require('../../common/utils/request.js');

Page({
  data: {
    username: '',
    password: '',
    confirmPassword: '',
    email: '',           // 手机号改为邮箱
    code: '',
    loading: false,
    countdown: 0,
    countdownTimer: null
  },

  onUnload() {
    if (this.data.countdownTimer) clearInterval(this.data.countdownTimer);
  },

  onUsernameInput(e) { this.setData({ username: e.detail.value }); },
  onPasswordInput(e) { this.setData({ password: e.detail.value }); },
  onConfirmPasswordInput(e) { this.setData({ confirmPassword: e.detail.value }); },
  onEmailInput(e) { this.setData({ email: e.detail.value }); },    // 邮箱输入
  onCodeInput(e) { this.setData({ code: e.detail.value }); },

  // 发送邮箱验证码（后端暂未接入，仅前端占位）
  getCode() {
    const { email, countdown } = this.data;
    if (!email.trim()) return this.showErrorToast('请输入邮箱');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return this.showErrorToast('邮箱格式不正确');
    if (countdown > 0) return;

    wx.showLoading({ title: '发送中...', mask: true });
    
    // 模拟发送请求（之后替换为真实云函数）
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({ title: '验证码已发送至邮箱', icon: 'success' });

      this.setData({ countdown: 60 });
      const timer = setInterval(() => {
        let cd = this.data.countdown - 1;
        if (cd <= 0) {
          clearInterval(timer);
          this.setData({ countdown: 0, countdownTimer: null });
        } else {
          this.setData({ countdown: cd });
        }
      }, 1000);
      this.setData({ countdownTimer: timer });
    }, 1500);
  },

  async onRegisterTap() {
    const { username, password, confirmPassword, email, code } = this.data;
    if (!username.trim()) return this.showErrorToast('请输入用户名');
    if (!password.trim()) return this.showErrorToast('请输入密码');
    if (password.length < 6) return this.showErrorToast('密码至少6位');
    if (password !== confirmPassword) return this.showErrorToast('两次密码不一致');
    if (!email.trim()) return this.showErrorToast('请输入邮箱');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return this.showErrorToast('邮箱格式不正确');
    if (!code.trim()) return this.showErrorToast('请输入验证码');

    this.setData({ loading: true });
    wx.showLoading({ title: '注册中...', mask: true });

    try {
      await request.post('/auth/register', {
        username: username.trim(),
        password,
        email: email.trim(),
        code: code.trim()
      }, false);
      wx.hideLoading();
      this.setData({ loading: false });
      wx.showToast({ title: '注册成功', icon: 'success', duration: 1500 });
      setTimeout(() => wx.redirectTo({ url: '/pages/login/login' }), 1500);
    } catch (err) {
      wx.hideLoading();
      this.setData({ loading: false });
      this.showErrorToast(err.message || '注册失败');
    }
  },

  goToLogin() { wx.redirectTo({ url: '/pages/login/login' }); },
  onForgetPasswordTap() { wx.navigateTo({ url: '/pages/forget-password/forget-password' }); },

  showErrorToast(msg) { wx.showToast({ title: msg, icon: 'none', duration: 2000 }); }
});