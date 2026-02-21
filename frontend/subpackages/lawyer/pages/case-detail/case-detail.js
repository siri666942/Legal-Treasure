// subpackages/lawyer/pages/case-detail/case-detail.js
const request = require('../../../common/utils/request.js');

Page({
    data: {
      timelineExpanded: false,
      documentsExpanded: false,
      partiesExpanded: false,
      timelineEditing: false,
      documentsEditing: false,
      partiesEditing: false,
      showTimelineAddForm: false,
      showPartiesAddForm: false,
      timelineBackup: [],
      documentsBackup: [],
      partiesBackup: [],
      newTimelineItem: { date: '', event: '', description: '' },
      newPartyItem: { name: '', role: '', type: '个人', contact: '', address: '', roleClass: 'party-plaintiff' },
      isBound: false,
      showBindModal: false,
      bindCode: '',
      caseInfo: {
        caseNo: '',
        caseTitle: '',
        caseType: '',
        court: '',
        judge: '',
        filingDate: '',
        closeDate: '',
        amount: '',
        applicableLaw: '',
        client: ''
      },
      timeline: [],
      documents: [],
      parties: []
    },

    onLoad: function(options) {
      const id = options && options.id;
      if (!id) return;
      wx.showLoading({ title: '加载中...' });
      request.get('/cases/' + id, true).then(({ data }) => {
        wx.hideLoading();
        const info = {
          caseNo: data.caseNo || '',
          caseTitle: data.caseTitle || data.title || '',
          caseType: data.caseType || '',
          court: data.court || '',
          judge: data.judge || '',
          filingDate: data.filingDate || '',
          closeDate: '',
          amount: data.amount || '',
          applicableLaw: data.applicableLaw || '',
          client: data.client || ''
        };
        this.setData({
          caseInfo: info,
          timeline: Array.isArray(data.timeline) ? data.timeline : [],
          documents: Array.isArray(data.documents) ? data.documents : [],
          parties: Array.isArray(data.parties) ? data.parties : []
        });
      }).catch((err) => {
        wx.hideLoading();
        if (err.statusCode === 401) {
          wx.redirectTo({ url: '/pages/login/login' });
          return;
        }
        wx.showToast({ title: err.message || '加载失败', icon: 'none' });
      });
      if (options && options.id) {
        // 保留原有逻辑：根据ID可设置客户姓名等
        // 这里模拟从参数中获取客户姓名（若有）
        if (options.client) {
          this.setData({ 'caseInfo.client': decodeURIComponent(options.client) });
        }
        // 模拟绑定状态（应从后端获取）
        this.setData({ isBound: false });
      }
    },
  
    // ========== 折叠/展开切换（增强版：折叠时自动退出编辑）==========
    toggleTimeline: function() {
      if (this.data.timelineExpanded && this.data.timelineEditing) {
        this.cancelEditTimeline();
      }
      this.setData({ timelineExpanded: !this.data.timelineExpanded });
    },
    toggleDocuments: function() {
      if (this.data.documentsExpanded && this.data.documentsEditing) {
        this.cancelEditDocuments();
      }
      this.setData({ documentsExpanded: !this.data.documentsExpanded });
    },
    toggleParties: function() {
      if (this.data.partiesExpanded && this.data.partiesEditing) {
        this.cancelEditParties();
      }
      this.setData({ partiesExpanded: !this.data.partiesExpanded });
    },
  
    // ========== 编辑模式控制 ==========
    startEditTimeline: function() {
      this.setData({
        timelineBackup: JSON.parse(JSON.stringify(this.data.timeline)),
        timelineEditing: true,
        showTimelineAddForm: false
      });
    },
    startEditDocuments: function() {
      this.setData({
        documentsBackup: JSON.parse(JSON.stringify(this.data.documents)),
        documentsEditing: true
      });
    },
    startEditParties: function() {
      this.setData({
        partiesBackup: JSON.parse(JSON.stringify(this.data.parties)),
        partiesEditing: true,
        showPartiesAddForm: false
      });
    },
  
    cancelEditTimeline: function() {
      this.setData({
        timeline: JSON.parse(JSON.stringify(this.data.timelineBackup)),
        timelineEditing: false,
        timelineBackup: [],
        showTimelineAddForm: false
      });
    },
    cancelEditDocuments: function() {
      this.setData({
        documents: JSON.parse(JSON.stringify(this.data.documentsBackup)),
        documentsEditing: false,
        documentsBackup: []
      });
    },
    cancelEditParties: function() {
      this.setData({
        parties: JSON.parse(JSON.stringify(this.data.partiesBackup)),
        partiesEditing: false,
        partiesBackup: [],
        showPartiesAddForm: false
      });
    },
  
    saveEditTimeline: function() {
      this.setData({ timelineEditing: false, timelineBackup: [] });
      wx.showToast({ title: '已保存', icon: 'success' });
    },
    saveEditDocuments: function() {
      this.setData({ documentsEditing: false, documentsBackup: [] });
      wx.showToast({ title: '已保存', icon: 'success' });
    },
    saveEditParties: function() {
      this.setData({ partiesEditing: false, partiesBackup: [] });
      wx.showToast({ title: '已保存', icon: 'success' });
    },
  
    // ========== 时间轴编辑 ==========
    showTimelineAdd: function() {
      this.setData({
        newTimelineItem: { date: '', event: '', description: '' },
        showTimelineAddForm: true
      });
    },
    hideTimelineAdd: function() {
      this.setData({ showTimelineAddForm: false });
    },
    onTimelineDateChange: function(e) {
      var date = e.detail.value;
      var parts = date.split('-');
      var year = parts[0];
      var month = parseInt(parts[1]);
      var day = parseInt(parts[2]);
      var formattedDate = year + '.' + month + '.' + day;
      this.setData({ 'newTimelineItem.date': formattedDate });
    },
    onTimelineEventInput: function(e) {
      this.setData({ 'newTimelineItem.event': e.detail.value });
    },
    onTimelineDescInput: function(e) {
      this.setData({ 'newTimelineItem.description': e.detail.value });
    },
    addTimelineItem: function() {
      var newItem = this.data.newTimelineItem;
      if (!newItem.date.trim() || !newItem.event.trim()) {
        wx.showToast({ title: '日期和事件不能为空', icon: 'none' });
        return;
      }
      var timeline = this.data.timeline;
      timeline.push({
        date: newItem.date,
        event: newItem.event,
        description: newItem.description || '',
        status: 'in-progress'
      });
      timeline.sort(this.compareDate);
      this.setData({
        timeline: timeline,
        newTimelineItem: { date: '', event: '', description: '' },
        showTimelineAddForm: false
      });
    },
    deleteTimelineItem: function(e) {
      var index = e.currentTarget.dataset.index;
      var timeline = this.data.timeline;
      timeline.splice(index, 1);
      this.setData({ timeline: timeline });
    },
    compareDate: function(a, b) {
      var dateA = a.date;
      var dateB = b.date;
      var parseDate = function(dateStr) {
        if (dateStr === '开始') return new Date(0);
        if (dateStr === '完成') return new Date(9999, 11, 31);
        var parts = dateStr.split('.');
        return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      };
      return parseDate(dateA) - parseDate(dateB);
    },
  
    // ========== 卷宗编辑 - 真实文件上传 ==========
    uploadDocumentFile: function() {
      var that = this;
      wx.chooseMessageFile({
        count: 1,
        type: 'all',
        success: function(res) {
          var file = res.tempFiles[0];
          var filePath = file.path;
          var fileName = file.name;
          var fileSize = file.size;
          var sizeStr = '';
          if (fileSize < 1024) sizeStr = fileSize + 'B';
          else if (fileSize < 1024 * 1024) sizeStr = (fileSize / 1024).toFixed(1) + 'KB';
          else sizeStr = (fileSize / (1024 * 1024)).toFixed(1) + 'MB';
  
          var documents = that.data.documents;
          documents.push({
            name: fileName,
            type: '其他',
            size: sizeStr,
            date: that.getCurrentDate(),
            uploadedBy: '当前用户',
            filePath: filePath
          });
          that.setData({ documents: documents });
          wx.showToast({ title: '文件已添加', icon: 'success' });
        }
      });
    },
    deleteDocumentItem: function(e) {
      var index = e.currentTarget.dataset.index;
      var documents = this.data.documents;
      documents.splice(index, 1);
      this.setData({ documents: documents });
    },
  
    // ========== 相关方编辑 ==========
    showPartiesAdd: function() {
      this.setData({
        newPartyItem: { name: '', role: '', type: '个人', contact: '', address: '', roleClass: 'party-plaintiff' },
        showPartiesAddForm: true
      });
    },
    hidePartiesAdd: function() {
      this.setData({ showPartiesAddForm: false });
    },
    deletePartyItem: function(e) {
      var index = e.currentTarget.dataset.index;
      var parties = this.data.parties;
      parties.splice(index, 1);
      this.setData({ parties: parties });
    },
    addPartyItem: function() {
      var newItem = this.data.newPartyItem;
      if (!newItem.name.trim() || !newItem.role.trim()) {
        wx.showToast({ title: '姓名和角色不能为空', icon: 'none' });
        return;
      }
      var id = newItem.name.charAt(0);
      var roleClass = 'party-plaintiff';
      if (newItem.role.indexOf('被告') !== -1) roleClass = 'party-defendant';
      else if (newItem.role.indexOf('代理人') !== -1) roleClass = 'party-agent';
      else if (newItem.role.indexOf('证人') !== -1) roleClass = 'party-witness';
  
      var parties = this.data.parties;
      parties.push({
        id: id,
        name: newItem.name,
        role: newItem.role,
        type: newItem.type || '个人',
        contact: newItem.contact || '',
        address: newItem.address || '',
        roleClass: roleClass
      });
      this.setData({
        parties: parties,
        newPartyItem: { name: '', role: '', type: '个人', contact: '', address: '', roleClass: 'party-plaintiff' },
        showPartiesAddForm: false
      });
    },
    onPartyNameInput: function(e) {
      this.setData({ 'newPartyItem.name': e.detail.value });
    },
    onPartyRoleInput: function(e) {
      this.setData({ 'newPartyItem.role': e.detail.value });
    },
    onPartyTypeInput: function(e) {
      this.setData({ 'newPartyItem.type': e.detail.value });
    },
    onPartyContactInput: function(e) {
      this.setData({ 'newPartyItem.contact': e.detail.value });
    },
    onPartyAddressInput: function(e) {
      this.setData({ 'newPartyItem.address': e.detail.value });
    },
  
    // ========== 辅助函数 ==========
    getCurrentDate: function() {
      var now = new Date();
      var year = now.getFullYear();
      var month = now.getMonth() + 1;
      var day = now.getDate();
      return year + '.' + month + '.' + day;
    },
  
    // ========== 文件真实预览/下载（菜单）==========
    showFileActions: function(e) {
      var index = e.currentTarget.dataset.index;
      if (index === undefined) {
        console.error('未获取到文件索引');
        return;
      }
      var file = this.data.documents[index];
      if (!file) {
        wx.showToast({ title: '文件不存在', icon: 'none' });
        return;
      }
      var that = this;
      wx.showActionSheet({
        itemList: ['预览文件', '下载文件'],
        success: function(res) {
          if (res.tapIndex === 0) {
            that.previewFile(file);
          } else if (res.tapIndex === 1) {
            that.downloadFile(file);
          }
        },
        fail: function(err) {
          console.error('操作菜单打开失败', err);
          wx.showToast({ title: '操作失败', icon: 'none' });
        }
      });
    },
  
    previewFile: function(file) {
      if (!file.filePath) {
        wx.showToast({ title: '文件不存在', icon: 'none' });
        return;
      }
      wx.openDocument({
        filePath: file.filePath,
        success: function() { console.log('预览成功'); },
        fail: function(err) {
          console.error(err);
          wx.showToast({ title: '预览失败', icon: 'none' });
        }
      });
    },
  
    downloadFile: function(file) {
      if (!file.filePath) {
        wx.showToast({ title: '文件不存在', icon: 'none' });
        return;
      }
      wx.saveFile({
        tempFilePath: file.filePath,
        success: function(res) {
          wx.showToast({ title: '下载成功', icon: 'success' });
          console.log('保存路径:', res.savedFilePath);
        },
        fail: function(err) {
          console.error(err);
          wx.showToast({ title: '下载失败', icon: 'none' });
        }
      });
    },
  
    // ========== 相关方操作 - 联系按钮（直接拨号）==========
    callParty: function(e) {
      var index = e.currentTarget.dataset.index;
      var party = this.data.parties[index];
      if (!party.contact) {
        wx.showToast({ title: '该相关方未提供联系方式', icon: 'none' });
        return;
      }
      wx.makePhoneCall({
        phoneNumber: party.contact
      });
    },
  
    // ========== 生成8位随机绑定码 ==========
    generateBindCode: function() {
      var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      var code = '';
      for (var i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return code;
    },
  
    // ========== 绑定客户（浮窗展示绑定码）==========
    bindClient: function() {
      var bindCode = this.generateBindCode();
      console.log('案件绑定码:', bindCode);
      this.setData({
        bindCode: bindCode,
        showBindModal: true,
        isBound: true // 演示：生成绑定码即视为已绑定（实际需请求后端）
      });
    },
  
    // ========== 复制绑定码 ==========
    copyBindCode: function() {
      var that = this;
      wx.setClipboardData({
        data: this.data.bindCode,
        success: function() {
          wx.showToast({ title: '绑定码已复制', icon: 'success' });
          that.closeBindModal();
        }
      });
    },
  
    // ========== 关闭绑定码浮窗 ==========
    closeBindModal: function() {
      this.setData({ showBindModal: false });
    },
  
    // ========== 联系客户（已绑定跳转聊天页）==========
    contactClient: function() {
      if (!this.data.isBound) {
        var that = this;
        wx.showModal({
          title: '提示',
          content: '该案件尚未绑定客户，请先完成绑定',
          confirmText: '去绑定',
          cancelText: '取消',
          success: function(res) {
            if (res.confirm) {
              that.bindClient(); // 跳转至绑定流程
            }
          }
        });
        return;
      }
      // 已绑定，跳转到聊天页面（与案件列表页路径一致）
      wx.navigateTo({
        url: `/subpackages/lawyer/pages/communication/communication?caseId=${encodeURIComponent(this.data.caseInfo.caseNo)}&client=${encodeURIComponent(this.data.caseInfo.client || '客户')}`
      });
    },
  
    // ========== 原有功能（保留）==========
    goBack: function() {
      wx.navigateBack();
    },
    shareCase: function() {
      wx.showShareMenu({ withShareTicket: true });
    },
    copyCaseNo: function() {
      var that = this;
      wx.setClipboardData({
        data: that.data.caseInfo.caseNo,
        success: function() {
          wx.showToast({ title: '案号已复制', icon: 'success' });
        }
      });
    }
  });