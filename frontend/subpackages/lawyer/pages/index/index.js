// subpackages/lawyer/pages/index/index.js
Page({
    data: {
      // 统计数据
      todoCount: 3,
      processingCaseCount: 3,
      
      // 案件数据（原始数据）
      cases: [
        { id: 1, name: '劳动争议案', client: '李女士', caseNo: 'LA20231215001', status: 'processing', statusText: '进行中', progress: 60 },
        { id: 2, name: '离婚财产分割案', client: '陈女士', caseNo: 'LA20231214002', status: 'pending', statusText: '待处理', progress: 30 },
        { id: 3, name: '交通事故赔偿案', client: '王女士', caseNo: 'LA20231210003', status: 'completed', statusText: '已完成', progress: 100 },
        { id: 4, name: '合同纠纷案', client: '张先生', caseNo: 'LA20231208004', status: 'processing', statusText: '进行中', progress: 80 }
      ],
      
      // 主页显示的案例列表（前2条）
      displayCases: [],
      
      // 今日任务 - 仅保留时间、标题、描述三个核心字段
      tasks: [
        { 
          id: 1, 
          time: '09:30', 
          title: '与李女士会面，讨论劳动争议案件细节',
          description: '律所会议室A',
          completed: false
        },
        { 
          id: 2, 
          time: '14:00', 
          title: '出庭：劳动争议案第一次开庭',
          description: '中级人民法院3号庭',
          completed: false
        },
        { 
          id: 3, 
          time: '16:30', 
          title: '案件分析会议：离婚财产分割方案',
          description: '线上会议',
          completed: false
        },
        { 
          id: 4, 
          time: '18:00', 
          title: '合同审阅：合作协议条款修改',
          description: '线上',
          completed: true
        }
      ],
      
      // 模态框相关
      showTaskModal: false,
      taskForm: {
        title: '',
        time: '',
        description: ''
      },
      
      // 底部导航
      tabList: [
        { id: 1, name: '首页', icon: 'icon-home', active: true },
        { id: 2, name: '案件', icon: 'icon-case', active: false },
        { id: 3, name: '沟通', icon: 'icon-chat', active: false },
        { id: 4, name: '我的', icon: 'icon-mine', active: false }
      ]
    },
  
    onLoad() {
      this.loadData();
      this.setupTabBar();
      this.updateTodoCount();
      this.setDefaultTaskTime();
      this.updateDisplayCases();
      // 初始化排序
      this.sortTasks();
    },
  
    onShow() {
      this.loadData();
      this.updateTabBar();
      this.updateTodoCount();
      this.updateDisplayCases();
      // 页面显示时也排序（确保数据一致性）
      this.sortTasks();
    },
  
    // 设置默认任务时间为当前时间
    setDefaultTaskTime() {
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      this.setData({ 'taskForm.time': timeStr });
    },
  
    // 更新今日待办数量（未完成任务数）
    updateTodoCount() {
      const uncompleted = this.data.tasks.filter(t => !t.completed).length;
      this.setData({ todoCount: uncompleted });
    },
  
    // 更新主页显示的案例列表（前2条）
    updateDisplayCases() {
      const cases = this.data.cases || [];
      this.setData({
        displayCases: cases.slice(0, 2)
      });
    },
  
    // ========== 任务排序逻辑 ==========
    // 将任务排序：未完成的在前（按时间升序），已完成的在后（按时间升序）
    sortTasks() {
      const tasks = this.data.tasks;
      // 先按完成状态排序（false在前，true在后），再按时间排序
      const sorted = [...tasks].sort((a, b) => {
        if (a.completed === b.completed) {
          // 时间字符串比较（HH:MM）
          return a.time.localeCompare(b.time);
        }
        return a.completed ? 1 : -1; // 未完成（false）排在前面
      });
      this.setData({ tasks: sorted });
    },
  
    // 切换任务完成状态
    toggleTaskComplete(e) {
      const taskId = e.currentTarget.dataset.id;
      let tasks = this.data.tasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      );
      this.setData({ tasks }, () => {
        this.sortTasks(); // 切换后重新排序
        this.updateTodoCount();
        wx.showToast({
          title: tasks.find(t => t.id === taskId).completed ? '已完成' : '未完成',
          icon: 'none',
          duration: 1500
        });
      });
    },
  
    // ========== 任务浮窗操作 ==========
    showAddTaskModal() {
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      this.setData({
        showTaskModal: true,
        taskForm: { title: '', time: timeStr, description: '' }
      });
    },
  
    hideTaskModal() {
      this.setData({ showTaskModal: false });
    },
  
    onTaskTitleInput(e) {
      this.setData({ 'taskForm.title': e.detail.value });
    },
    onTimeChange(e) {
      this.setData({ 'taskForm.time': e.detail.value });
    },
    onTaskDescriptionInput(e) {
      this.setData({ 'taskForm.description': e.detail.value });
    },
  
    saveNewTask() {
      const { taskForm, tasks } = this.data;
      if (!taskForm.title.trim()) {
        wx.showToast({ title: '请输入任务标题', icon: 'none' });
        return;
      }
      if (!taskForm.time) {
        wx.showToast({ title: '请选择时间', icon: 'none' });
        return;
      }
  
      const newTask = {
        id: Date.now(),
        time: taskForm.time,
        title: taskForm.title,
        description: taskForm.description || '',
        completed: false
      };
  
      const updatedTasks = [newTask, ...tasks];
      this.setData({ tasks: updatedTasks }, () => {
        this.sortTasks(); // 新任务默认未完成，排序后应显示在顶部合适位置
        this.updateTodoCount();
        wx.showToast({ title: '任务已创建', icon: 'success' });
      });
      this.hideTaskModal();
    },
  
    // 查看任务详情（跳转日程编辑页）
    viewTaskDetail(e) {
      const taskId = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: `/subpackages/lawyer/pages/schedule/edit/edit?id=${taskId}&view=detail`
      });
    },
  
    // 查看日历
    viewCalendar() {
      wx.navigateTo({
        url: '/subpackages/lawyer/pages/schedule-edit/schedule-edit'
      });
    },
  
    // ========== 案件相关 ==========
    viewAllCases() {
      wx.navigateTo({
        url: '/subpackages/lawyer/pages/case/case'
      });
    },
  
    viewCaseDetail(e) {
      const caseId = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: `/subpackages/lawyer/pages/case-detail/index?id=${caseId}`
      });
    },
  
    // ========== 底部导航 ==========
    setupTabBar() {
      const tabList = this.data.tabList.map(tab => ({ ...tab, active: tab.id === 1 }));
      this.setData({ tabList });
    },
  
    updateTabBar() {
      const pages = getCurrentPages();
      const currentPage = pages[pages.length - 1];
      const route = currentPage.route;
      let activeTabId = 1;
      if (route.includes('/case/')) activeTabId = 2;
      else if (route.includes('/chat/')) activeTabId = 3;
      else if (route.includes('/mine/')) activeTabId = 4;
      const tabList = this.data.tabList.map(tab => ({ ...tab, active: tab.id === activeTabId }));
      this.setData({ tabList });
    },
  
    switchTab(e) {
      const tabId = parseInt(e.currentTarget.dataset.id);
      const currentTab = this.data.tabList.find(tab => tab.active);
      if (currentTab && currentTab.id === tabId) return;
      const tabList = this.data.tabList.map(tab => ({ ...tab, active: tab.id === tabId }));
      this.setData({ tabList });
      switch(tabId) {
        case 1: wx.redirectTo({ url: '/subpackages/lawyer/pages/index/index' }); break;
        case 2: wx.redirectTo({ url: '/subpackages/lawyer/pages/case/case' }); break;
        case 3: wx.redirectTo({ url: '/subpackages/lawyer/pages/chat/chat' }); break;
        case 4: wx.redirectTo({ url: '/subpackages/lawyer/pages/mine/mine' }); break;
      }
    },
  
    // 数据加载模拟
    loadData() {
      setTimeout(() => {
        this.setData({ 
          processingCaseCount: Math.floor(Math.random() * 5) + 1 
        });
        this.updateDisplayCases();
      }, 500);
    },
    refreshData() { this.loadData(); },
    onPullDownRefresh() {
      this.refreshData();
      setTimeout(() => { wx.stopPullDownRefresh(); }, 1000);
    }
  });