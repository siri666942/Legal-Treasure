// app.js - 小程序入口文件
const { goToHomeByRole } = require('./common/utils/router');

App({
  // 小程序启动时执行
  onLaunch() {
    console.log('律宝小程序启动');
    
    // 检查登录状态
    this.checkLoginStatus();
  },
  
  // 全局数据（所有页面都能访问）
  globalData: {
    userInfo: null,      // 用户信息
    token: null,         // 登录凭证
    userRole: null,      // 用户角色：'lawyer'或'client'
    isLogin: false       // 是否登录
  },
  
  // 检查是否已登录
  checkLoginStatus() {
    // 从本地存储读取
    const token = wx.getStorageSync('lubao_token');
    const userInfo = wx.getStorageSync('lubao_userInfo');
    const userRole = wx.getStorageSync('lubao_userRole');
    
    if (token && userInfo) {
      // 如果本地有保存，就设置到全局
      this.globalData.token = token;
      this.globalData.userInfo = userInfo;
      this.globalData.userRole = userRole;
      this.globalData.isLogin = true;
      console.log('用户已登录，角色：', userRole);
    } else {
      console.log('用户未登录');
    }
  },
  
  // 模拟登录方法（实际开发中要连接后端）
  login(credentials) {
    return new Promise((resolve, reject) => {
      // 显示加载中
      wx.showLoading({
        title: '登录中...'
      });
      
      // 模拟网络请求延迟
      setTimeout(() => {
        // 关闭加载
        wx.hideLoading();
        
        // 模拟登录成功 - 重要修改：不设置角色
        const userInfo = {
          userId: '123456',
          username: credentials.username,
          role: null,  // 改为 null，让用户选择
          avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
          phone: '13800138000'
        };
        
        const token = 'mock_token_' + Date.now();
        
        // 保存到全局
        this.globalData.token = token;
        this.globalData.userInfo = userInfo;
        this.globalData.userRole = null;  // 这里也改为 null
        this.globalData.isLogin = true;
        
        // 保存到本地存储（关闭小程序再打开还能记住）
        wx.setStorageSync('lubao_token', token);
        wx.setStorageSync('lubao_userInfo', userInfo);
        wx.setStorageSync('lubao_userRole', null);  // 角色设为 null
        
        // 返回成功结果
        resolve({ 
          success: true, 
          userInfo,
          message: '登录成功'
        });
        
        // 登录后跳转到角色选择页
        wx.reLaunch({
          url: '/pages/role-select/role-select'
        });
        
      }, 1500); // 1.5秒延迟
    });
  },
  
  // 退出登录
  logout() {
    // 清除本地存储
    wx.removeStorageSync('lubao_token');
    wx.removeStorageSync('lubao_userInfo');
    wx.removeStorageSync('lubao_userRole');
    
    // 清除全局数据
    this.globalData.token = null;
    this.globalData.userInfo = null;
    this.globalData.userRole = null;
    this.globalData.isLogin = false;
    
    // 跳转到登录页
    wx.reLaunch({
      url: '/pages/login/login'
    });
  },
  
  // 获取当前角色
  getCurrentRole() {
    return this.globalData.userRole;
  },
  
  // 判断是否是律师
  isLawyer() {
    return this.globalData.userRole === 'lawyer';
  },
  
  // 判断是否是用户
  isClient() {
    return this.globalData.userRole === 'client';
  },
  
  // 跳转到对应首页（使用路由工具）
  goToHomePage() {
    goToHomeByRole();
  }
});