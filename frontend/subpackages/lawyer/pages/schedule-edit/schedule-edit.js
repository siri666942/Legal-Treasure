// pages/schedule/edit/edit.js
Page({
    data: {
      // 当前显示的年份和月份
      currentYear: 2021,
      currentMonth: 8,
      
      // 日历数据
      calendarDays: [],
      
      // 选中的日期
      selectedDate: '',
      
      // 选中的日期格式化显示
      selectedDateFormatted: '',
      
      // 任务列表
      tasks: [
        {
          id: 1,
          date: '2021-08-17',
          time: '09:00',
          title: '与客户开会',
          description: '讨论案件进展'
        },
        {
          id: 2,
          date: '2021-08-17',
          time: '14:30',
          title: '提交法律文件',
          description: '法院要求的文件'
        },
        {
          id: 3,
          date: '2021-08-18',
          time: '10:00',
          title: '电话咨询',
          description: ''
        },
        {
          id: 4,
          date: '2021-08-20',
          time: '15:00',
          title: '庭审准备',
          description: '整理证据材料'
        },
        {
          id: 5,
          date: '2021-08-22',
          time: '11:00',
          title: '法律研究',
          description: '相关案例研究'
        }
      ],
      
      // 当前编辑的任务索引
      editingTaskIndex: -1,
      
      // 任务表单数据
      taskForm: {
        title: '',
        time: '',
        description: ''
      },
      
      // 模态框显示状态
      showTaskModal: false,
      isEditing: false,
      
      // 选中日期的任务列表
      tasksForSelectedDate: []
    },
  
    onLoad: function(options) {
      // 初始化当前日期
      const today = new Date();
      this.setData({
        currentYear: today.getFullYear(),
        currentMonth: today.getMonth() + 1
      });
      
      // 生成日历
      this.generateCalendar();
      
      // 设置选中日期为今天
      this.selectToday();
    },
  
    // 生成日历
    generateCalendar: function() {
      const { currentYear, currentMonth, tasks } = this.data;
      const today = new Date();
      const todayStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
      
      // 获取当月第一天
      const firstDay = new Date(currentYear, currentMonth - 1, 1);
      // 获取当月第一天是星期几（0-6，0是星期日）
      const firstDayWeekday = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
      
      // 获取当月天数
      const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
      
      // 获取上月最后几天
      const prevMonthLastDate = new Date(currentYear, currentMonth - 1, 0).getDate();
      
      const calendarDays = [];
      
      // 添加上月最后几天
      for (let i = 0; i < firstDayWeekday; i++) {
        const day = prevMonthLastDate - firstDayWeekday + i + 1;
        const date = new Date(currentYear, currentMonth - 2, day);
        const dateStr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        
        // 检查该日期是否有任务
        const hasTask = tasks.some(task => task.date === dateStr);
        
        calendarDays.push({
          day: day,
          date: dateStr,
          isCurrentMonth: false,
          isToday: dateStr === todayStr,
          isSelected: dateStr === this.data.selectedDate,
          hasTask: hasTask
        });
      }
      
      // 添加当月日期
      for (let i = 1; i <= daysInMonth; i++) {
        const dateStr = `${currentYear}-${currentMonth}-${i}`;
        const isToday = dateStr === todayStr;
        const isSelected = dateStr === this.data.selectedDate;
        
        // 检查该日期是否有任务
        const hasTask = tasks.some(task => task.date === dateStr);
        
        calendarDays.push({
          day: i,
          date: dateStr,
          isCurrentMonth: true,
          isToday: isToday,
          isSelected: isSelected,
          hasTask: hasTask
        });
      }
      
      // 添加下月前几天
      const totalCells = 42; // 6行 * 7列
      const remainingCells = totalCells - calendarDays.length;
      
      for (let i = 1; i <= remainingCells; i++) {
        const date = new Date(currentYear, currentMonth, i);
        const dateStr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        
        // 检查该日期是否有任务
        const hasTask = tasks.some(task => task.date === dateStr);
        
        calendarDays.push({
          day: i,
          date: dateStr,
          isCurrentMonth: false,
          isToday: false,
          isSelected: false,
          hasTask: hasTask
        });
      }
      
      this.setData({ calendarDays });
      
      // 更新选中日期的任务列表
      this.updateTasksForSelectedDate();
    },
  
    // 更新选中日期的任务列表
    updateTasksForSelectedDate: function() {
      const { selectedDate, tasks } = this.data;
      
      if (!selectedDate) return;
      
      // 获取选中日期的任务并按时间排序
      const tasksForDate = tasks
        .filter(task => task.date === selectedDate)
        .sort((a, b) => a.time.localeCompare(b.time));
      
      this.setData({ 
        tasksForSelectedDate: tasksForDate,
        selectedDateFormatted: this.formatSelectedDate(selectedDate)
      });
    },
  
    // 格式化选中的日期
    formatSelectedDate: function(dateStr) {
      if (!dateStr) return '';
      
      const dateParts = dateStr.split('-');
      const year = parseInt(dateParts[0]);
      const month = parseInt(dateParts[1]);
      const day = parseInt(dateParts[2]);
      
      const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
      const date = new Date(year, month - 1, day);
      const weekday = weekdays[date.getDay()];
      
      return `${month}月${day}日 周${weekday}`;
    },
  
    // 选择今天
    selectToday: function() {
      const today = new Date();
      const todayStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
      this.setData({
        selectedDate: todayStr
      }, () => {
        this.generateCalendar();
      });
    },
  
    // 选择日期
    selectDate: function(e) {
      const date = e.currentTarget.dataset.date;
      
      this.setData({
        selectedDate: date
      }, () => {
        this.generateCalendar();
      });
    },
  
    // 上个月
    prevMonth: function() {
      let { currentYear, currentMonth } = this.data;
      
      if (currentMonth === 1) {
        currentMonth = 12;
        currentYear--;
      } else {
        currentMonth--;
      }
      
      this.setData({
        currentYear,
        currentMonth
      }, () => {
        this.generateCalendar();
      });
    },
  
    // 下个月
    nextMonth: function() {
      let { currentYear, currentMonth } = this.data;
      
      if (currentMonth === 12) {
        currentMonth = 1;
        currentYear++;
      } else {
        currentMonth++;
      }
      
      this.setData({
        currentYear,
        currentMonth
      }, () => {
        this.generateCalendar();
      });
    },
  
    // 选择年份
    changeYear: function(e) {
      const date = e.detail.value;
      const year = new Date(date).getFullYear();
      
      this.setData({
        currentYear: year
      }, () => {
        this.generateCalendar();
      });
    },
  
    // 选择月份
    changeMonth: function(e) {
      const date = e.detail.value;
      const month = new Date(date).getMonth() + 1;
      
      this.setData({
        currentMonth: month
      }, () => {
        this.generateCalendar();
      });
    },
  
    // 显示添加任务模态框
    showAddTaskModal: function() {
      // 重置表单
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      this.setData({
        showTaskModal: true,
        isEditing: false,
        editingTaskIndex: -1,
        taskForm: {
          title: '',
          time: timeStr,
          description: ''
        }
      });
    },
  
    // 编辑任务
    editTask: function(e) {
      const index = e.currentTarget.dataset.index;
      const tasksForDate = this.data.tasksForSelectedDate;
      const task = tasksForDate[index];
      
      // 找到任务在原始数组中的索引
      const originalIndex = this.data.tasks.findIndex(t => t.id === task.id);
      
      this.setData({
        showTaskModal: true,
        isEditing: true,
        editingTaskIndex: originalIndex,
        taskForm: {
          title: task.title,
          time: task.time,
          description: task.description || ''
        }
      });
    },
  
    // 删除任务
    deleteTask: function(e) {
      const index = e.currentTarget.dataset.index;
      const tasksForDate = this.data.tasksForSelectedDate;
      const task = tasksForDate[index];
      
      wx.showModal({
        title: '删除任务',
        content: `确定要删除任务"${task.title}"吗？`,
        success: (res) => {
          if (res.confirm) {
            // 从任务列表中删除
            const updatedTasks = this.data.tasks.filter(t => t.id !== task.id);
            
            this.setData({
              tasks: updatedTasks
            }, () => {
              // 重新生成日历和更新任务列表
              this.generateCalendar();
              
              wx.showToast({
                title: '删除成功',
                icon: 'success'
              });
            });
          }
        }
      });
    },
  
    // 隐藏任务模态框
    hideTaskModal: function() {
      this.setData({
        showTaskModal: false
      });
    },
  
    // 任务标题输入
    onTaskTitleInput: function(e) {
      this.setData({
        'taskForm.title': e.detail.value
      });
    },
  
    // 时间选择
    onTimeChange: function(e) {
      this.setData({
        'taskForm.time': e.detail.value
      });
    },
  
    // 任务描述输入
    onTaskDescriptionInput: function(e) {
      this.setData({
        'taskForm.description': e.detail.value
      });
    },
  
    // 保存任务
    saveTask: function() {
      const { taskForm, isEditing, editingTaskIndex, selectedDate } = this.data;
      
      // 验证表单
      if (!taskForm.title.trim()) {
        wx.showToast({
          title: '请输入任务标题',
          icon: 'none'
        });
        return;
      }
      
      if (!taskForm.time) {
        wx.showToast({
          title: '请选择时间',
          icon: 'none'
        });
        return;
      }
      
      let updatedTasks = [...this.data.tasks];
      
      if (isEditing) {
        // 编辑现有任务
        updatedTasks[editingTaskIndex] = {
          ...updatedTasks[editingTaskIndex],
          title: taskForm.title,
          time: taskForm.time,
          description: taskForm.description
        };
      } else {
        // 添加新任务
        const newTask = {
          id: Date.now(),
          date: selectedDate,
          title: taskForm.title,
          time: taskForm.time,
          description: taskForm.description
        };
        updatedTasks.push(newTask);
      }
      
      this.setData({
        tasks: updatedTasks,
        showTaskModal: false
      }, () => {
        // 重新生成日历和更新任务列表
        this.generateCalendar();
        
        wx.showToast({
          title: isEditing ? '更新成功' : '添加成功',
          icon: 'success'
        });
      });
    }
  })