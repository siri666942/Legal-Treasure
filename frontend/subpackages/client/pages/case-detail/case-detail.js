// subpackages/client/pages/case-detail/case-detail.js
const request = require('../../../common/utils/request.js');

Page({
    data: {
      timelineExpanded: false,
      documentsExpanded: false,
      partiesExpanded: false,
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
      if (options && options.client) {
        this.setData({ 'caseInfo.client': decodeURIComponent(options.client) });
      }
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
          client: data.client || this.data.caseInfo.client || ''
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
    },
  
    // ========== 折叠/展开切换 ==========
    toggleTimeline: function() {
      this.setData({ timelineExpanded: !this.data.timelineExpanded });
    },
    toggleDocuments: function() {
      this.setData({ documentsExpanded: !this.data.documentsExpanded });
    },
    toggleParties: function() {
      this.setData({ partiesExpanded: !this.data.partiesExpanded });
    },
  
    // ========== 文件真实预览/下载 ==========
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
  
    // ========== 联系律师 ==========
    contactLawyer: function() {
      wx.navigateTo({
        url: '/subpackages/client/pages/communication/communication',
        fail: function() {
          wx.showToast({
            title: '页面不存在',
            icon: 'none'
          });
        }
      });
    },
  
    // ========== 其他功能 ==========
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