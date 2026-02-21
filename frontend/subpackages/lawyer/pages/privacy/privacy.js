// subpackages/lawyer/pages/setting/privacy.js
const app = getApp();

Page({
  data: {
    privacySettings: {
      // 个人隐私
      caseVisibility: true,      // 谁可以看到我的案例
      searchable: true,          // 允许搜索到我
      showContact: true,         // 向他人显示我的联系方式
      showQualifications: false, // 显示律师资格证
      
      // 消息通知
      caseNotifications: true,   // 接收案件状态通知
      clientNotifications: true, // 接收客户消息通知
      systemNotifications: false,// 接收系统公告
      appointmentNotifications: true, // 接收预约通知
      
      // 安全设置
      autoLogin: true,           // 自动登录
      biometrics: false,         // 生物识别登录
    }
  },

  onLoad() {
    // 检查登录状态
    if (!app.globalData.isLogin) {
      wx.redirectTo({
        url: '/pages/login/login'
      });
      return;
    }
    
    // 加载隐私设置
    this.loadPrivacySettings();
  },

  // 加载隐私设置
  loadPrivacySettings() {
    // 从本地缓存加载设置
    const savedSettings = wx.getStorageSync('lawyerPrivacySettings');
    if (savedSettings) {
      this.setData({
        privacySettings: savedSettings
      });
    }
  },

  // 保存隐私设置
  savePrivacySettings() {
    wx.setStorageSync('lawyerPrivacySettings', this.data.privacySettings);
  },

  // 通用切换函数
  onSettingChange(settingName, e) {
    const value = e.detail.value;
    this.setData({
      [`privacySettings.${settingName}`]: value
    }, () => {
      this.savePrivacySettings();
      
      // 显示切换提示
      wx.showToast({
        title: value ? '已开启' : '已关闭',
        icon: 'success',
        duration: 1500
      });
    });
  },

  // 案件可见性切换
  onCaseVisibilityChange(e) {
    this.onSettingChange('caseVisibility', e);
  },

  // 可搜索切换
  onSearchableChange(e) {
    this.onSettingChange('searchable', e);
  },

  // 显示联系方式切换
  onShowContactChange(e) {
    this.onSettingChange('showContact', e);
  },

  // 显示律师资格证切换
  onShowQualificationsChange(e) {
    this.onSettingChange('showQualifications', e);
  },

  // 案件通知切换
  onCaseNotificationsChange(e) {
    this.onSettingChange('caseNotifications', e);
  },

  // 客户消息通知切换
  onClientNotificationsChange(e) {
    this.onSettingChange('clientNotifications', e);
  },

  // 系统通知切换
  onSystemNotificationsChange(e) {
    this.onSettingChange('systemNotifications', e);
  },

  // 预约通知切换
  onAppointmentNotificationsChange(e) {
    this.onSettingChange('appointmentNotifications', e);
  },

  // 自动登录切换
  onAutoLoginChange(e) {
    this.onSettingChange('autoLogin', e);
  },

  // 生物识别登录切换
  onBiometricsChange(e) {
    if (e.detail.value) {
      // 检查设备是否支持生物识别
      wx.checkIsSupportSoterAuthentication({
        success: (res) => {
          if (res.supportMode && res.supportMode.includes('fingerPrint')) {
            this.onSettingChange('biometrics', e);
          } else {
            this.setData({
              'privacySettings.biometrics': false
            });
            wx.showToast({
              title: '设备不支持',
              icon: 'none'
            });
          }
        },
        fail: () => {
          this.setData({
            'privacySettings.biometrics': false
          });
          wx.showToast({
            title: '检测失败',
            icon: 'none'
          });
        }
      });
    } else {
      this.onSettingChange('biometrics', e);
    }
  },

  // 个人数据下载
  goDataDownload() {
    wx.showModal({
      title: '数据下载',
      content: '我们将为您生成个人数据文件，包含所有案件记录、客户资料和咨询历史。确认下载吗？',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({
            title: '正在生成数据...',
            mask: true
          });
          
          // 模拟数据生成
          setTimeout(() => {
            wx.hideLoading();
            wx.showToast({
              title: '数据已准备下载',
              icon: 'success'
            });
            
            // 实际开发中这里可以调用API下载文件
          }, 2000);
        }
      }
    });
  },

  // 清除缓存
  clearCache() {
    wx.showModal({
      title: '清除缓存',
      content: '确定要清除所有缓存数据吗？',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '清除中...' });
          
          // 清除缓存
          setTimeout(() => {
            wx.clearStorageSync();
            
            // 重置设置（已移除 allowLocation）
            const defaultSettings = {
              caseVisibility: true,
              searchable: true,
              showContact: true,
              showQualifications: false,
              caseNotifications: true,
              clientNotifications: true,
              systemNotifications: false,
              appointmentNotifications: true,
              autoLogin: true,
              biometrics: false
            };
            
            this.setData({
              privacySettings: defaultSettings
            });
            
            this.savePrivacySettings();
            
            wx.hideLoading();
            wx.showToast({
              title: '清除成功',
              icon: 'success'
            });
          }, 1000);
        }
      }
    });
  },

  // 账户注销
  goDataDelete() {
    wx.showModal({
      title: '账户注销',
      content: '警告：账户注销后，所有数据将被永久删除且不可恢复！包括案件记录、客户资料等。',
      confirmText: '继续注销',
      confirmColor: '#ff4d4f',
      success: (res) => {
        if (res.confirm) {
          wx.navigateTo({
            url: '/subpackages/lawyer/pages/setting/account-delete'
          });
        }
      }
    });
  }

  // 已移除：位置权限、隐私政策、用户协议相关方法
});