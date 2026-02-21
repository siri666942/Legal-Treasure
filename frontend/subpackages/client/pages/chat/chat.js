// pages/client-chat/client-chat.js
// 用户端沟通页面
const app = getApp();

Page({
  data: {
    // 当前时间
    currentTime: '12:00',
    
    // 消息列表
    messageList: [
      {
        id: 1,
        type: 'system',
        name: '系统通知',
        avatar: '🔔',
        lastMessage: '您的案件 "张三诉李四合同纠纷案" 有新进展',
        time: '10:30',
        unreadCount: 1,
        isTop: true
      },
      {
        id: 2,
        type: 'ai',
        name: '律宝（AI助手）',
        avatar: '🤖',
        lastMessage: '我可以帮您查询法律问题、解答疑问...',
        time: '09:15',
        unreadCount: 0,
        isTop: true
      },
      {
        id: 3,
        type: 'lawyer',
        name: '王律师',
        avatar: '👨‍⚖️',
        lastMessage: '关于合同修改的条款，我给您详细解释一下...',
        time: '昨天',
        unreadCount: 3,
        isTop: false,
        caseName: '合同纠纷案'
      },
      {
        id: 4,
        type: 'lawyer',
        name: '张律师',
        avatar: '👩‍⚖️',
        lastMessage: '法院的开庭时间已经确定，请查看通知',
        time: '前天',
        unreadCount: 0,
        isTop: false,
        caseName: '离婚诉讼'
      },
      {
        id: 5,
        type: 'lawyer',
        name: '李律师',
        avatar: '👨‍⚖️',
        lastMessage: '证据材料已收到，正在整理...',
        time: '昨天',
        unreadCount: 0,
        isTop: false,
        caseName: '劳动仲裁'
      },
      {
        id: 6,
        type: 'lawyer_assistant',
        name: '律师助理-小王',
        avatar: '👨‍💼',
        lastMessage: '请确认下午3点的见面时间',
        time: '前天',
        unreadCount: 0,
        isTop: false,
        caseName: '合同纠纷案'
      }
    ],
    
    // 底部导航
    tabList: [
      { id: 1, name: '首页', icon: 'icon-home', active: false },
      { id: 2, name: '案件', icon: 'icon-case', active: false },
      { id: 3, name: '沟通', icon: 'icon-chat', active: true },
      { id: 4, name: '我的', icon: 'icon-mine', active: false }
    ]
  },
  
  onLoad() {
    // 检查登录和角色
    if (!app.globalData.isLogin) {
      wx.redirectTo({
        url: '/pages/login/login'
      });
      return;
    }
    
    if (app.globalData.userInfo.role !== 'client') {
      wx.redirectTo({
        url: '/pages/index/index'
      });
      return;
    }
    
    // 更新时间
    this.updateCurrentTime();
    // 设置定时器每秒钟更新时间
    this.timeInterval = setInterval(() => {
      this.updateCurrentTime();
    }, 1000);
    
    // 获取消息列表
    this.getMessageList();
  },
  
  onShow() {
    // 页面显示时更新导航状态
    this.updateTabBar();
    
    // 刷新消息列表
    this.getMessageList();
  },
  
  onUnload() {
    // 清除定时器
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  },
  
  // 更新时间
  updateCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}`;
    this.setData({ currentTime: timeString });
  },
  
  // 更新底部导航状态
  updateTabBar() {
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const route = currentPage.route;
    
    let activeTabId = 3; // 默认沟通页选中
    
    const tabList = this.data.tabList.map(tab => ({
      ...tab,
      active: tab.id === activeTabId
    }));
    
    this.setData({ tabList });
  },
  
  // 获取消息列表
  getMessageList() {
    // 模拟API调用
    wx.showLoading({ title: '加载中...' });
    
    setTimeout(() => {
      // 实际开发中应从服务器获取数据
      wx.hideLoading();
    }, 500);
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
      case 3: // 沟通（当前页）
        break;
      case 4: // 我的
        wx.redirectTo({
          url: '/subpackages/client/pages/mine/mine'
        });
        break;
    }
  },
  
  // 进入聊天
  enterChat(e) {
    const chatId = e.currentTarget.dataset.id;
    const chatType = e.currentTarget.dataset.type;
    const chatName = e.currentTarget.dataset.name;
    
    // 标记为已读
    const messageList = this.data.messageList.map(item => {
      if (item.id === chatId && item.unreadCount > 0) {
        return { ...item, unreadCount: 0 };
      }
      return item;
    });
    
    this.setData({ messageList });
    
    // 跳转到聊天详情页
    wx.navigateTo({
      url: `/subpackages/client/pages/communication/communication?id=${chatId}&type=${chatType}&name=${chatName}`
    });
  },
  
  // 下拉刷新
  onPullDownRefresh() {
    wx.showNavigationBarLoading();
    
    // 模拟刷新数据
    setTimeout(() => {
      // 这里可以调用API获取最新消息列表
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
      wx.showToast({
        title: '刷新成功',
        icon: 'success'
      });
    }, 1000);
  }
});