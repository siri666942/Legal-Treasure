// subpackages/client/pages/setting/privacy.js
Page({
    data: {
      privacySettings: {
        caseVisibility: true,
        searchable: true,
        showContact: false,
        caseNotifications: true,
        lawyerNotifications: true,
        systemNotifications: false
      }
    },
  
    onLoad() {
      this.loadPrivacySettings();
    },
  
    // 加载隐私设置
    loadPrivacySettings() {
      // 从本地缓存加载设置
      const savedSettings = wx.getStorageSync('privacySettings');
      if (savedSettings) {
        this.setData({
          privacySettings: savedSettings
        });
      }
    },
  
    // 保存隐私设置
    savePrivacySettings() {
      wx.setStorageSync('privacySettings', this.data.privacySettings);
    },
  
    // 案件可见性切换
    onCaseVisibilityChange(e) {
      this.setData({
        'privacySettings.caseVisibility': e.detail.value
      }, () => {
        this.savePrivacySettings();
      });
    },
  
    // 可搜索切换
    onSearchableChange(e) {
      this.setData({
        'privacySettings.searchable': e.detail.value
      }, () => {
        this.savePrivacySettings();
      });
    },
  
    // 显示联系方式切换
    onShowContactChange(e) {
      this.setData({
        'privacySettings.showContact': e.detail.value
      }, () => {
        this.savePrivacySettings();
      });
    },
  
    // 案件通知切换
    onCaseNotificationsChange(e) {
      this.setData({
        'privacySettings.caseNotifications': e.detail.value
      }, () => {
        this.savePrivacySettings();
        
        // 如果需要，可以在这里调用服务器API更新设置
        if (!e.detail.value) {
          wx.showToast({
            title: '已关闭案件通知',
            icon: 'success'
          });
        }
      });
    },
  
    // 律师消息通知切换
    onLawyerNotificationsChange(e) {
      this.setData({
        'privacySettings.lawyerNotifications': e.detail.value
      }, () => {
        this.savePrivacySettings();
      });
    },
  
    // 系统通知切换
    onSystemNotificationsChange(e) {
      this.setData({
        'privacySettings.systemNotifications': e.detail.value
      }, () => {
        this.savePrivacySettings();
      });
    },
  
    // 个人数据下载
    goDataDownload() {
      wx.showModal({
        title: '数据下载',
        content: '我们将为您生成个人数据文件，包含所有案件记录和咨询历史。确认下载吗？',
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
            }, 2000);
          }
        }
      });
    },
  
    // 账户注销
    goDataDelete() {
      wx.showModal({
        title: '账户注销',
        content: '警告：账户注销后，所有数据将被永久删除且不可恢复！',
        confirmText: '继续注销',
        confirmColor: '#ff4d4f',
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({
              url: '/subpackages/client/pages/setting/account-delete'
            });
          }
        }
      });
    }
  });