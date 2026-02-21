// pages/forget-password/forget-password.js
const app = getApp();

Page({
  data: {
    email: '',           // 手机号改为邮箱
    code: '',
    newPassword: '',
    confirmPassword: '',
    loading: false,
    countdown: 0,
    countdownTimer: null
  },

  onUnload() {
    if (this.data.countdownTimer) clearInterval(this.data.countdownTimer);
  },

  onEmailInput(e) { this.setData({ email: e.detail.value }); },
  onCodeInput(e) { this.setData({ code: e.detail.value }); },
  onNewPasswordInput(e) { this.setData({ newPassword: e.detail.value }); },
  onConfirmPasswordInput(e) { this.setData({ confirmPassword: e.detail.value }); },

  // 发送邮箱验证码（模拟）
  getCode() {
    const { email, countdown } = this.data;
    if (!email.trim()) return this.showErrorToast('请输入邮箱');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return this.showErrorToast('邮箱格式不正确');
    if (countdown > 0) return;

    wx.showLoading({ title: '发送中...', mask: true });
    
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

  async onResetPasswordTap() {
    const { email, code, newPassword, confirmPassword } = this.data;
    if (!email.trim()) return this.showErrorToast('请输入邮箱');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return this.showErrorToast('邮箱格式不正确');
    if (!code.trim()) return this.showErrorToast('请输入验证码');
    if (!newPassword.trim()) return this.showErrorToast('请输入新密码');
    if (newPassword.length < 6) return this.showErrorToast('密码至少6位');
    if (newPassword !== confirmPassword) return this.showErrorToast('两次密码不一致');

    this.setData({ loading: true });
    wx.showLoading({ title: '重置中...', mask: true });

    await this.sleep(1500);
    wx.hideLoading();
    this.setData({ loading: false });

    wx.showToast({ title: '密码重置成功', icon: 'success', duration: 1500 });
    setTimeout(() => wx.redirectTo({ url: '/pages/login/login' }), 1500);
  },

  goToLogin() { wx.redirectTo({ url: '/pages/login/login' }); },
  goToRegister() { wx.navigateTo({ url: '/pages/register/register' }); },

  showErrorToast(msg) { wx.showToast({ title: msg, icon: 'none', duration: 2000 }); },
  sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
});