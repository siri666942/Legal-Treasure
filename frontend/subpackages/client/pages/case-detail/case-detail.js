// subpackages/client/pages/case-detail/case-detail.js
Page({
    data: {
      // 折叠状态（初始均为折叠）
      timelineExpanded: false,
      documentsExpanded: false,
      partiesExpanded: false,
  
      // 案件基本信息
      caseInfo: {
        caseNo: '(2024)沪01民初1234号',
        caseTitle: '张三诉李四合同纠纷案',
        caseType: '民事纠纷 - 合同纠纷',
        court: '上海市第一中级人民法院',
        judge: '张法官',
        filingDate: '2024年3月15日',
        closeDate: '',
        amount: '¥ 1,250,000',
        applicableLaw: '《中华人民共和国民法典》第五百七十七条',
        client: '张三'
      },
  
      // 时间轴数据
      timeline: [
        { date: '开始', event: '案件立案', description: '法院受理，分配案号', status: 'completed' },
        { date: '2025.12.21', event: '法院受理，分配案号', description: '案号(2024)沪01民初1234号', status: 'completed' },
        { date: '2025.12.30', event: '证据交换阶段完成', description: '双方完成证据交换', status: 'completed' },
        { date: '2026.1.12', event: '第一次开庭审理', description: '公开开庭审理', status: 'completed' },
        { date: '2026.1.21', event: '补充证据提交', description: '原告补充提交证据', status: 'in-progress' },
        { date: '完成', event: '等待判决', description: '', status: 'upcoming' }
      ],
  
      // 关联卷宗数据
      documents: [
        { name: '起诉状', type: '起诉材料', size: '1.2 MB', date: '2025.12.15', uploadedBy: '张三', filePath: '' },
        { name: '答辩状', type: '答辩材料', size: '0.8 MB', date: '2025.12.28', uploadedBy: '李四', filePath: '' },
        { name: '证据材料', type: '证据材料', size: '3.5 MB', date: '2026.1.5', uploadedBy: '张伟律师', filePath: '' },
        { name: '代理词', type: '代理材料', size: '0.5 MB', date: '2026.1.18', uploadedBy: '张伟律师', filePath: '' }
      ],
  
      // 案件相关方数据
      parties: [
        { id: '甲', name: '甲', role: '原告', type: '个人', contact: '138****1234', address: '上海市浦东新区', roleClass: 'party-plaintiff' },
        { id: '乙', name: '乙', role: '被告', type: '个人', contact: '139****5678', address: '上海市徐汇区', roleClass: 'party-defendant' },
        { id: '丙', name: '丙', role: '原告代理人', type: '个人', contact: '136****9012', address: '上海正义律师事务所', roleClass: 'party-agent' },
        { id: '丁', name: '丁', role: '被告代理人', type: '个人', contact: '137****3456', address: '上海正大律师事务所', roleClass: 'party-agent' },
        { id: '戊', name: '戊', role: '证人', type: '个人', contact: '', address: '上海市静安区', roleClass: 'party-witness' }
      ]
    },
  
    onLoad: function(options) {
      console.log('案件详情页面加载');
      if (options && options.id) {
        console.log('案件ID:', options.id);
        if (options.client) {
          this.setData({ 'caseInfo.client': decodeURIComponent(options.client) });
        }
      }
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