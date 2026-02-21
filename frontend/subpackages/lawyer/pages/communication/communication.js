// pages/chat/chat.js
const app = getApp();
const innerAudioContext = wx.createInnerAudioContext(); // 仅保留播放功能

Page({
  data: {
    // 聊天对象信息
    chatTarget: { name: '某某某', status: '在线' },
    inputValue: '',
    autoFocus: false,
    showAttachmentPanel: false,
    messages: [],
    scrollToView: '',
    scrollToBottomPending: false,
    autoReplyTimer: null,
    timeThreshold: 5 * 60 * 1000,

    // ✨ 任务浮窗（完全同步律师端主页，截止日期改为日期选择）
    showTaskModal: false,
    taskForm: {
      title: '',
      dueDate: '',      // 截止日期，格式 yyyy-mm-dd
      description: ''
    }
  },

  onLoad(options) {
    if (options?.name) {
      this.setData({ 'chatTarget.name': options.name });
      wx.setNavigationBarTitle({ title: options.name });
    }
    this.setData({ messages: [] }, () => this.scrollToBottom());
    this.setDefaultDueDate(); // 初始化任务默认截止日期（今天）
  },

  onUnload() {
    if (this.data.autoReplyTimer) clearTimeout(this.data.autoReplyTimer);
    innerAudioContext.stop(); // 停止正在播放的语音
  },

  // ========== 滚动到底部（防抖）==========
  scrollToBottom() {
    if (this.data.scrollToBottomPending) return;
    this.setData({ scrollToBottomPending: true });
    setTimeout(() => {
      this.setData({ scrollToView: 'bottom-anchor', scrollToBottomPending: false });
    }, 100);
  },

  // ========== 输入框 ==========
  onInput(e) { this.setData({ inputValue: e.detail.value }); },
  onInputFocus() { this.setData({ showAttachmentPanel: false }); this.scrollToBottom(); },
  onInputBlur() {},

  // ========== 发送文本 ==========
  sendTextMessage() {
    const msg = this.data.inputValue.trim();
    if (!msg) {
      wx.showToast({ title: '消息不能为空', icon: 'none' });
      return;
    }
    const newMsg = {
      id: Date.now(),
      sender: 'me',
      type: 'text',
      content: msg,
      timestamp: Date.now(),
      status: 'sending'
    };
    this.addMessage(newMsg);
    this.setData({ inputValue: '' }, () => {
      this.scrollToBottom();
      this.simulateSendMessage(newMsg);
      this.simulateAutoReply();
    });
  },

  // ========== 附件 ==========
  toggleAttachmentPanel() { this.setData({ showAttachmentPanel: !this.data.showAttachmentPanel, autoFocus: false }); },
  
  // 照片
  chooseImage() {
    wx.chooseImage({ count: 1, sizeType: ['compressed'], sourceType: ['album'], success: (res) => {
      this.sendImageMessage(res.tempFilePaths[0]);
      this.setData({ showAttachmentPanel: false });
    }});
  },
  sendImageMessage(fp) {
    const msg = { id: Date.now(), sender: 'me', type: 'image', filePath: fp, timestamp: Date.now(), status: 'sending' };
    this.addMessage(msg);
    this.scrollToBottom();
    this.simulateSendMessage(msg);
    this.simulateAutoReply();
  },
  
  // 文件
  chooseFile() {
    wx.chooseMessageFile({ count: 1, type: 'all', success: (res) => {
      this.sendFileMessage(res.tempFiles[0]);
      this.setData({ showAttachmentPanel: false });
    }, fail: () => wx.showToast({ title: '选择文件失败', icon: 'none' })});
  },
  sendFileMessage(file) {
    const msg = {
      id: Date.now(),
      sender: 'me',
      type: 'file',
      fileName: file.name,
      filePath: file.path,
      fileSize: file.size,
      timestamp: Date.now(),
      status: 'sending'
    };
    this.addMessage(msg);
    this.scrollToBottom();
    this.simulateSendMessage(msg);
    this.simulateAutoReply();
  },
  
  // 拍照
  takePhoto() {
    wx.chooseImage({ count: 1, sizeType: ['compressed'], sourceType: ['camera'], success: (res) => {
      this.sendImageMessage(res.tempFilePaths[0]);
      this.setData({ showAttachmentPanel: false });
    }});
  },

  // ========== ✨ 任务浮窗（截止日期版）==========
  // 设置默认截止日期为今天
  setDefaultDueDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    this.setData({ 'taskForm.dueDate': dateStr });
  },

  // 显示新建任务浮窗
  showAddTaskModal() {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    this.setData({
      showTaskModal: true,
      taskForm: { title: '', dueDate: dateStr, description: '' }
    });
  },

  // 隐藏浮窗
  hideTaskModal() {
    this.setData({ showTaskModal: false });
  },

  // 任务标题输入
  onTaskTitleInput(e) {
    this.setData({ 'taskForm.title': e.detail.value });
  },

  // 截止日期选择
  onDueDateChange(e) {
    this.setData({ 'taskForm.dueDate': e.detail.value });
  },

  // 任务描述输入
  onTaskDescriptionInput(e) {
    this.setData({ 'taskForm.description': e.detail.value });
  },

  // 保存新任务
  saveNewTask() {
    const { taskForm } = this.data;
    if (!taskForm.title.trim()) {
      wx.showToast({ title: '请输入任务标题', icon: 'none' });
      return;
    }
    if (!taskForm.dueDate) {
      wx.showToast({ title: '请选择截止日期', icon: 'none' });
      return;
    }

    // 格式化截止日期显示为 YYYY.M.D
    const dateParts = taskForm.dueDate.split('-');
    const dueDateDisplay = `${dateParts[0]}.${parseInt(dateParts[1])}.${parseInt(dateParts[2])}`;

    const taskMsg = {
      id: Date.now(),
      sender: 'me',
      type: 'task',
      taskTitle: taskForm.title,
      dueDate: dueDateDisplay,
      description: taskForm.description || '',
      completed: false,
      timestamp: Date.now(),
      status: 'sending'
    };

    this.addMessage(taskMsg);
    this.setData({
      showTaskModal: false,
      showAttachmentPanel: false
    });
    this.scrollToBottom();
    this.simulateSendMessage(taskMsg);
    wx.showToast({ title: '任务已创建', icon: 'success' });
  },

  // ========== 消息操作 ==========
  addMessage(m) { this.setData({ messages: [...this.data.messages, m] }); },
  
  simulateSendMessage(m) {
    setTimeout(() => {
      this.setData({ messages: this.data.messages.map(msg => msg.id === m.id ? { ...msg, status: 'sent' } : msg) });
      setTimeout(() => {
        this.setData({ messages: this.data.messages.map(msg => msg.id === m.id ? { ...msg, status: 'read' } : msg) });
      }, 1000);
    }, 500);
  },
  
  simulateAutoReply() {
    if (this.data.autoReplyTimer) clearTimeout(this.data.autoReplyTimer);
    const delay = 1000 + Math.random() * 2000;
    const timer = setTimeout(() => {
      const replies = ['好的，我明白了', '我会处理的', '谢谢您的信息', '这个问题我需要查一下', '请稍等，我确认一下'];
      const reply = { id: Date.now()+1, sender: 'other', type: 'text', content: replies[Math.floor(Math.random() * replies.length)], timestamp: Date.now(), status: 'read' };
      this.addMessage(reply);
      this.scrollToBottom();
    }, delay);
    this.setData({ autoReplyTimer: timer });
  },

  // ========== 图片预览/下载 ==========
  handleImageTap(e) {
    const { filepath } = e.currentTarget.dataset;
    if (!filepath) return;
    wx.showActionSheet({
      itemList: ['预览图片', '下载图片'],
      success: (res) => {
        if (res.tapIndex === 0) wx.previewImage({ urls: [filepath], current: filepath });
        else this.downloadImage(filepath);
      }
    });
  },
  downloadImage(fp) {
    wx.showLoading({ title: '下载中...' });
    wx.downloadFile({
      url: fp,
      success: (res) => {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: () => { wx.hideLoading(); wx.showToast({ title: '已保存到相册', icon: 'success' }); },
          fail: () => { wx.hideLoading(); wx.showToast({ title: '保存失败', icon: 'none' }); }
        });
      },
      fail: () => { wx.hideLoading(); wx.showToast({ title: '下载失败', icon: 'none' }); }
    });
  },

  // ========== 文件交互（单击菜单：预览/下载）==========
  handleFileTap(e) {
    const { filepath, filename } = e.currentTarget.dataset;
    if (!filepath) return;
    wx.showActionSheet({
      itemList: ['预览文件', '下载文件'],
      success: (res) => {
        if (res.tapIndex === 0) {
          this.previewFile(filepath, filename);
        } else {
          this.saveFileToLocal(filepath, filename);
        }
      }
    });
  },

  // 预览文件
  previewFile(filePath, fileName) {
    const ext = this.getFileExtension(fileName || filePath);
    wx.showLoading({ title: '正在打开文件' });
    wx.openDocument({
      filePath: filePath,
      fileType: ext,
      success: () => wx.hideLoading(),
      fail: (err) => {
        wx.hideLoading();
        wx.showModal({
          title: '提示',
          content: '文件打开失败，是否尝试保存到本地？',
          success: (res) => { if (res.confirm) this.saveFileToLocal(filePath, fileName); }
        });
      }
    });
  },

  // 保存文件到本地缓存（小程序内部）
  saveFileToLocal(filePath, fileName) {
    wx.showLoading({ title: '保存中...' });
    // 如果已经是本地临时文件，直接保存；否则先下载
    if (filePath.startsWith('http')) {
      // 网络文件，先下载再保存
      wx.downloadFile({
        url: filePath,
        success: (res) => {
          wx.saveFile({
            tempFilePath: res.tempFilePath,
            success: (saveRes) => {
              wx.hideLoading();
              wx.showToast({ title: '已保存到本地', icon: 'success' });
              console.log('文件保存路径：', saveRes.savedFilePath);
            },
            fail: () => {
              wx.hideLoading();
              wx.showToast({ title: '保存失败', icon: 'none' });
            }
          });
        },
        fail: () => {
          wx.hideLoading();
          wx.showToast({ title: '下载失败', icon: 'none' });
        }
      });
    } else {
      // 本地临时文件，直接保存
      wx.saveFile({
        tempFilePath: filePath,
        success: (saveRes) => {
          wx.hideLoading();
          wx.showToast({ title: '已保存到本地', icon: 'success' });
          console.log('文件保存路径：', saveRes.savedFilePath);
        },
        fail: () => {
          wx.hideLoading();
          wx.showToast({ title: '保存失败', icon: 'none' });
        }
      });
    }
  },

  // ========== 语音播放（保留） ==========
  playVoice(e) {
    const { filepath, duration } = e.currentTarget.dataset;
    if (!filepath) return;
    innerAudioContext.src = filepath;
    innerAudioContext.play();
    wx.showToast({ title: `播放语音 ${duration}"`, icon: 'none' });
  },

  // ========== 工具函数 ==========
  getFileExtension(n) { return n ? n.split('.').pop().toLowerCase() : ''; },
  formatFileSize(b) {
    if (!b) return '0 B';
    const u = ['B', 'KB', 'MB', 'GB'], i = Math.floor(Math.log(b) / Math.log(1024));
    return (b / Math.pow(1024, i)).toFixed(2) + ' ' + u[i];
  },
  formatTime(t) { const d = new Date(t); return `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`; },
  formatDuration(s) { return s ? `${Math.floor(s/60)}'${s%60}"` : '0"'; }
});