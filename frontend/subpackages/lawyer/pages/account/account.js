// subpackages/client/pages/setting/account.js
const app = getApp();

Page({
  data: {
    userInfo: {
      nickName: '',
      avatarUrl: '',
      phone: '',
      birthday: ''
    },
    phoneDisplay: '',
    // 移除 datePickerValue，不再需要
  },

  onLoad() {
    this.loadUserInfo();
  },

  onShow() {
    this.loadUserInfo();
  },

  // 加载用户信息
  loadUserInfo() {
    const globalUserInfo = app.globalData.userInfo || {};
    
    const phoneDisplay = globalUserInfo.phone
      ? globalUserInfo.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
      : '未绑定手机号';

    this.setData({
      userInfo: {
        nickName: globalUserInfo.nickName || '',
        avatarUrl: globalUserInfo.avatarUrl || '',
        phone: globalUserInfo.phone || '',
        birthday: globalUserInfo.birthday || ''
      },
      phoneDisplay: phoneDisplay
    });
  },

  // 保存用户信息到全局
  saveUserInfoToGlobal() {
    if (!app.globalData.userInfo) app.globalData.userInfo = {};
    const newInfo = this.data.userInfo;
    app.globalData.userInfo.nickName = newInfo.nickName;
    app.globalData.userInfo.avatarUrl = newInfo.avatarUrl;
    app.globalData.userInfo.phone = newInfo.phone;
    app.globalData.userInfo.birthday = newInfo.birthday;
  },

  // ========== 头像 ==========
  changeAvatar() {
    const that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        const tempFilePath = res.tempFilePaths[0];
        wx.showLoading({ title: '上传中...' });
        setTimeout(() => {
          wx.hideLoading();
          that.setData({ 'userInfo.avatarUrl': tempFilePath });
          that.saveUserInfoToGlobal();
          wx.showToast({ title: '头像更新成功', icon: 'success' });
        }, 800);
      },
      fail() {
        wx.showToast({ title: '取消选择', icon: 'none' });
      }
    });
  },

  // ========== 昵称 ==========
  editNickname() {
    const that = this;
    wx.showModal({
      title: '修改昵称',
      editable: true,
      placeholderText: that.data.userInfo.nickName || '请输入昵称',
      success(res) {
        if (res.confirm && res.content) {
          const newNickname = res.content.trim();
          if (newNickname) {
            that.setData({ 'userInfo.nickName': newNickname });
            that.saveUserInfoToGlobal();
            wx.showToast({ title: '昵称已更新', icon: 'success' });
          }
        }
      }
    });
  },

  // ========== 出生日期（新增：模态框输入）==========
  editBirthday() {
    const that = this;
    wx.showModal({
      title: '修改出生日期',
      editable: true,
      placeholderText: that.data.userInfo.birthday || '例如：1990年1月1日',
      success(res) {
        if (res.confirm && res.content) {
          let input = res.content.trim();
          if (input) {
            // 简单格式化：保留用户输入的原样，或尝试标准化
            // 这里直接保存用户输入的内容，也可以自行添加格式校验
            that.setData({ 'userInfo.birthday': input });
            that.saveUserInfoToGlobal();
            wx.showToast({ title: '生日已更新', icon: 'success' });
          }
        }
      }
    });
  },

  // ========== 手机号 ==========
  changePhone() {
    const that = this;
    const currentPhone = that.data.userInfo.phone || '';
    const placeholder = currentPhone
      ? currentPhone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
      : '11位手机号';
    wx.showModal({
      title: '绑定手机号',
      editable: true,
      placeholderText: placeholder,
      success(res) {
        if (res.confirm && res.content) {
          const newPhone = res.content.trim();
          if (/^1\d{10}$/.test(newPhone)) {
            that.setData({
              'userInfo.phone': newPhone,
              phoneDisplay: newPhone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
            });
            that.saveUserInfoToGlobal();
            wx.showToast({ title: '手机号绑定成功', icon: 'success' });
          } else {
            wx.showToast({ title: '手机号格式不正确', icon: 'none' });
          }
        }
      }
    });
  },

  // ========== 修改密码 ==========
  changePassword() {
    wx.showModal({
      title: '修改密码',
      editable: true,
      placeholderText: '6-20位新密码',
      success(res) {
        if (res.confirm && res.content) {
          const newPwd = res.content.trim();
          if (newPwd.length >= 6 && newPwd.length <= 20) {
            wx.showToast({ title: '密码修改成功', icon: 'success' });
          } else {
            wx.showToast({ title: '密码长度需6-20位', icon: 'none' });
          }
        }
      }
    });
  },

  // ========== 退出登录 ==========
  logout() {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success(res) {
        if (res.confirm) {
          app.globalData.isLogin = false;
          app.globalData.userInfo = null;
          wx.redirectTo({ url: '/pages/login/login' });
        }
      }
    });
  }
});