// pages/index/index.js
const app = getApp();

Page({
  data: {
    // 用户信息（是否有律师）- 仅用于功能判断，不在页面显示
    userInfo: {
      hasLawyer: false,
      lawyerName: '',
      lawyerAvatar: '',
      lawyerId: null
    },
    
    // 活跃案件
    activeCase: {
      name: 'XXXXX案',
      type: '合同纠纷',
      status: '庭审准备中',
      date: '2024-01-15',
      progress: 70
    },
    
    // 待办任务列表（新增 completed 字段）
    todoList: [
      {
        id: 1,
        task: '提交证据材料',
        case: 'XXXXX案',
        initiator: '张律师',
        time: '今天 15:00',
        urgent: true,
        completed: false
      },
      {
        id: 2,
        task: '签署授权委托书',
        case: '李四合同纠纷',
        initiator: '李律师',
        time: '明天 10:00',
        urgent: false,
        completed: false
      },
      {
        id: 3,
        task: '确认诉讼请求',
        case: '王五劳动争议',
        initiator: '王律师',
        time: '1月18日',
        urgent: false,
        completed: false
      }
    ],
    
    // 底部导航
    currentTab: 0,
    tabList: [
      { id: 0, name: '主页', icon: 'icon-home', active: true },
      { id: 1, name: '案件', icon: 'icon-case', active: false },
      { id: 2, name: '沟通', icon: 'icon-chat', active: false },
      { id: 3, name: '我的', icon: 'icon-mine', active: false }
    ]
  },

  onLoad(options) {
    // 检查登录状态
    if (!app.globalData.isLogin) {
      wx.redirectTo({
        url: '/subpackages/client/pages/login/login'
      });
      return;
    }
    
    // 从全局数据或本地存储获取用户信息（仅用于功能判断）
    this.loadUserInfo();
    
    // 初始化任务排序
    this.sortTasks();
    
    // 加载数据
    this.loadData();
  },

  onShow() {
    // 更新导航状态
    this.updateTabBar();
  },

  onPullDownRefresh() {
    // 下拉刷新
    wx.showNavigationBarLoading();
    
    // 模拟刷新数据
    setTimeout(() => {
      this.loadData();
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
      wx.showToast({
        title: '刷新成功',
        icon: 'success'
      });
    }, 1000);
  },

  // 加载用户信息（仅用于功能判断）
  loadUserInfo() {
    try {
      const hasLawyer = wx.getStorageSync('hasLawyer') || false;
      const lawyerInfo = wx.getStorageSync('lawyerInfo') || {};
      
      this.setData({
        userInfo: {
          hasLawyer: hasLawyer,
          lawyerName: lawyerInfo.name || '',
          lawyerAvatar: lawyerInfo.avatar || '',
          lawyerId: lawyerInfo.id || null
        }
      });
    } catch (error) {
      console.error('读取用户信息失败:', error);
    }
  },

  // 加载数据
  loadData() {
    setTimeout(() => {
      const newProgress = Math.min(this.data.activeCase.progress + 5, 100);
      this.setData({
        'activeCase.progress': newProgress
      });
      // 不再随机打乱任务列表，保持排序稳定
    }, 500);
  },

  // 更新底部导航状态
  updateTabBar() {
    const tabList = this.data.tabList.map(tab => ({
      ...tab,
      active: tab.id === 0
    }));
    
    this.setData({ 
      tabList,
      currentTab: 0
    });
  },

  // 切换底部导航
  switchTab(e) {
    const tabId = parseInt(e.currentTarget.dataset.id);
    
    if (this.data.currentTab === tabId) {
      return;
    }
    
    const tabList = this.data.tabList.map(tab => ({
      ...tab,
      active: tab.id === tabId
    }));
    
    this.setData({ 
      tabList,
      currentTab: tabId
    });
    
    switch(tabId) {
      case 0:
        break;
      case 1:
        wx.redirectTo({
          url: '/subpackages/client/pages/case/case'
        });
        break;
      case 2:
        wx.redirectTo({
          url: '/subpackages/client/pages/chat/chat'
        });
        break;
      case 3:
        wx.redirectTo({
          url: '/subpackages/client/pages/mine/mine'
        });
        break;
    }
  },

  // ============ 任务功能 ============
  
  // 切换任务完成状态
  toggleTaskComplete(e) {
    const taskId = e.currentTarget.dataset.id;
    const todoList = this.data.todoList.map(task => {
      if (task.id === taskId) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    
    this.setData({ todoList }, () => {
      // 重新排序：未完成在前，已完成在后
      this.sortTasks();
      wx.showToast({
        title: this.data.todoList.find(t => t.id === taskId).completed ? '任务已完成' : '任务已取消',
        icon: 'none',
        duration: 1500
      });
    });
  },

  // 任务排序（未完成在上，已完成在下，保持原相对顺序）
  sortTasks() {
    const todoList = this.data.todoList;
    // 分组：未完成和已完成，分别保持原序
    const uncompleted = todoList.filter(task => !task.completed);
    const completed = todoList.filter(task => task.completed);
    const sorted = [...uncompleted, ...completed];
    this.setData({ todoList: sorted });
  },

  // 查看所有任务
  navigateToAllTasks() {
    wx.navigateTo({
      url: '/subpackages/client/pages/task/task'
    });
  },

  // 查看任务详情
  navigateToTaskDetail(e) {
    const taskId = e.currentTarget.dataset.id;
    const task = this.data.todoList.find(item => item.id === taskId);
    
    if (task) {
      wx.navigateTo({
        url: `/subpackages/client/pages/task-detail/task-detail?id=${taskId}&task=${encodeURIComponent(task.task)}`
      });
    }
  },

  // ============ AI法律顾问功能 ============
  
  navigateToAIChat() {
    wx.navigateTo({
      url: '/subpackages/client/pages/communication/communication'
    });
  },

  navigateToOnlineConsult() {
    if (this.data.userInfo.hasLawyer && this.data.userInfo.lawyerId) {
      wx.navigateTo({
        url: `/subpackages/client/pages/communication/communication?lawyerId=${this.data.userInfo.lawyerId}&lawyerName=${encodeURIComponent(this.data.userInfo.lawyerName)}`
      });
    } else {
      wx.navigateTo({
        url: '/subpackages/client/pages/find-lawyer/find-lawyer'
      });
    }
  },

  navigateToCaseSearch() {
    wx.navigateTo({
      url: '/subpackages/client/pages/case-search/case-search'
    });
  },

  navigateToFeeCalculate() {
    wx.navigateTo({
      url: '/subpackages/client/pages/litigation-cost/litigation-cost'
    });
  },

  navigateToFindLawyer() {
    wx.navigateTo({
      url: '/subpackages/client/pages/find-lawyer/find-lawyer'
    });
  },

  // ============ 案件功能 ============
  
  navigateToAllCases() {
    this.switchTab({ currentTarget: { dataset: { id: 1 } } });
  },

  navigateToCaseDetail() {
    wx.navigateTo({
      url: '/subpackages/client/pages/case-detail/case-detail?id=' + this.data.activeCase.name
    });
  },

  navigateToCreateCase() {
    wx.navigateTo({
      url: '/subpackages/client/pages/create-case/create-case'
    });
  }
});