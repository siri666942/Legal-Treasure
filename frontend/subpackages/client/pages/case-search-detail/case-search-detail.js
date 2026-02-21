// subpackages/lawyer/pages/history-case-detail/history-case-detail.js
Page({
    data: {
      // 案件基本信息
      caseInfo: {
        caseNo: '(2023)沪01民终3456号',
        caseTitle: '张三诉李四合同纠纷上诉案',
        caseType: '民事案件 - 合同纠纷',
        court: '上海市高级人民法院',
        judge: '王法官',
        filingDate: '2023年5月20日',
        closeDate: '2023年11月15日',
        status: '已结案',
        amount: '¥ 1,500,000',
        applicableLaw: '《中华人民共和国民法典》第五百七十七条、第五百八十四条'
      },
  
      // 办理律师信息
      lawyerInfo: {
        name: '张伟律师',
        lawFirm: '上海正义律师事务所',
        licenseNo: '13101199810123456',
        phone: '13800138000',
        email: 'zhangwei@zhengyi-law.com',
        avatar: '张',
        experience: '15年',
        specialty: '合同纠纷、公司法律事务'
      },
  
      // 时间轴数据
      timeline: [
        { date: '2023.05.20', event: '案件受理', description: '上海市高级人民法院立案受理' },
        { date: '2023.06.10', event: '提交上诉状', description: '上诉人张三提交上诉状及证据材料' },
        { date: '2023.07.05', event: '庭前会议', description: '组织双方交换证据，明确争议焦点' },
        { date: '2023.08.22', event: '第一次开庭', description: '公开开庭审理，双方质证辩论' },
        { date: '2023.09.18', event: '第二次开庭', description: '补充调查，专家证人出庭' },
        { date: '2023.10.30', event: '合议庭评议', description: '合议庭进行案件评议' },
        { date: '2023.11.15', event: '宣判结案', description: '当庭宣判，送达判决书' }
      ],
  
      // 关联卷宗（增加 filePath 字段）
      documents: [
        { name: '起诉状', type: '起诉材料', size: '1.5MB', date: '2023.05.10', uploadedBy: '张三', filePath: '' },
        { name: '答辩状', type: '答辩材料', size: '1.2MB', date: '2023.05.25', uploadedBy: '李四', filePath: '' },
        { name: '证据目录', type: '证据材料', size: '3.8MB', date: '2023.06.05', uploadedBy: '张伟律师', filePath: '' },
        { name: '庭审笔录', type: '庭审材料', size: '2.1MB', date: '2023.08.22', uploadedBy: '法院书记员', filePath: '' },
        { name: '代理词', type: '代理材料', size: '0.8MB', date: '2023.09.10', uploadedBy: '张伟律师', filePath: '' },
        { name: '判决书', type: '裁判文书', size: '1.0MB', date: '2023.11.15', uploadedBy: '法院', filePath: '' }
      ],
  
      // 案件相关方（仅展示，无操作）
      parties: [
        {
          id: '甲',
          name: '张三',
          role: '上诉人/原告',
          type: '个人',
          contact: '138****1234',
          address: '上海市浦东新区',
          roleClass: 'party-plaintiff'
        },
        {
          id: '乙',
          name: '李四',
          role: '被上诉人/被告',
          type: '个人',
          contact: '139****5678',
          address: '上海市徐汇区',
          roleClass: 'party-defendant'
        },
        {
          id: '丙',
          name: '王五',
          role: '第三人',
          type: '公司',
          contact: '',
          address: '上海市长宁区XX公司',
          roleClass: 'party-third'
        },
        {
          id: '丁',
          name: '上海正义律师事务所',
          role: '原告代理机构',
          type: '机构',
          contact: '021-12345678',
          address: '上海市黄浦区',
          roleClass: 'party-agency'
        },
        {
          id: '戊',
          name: '赵六',
          role: '证人',
          type: '个人',
          contact: '136****9012',
          address: '上海市静安区',
          roleClass: 'party-witness'
        }
      ],
  
      // 判决结果
      judgment: {
        result: '驳回上诉，维持原判',
        summary: '本院认为，原审判决认定事实清楚，适用法律正确，程序合法。上诉人的上诉理由不能成立，本院不予支持。',
        details: [
          '一、驳回上诉人张三的全部上诉请求；',
          '二、维持上海市第一中级人民法院(2023)沪01民初1234号民事判决；',
          '三、二审案件受理费15,000元，由上诉人张三负担；',
          '四、本判决为终审判决。'
        ],
        decisionDate: '2023年11月15日',
        effectiveDate: '2023年11月30日',
        judgePanel: '审判长：王法官；审判员：李法官、赵法官',
        courtSeal: '上海市高级人民法院'
      },
  
      // 是否显示完整判决详情
      showFullJudgment: false
    },
  
    onLoad: function(options) {
      console.log('过往案件详情页面加载');
      if (options.id) {
        console.log('案件ID:', options.id);
      }
    },
  
    // ========== 关联卷宗 - 真实预览/下载 ==========
    showFileActions: function(e) {
      const index = e.currentTarget.dataset.index;
      const file = this.data.documents[index];
      if (!file) return;
  
      wx.showActionSheet({
        itemList: ['预览文件', '下载文件'],
        success: (res) => {
          if (res.tapIndex === 0) {
            this.previewFile(file);
          } else if (res.tapIndex === 1) {
            this.downloadFile(file);
          }
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
        success: () => console.log('预览成功'),
        fail: (err) => {
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
        success: (res) => {
          wx.showToast({ title: '下载成功', icon: 'success' });
          console.log('保存路径:', res.savedFilePath);
        },
        fail: (err) => {
          console.error(err);
          wx.showToast({ title: '下载失败', icon: 'none' });
        }
      });
    },
  
    // ========== 联系律师（保留）==========
    callLawyer: function() {
      const lawyer = this.data.lawyerInfo;
      wx.showModal({
        title: '联系律师',
        content: `是否拨打 ${lawyer.name} 的电话 ${lawyer.phone}？`,
        confirmText: '拨打',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            wx.makePhoneCall({ phoneNumber: lawyer.phone });
          }
        }
      });
    },
  
    // ========== 判决结果折叠 ==========
    toggleJudgment: function() {
      this.setData({ showFullJudgment: !this.data.showFullJudgment });
    },
  
    // ========== 其他功能 ==========
    goBack: function() {
      wx.navigateBack();
    },
  
    shareCase: function() {
      wx.showShareMenu({ withShareTicket: true });
    },
  
    copyCaseNo: function() {
      wx.setClipboardData({
        data: this.data.caseInfo.caseNo,
        success: () => wx.showToast({ title: '案号已复制', icon: 'success' })
      });
    }
  });