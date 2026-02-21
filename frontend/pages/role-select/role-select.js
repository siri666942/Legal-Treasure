// pages/role-select/role-select.js
const app = getApp();

Page({
  data: {
    userInfo: null,
    // 移除 currentTime 数据
  },
  
  onLoad() {
    const userInfo = app.globalData.userInfo;
    this.setData({ userInfo });
    // 移除时间更新逻辑
  },
  
  onShow() {
    // 移除时间更新逻辑
  },
  
  // 移除 updateCurrentTime 方法
  
  // 选择律师端 - 简化版本，直接跳转
  selectLawyer() {
    // 更新全局角色
    app.globalData.userRole = 'lawyer';
    wx.setStorageSync('lubao_userRole', 'lawyer');
    
    // 也更新 userInfo 中的角色
    if (app.globalData.userInfo) {
      app.globalData.userInfo.role = 'lawyer';
      wx.setStorageSync('lubao_userInfo', app.globalData.userInfo);
    }
    
    wx.showToast({
      title: '切换成功',
      icon: 'success',
      duration: 800
    });
    
    // 直接跳转，不使用路由工具
    setTimeout(() => {
      // 根据你的项目结构，跳转到律师主页
      wx.reLaunch({
        url: '/subpackages/lawyer/pages/index/index'
      });
    }, 800);
  },
  
  // 选择用户端 - 简化版本，直接跳转
  selectClient() {
    // 更新全局角色
    app.globalData.userRole = 'client';
    wx.setStorageSync('lubao_userRole', 'client');
    
    // 也更新 userInfo 中的角色
    if (app.globalData.userInfo) {
      app.globalData.userInfo.role = 'client';
      wx.setStorageSync('lubao_userInfo', app.globalData.userInfo);
    }
    
    wx.showToast({
      title: '切换成功',
      icon: 'success',
      duration: 800
    });
    
    // 直接跳转，不使用路由工具
    setTimeout(() => {
      // 跳转到用户端主页
      wx.reLaunch({
        url: '/subpackages/client/pages/index/index'
      });
    }, 800);
  }
});