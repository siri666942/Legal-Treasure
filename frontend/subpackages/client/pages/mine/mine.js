// pages/mine/mine.js
// 用户端个人中心页面
const app = getApp();

Page({
  data: {
    // 用户信息
    userInfo: {
      avatar: '/images/avatar.png',
      name: '某某某'
    },
    
    // 功能列表
    menuList: [
      {
        id: 1,
        icon: 'icon-setting',
        name: '账户设置',
        type: 'navigate'
      },
      {
        id: 2,
        icon: 'icon-history',
        name: '办案历史',
        type: 'navigate'
      },
      {
        id: 3,
        icon: 'icon-privacy',
        name: '隐私设置',
        type: 'navigate'
      },
      {
        id: 4,
        icon: 'icon-help',
        name: '帮助与反馈',
        type: 'navigate'
      }
    ],
    
    // 底部导航
    tabList: [
      { id: 1, name: '首页', icon: 'icon-home', active: false },
      { id: 2, name: '案件', icon: 'icon-case', active: false },
      { id: 3, name: '沟通', icon: 'icon-chat', active: false },
      { id: 4, name: '我的', icon: 'icon-mine', active: true }
    ]
  },
  
  onLoad() {
    // 检查登录状态
    if (!app.globalData.isLogin) {
      wx.redirectTo({
        url: '/pages/login/login'
      });
      return;
    }
    
    // 加载用户信息
    this.loadUserInfo();
  },
  
  onShow() {
    // 页面显示时更新导航状态
    this.updateTabBar();
    
    // 刷新用户信息
    this.loadUserInfo();
  },
  
  // 加载用户信息
  loadUserInfo() {
    // 从全局数据获取用户信息
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: {
          ...this.data.userInfo,
          ...app.globalData.userInfo
        }
      });
    }
    
    // 也可以从服务器获取最新信息
    this.getUserInfoFromServer();
  },
  
  // 从服务器获取用户信息
  getUserInfoFromServer() {
    // 模拟API调用
    wx.showLoading({ title: '加载中...' });
    
    setTimeout(() => {
      // 实际开发中调用API获取用户信息
      wx.hideLoading();
    }, 500);
  },
  
  // 更新底部导航状态
  updateTabBar() {
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const route = currentPage.route;
    
    let activeTabId = 4; // 默认我的页选中
    
    const tabList = this.data.tabList.map(tab => ({
      ...tab,
      active: tab.id === activeTabId
    }));
    
    this.setData({ tabList });
  },
  
  // 切换底部导航
  switchTab(e) {
    const tabId = parseInt(e.currentTarget.dataset.id);
    
    // 如果点击的是当前已选中的tab，则不跳转
    const currentTab = this.data.tabList.find(tab => tab.active);
    if (currentTab && currentTab.id === tabId) {
      return;
    }
    
    // 更新tab选中状态
    const tabList = this.data.tabList.map(tab => ({
      ...tab,
      active: tab.id === tabId
    }));
    
    this.setData({ tabList });
    
    // 跳转到对应页面
    switch(tabId) {
      case 1: // 首页
        wx.redirectTo({
          url: '/subpackages/client/pages/index/index'
        });
        break;
      case 2: // 案件
        wx.redirectTo({
          url: '/subpackages/client/pages/case/case'
        });
        break;
      case 3: // 沟通
        wx.redirectTo({
          url: '/subpackages/client/pages/chat/chat'
        });
        break;
      case 4: // 我的（当前页）
        break;
    }
  },
  
  // 菜单项点击
  onMenuItemTap(e) {
    const itemId = e.currentTarget.dataset.id;
    const item = this.data.menuList.find(menu => menu.id === itemId);
    
    if (!item) return;
    
    switch(itemId) {
      case 1: // 账户设置
        wx.navigateTo({
          url: '/subpackages/client/pages/account/account'
        });
        break;
      case 2: // 办案历史
        wx.navigateTo({
          url: '/subpackages/client/pages/past-cases/past-cases'
        });
        break;
      case 3: // 隐私设置
        wx.navigateTo({
          url: '/subpackages/client/pages/privacy/privacy'
        });
        break;
      case 4: // 帮助与反馈
        wx.navigateTo({
          url: '/subpackages/client/pages/feedback/feedback'
        });
        break;
    }
  },
  
  // 查看头像
  viewAvatar() {
    const avatarUrl = this.data.userInfo.avatar;
    
    wx.previewImage({
      urls: [avatarUrl],
      current: avatarUrl
    });
  },
  
  // 退出登录
  logout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          // 清除登录状态
          app.globalData.isLogin = false;
          app.globalData.userInfo = null;
          
          // 跳转到登录页
          wx.redirectTo({
            url: '/pages/login/login'
          });
        }
      }
    });
  }
});