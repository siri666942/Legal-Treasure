// subpackages/client/pages/payment/payment.js
Page({
    data: {
      caseInfo: {
        caseName: '王某与李某房屋买卖合同纠纷案',
        courtName: '北京市朝阳区人民法院',
        totalFee: '8725',
        status: 'pending', // pending, paid, overdue
        statusText: '待缴费',
        statusClass: 'status-pending'
      },
      
      feeDetails: [
        {
          id: 1,
          name: '案件受理费',
          description: '根据《诉讼费用交纳办法》第13条规定',
          amount: '2500'
        },
        {
          id: 2,
          name: '保全申请费',
          description: '财产保全费用',
          amount: '1520'
        },
        {
          id: 3,
          name: '鉴定费',
          description: '房屋质量鉴定费用',
          amount: '3500'
        },
        {
          id: 4,
          name: '公告费',
          description: '法院公告送达费用',
          amount: '500'
        },
        {
          id: 5,
          name: '其他诉讼费',
          description: '材料复印、邮寄等费用',
          amount: '705'
        }
      ],
      
      feeExplanation: '费用计算依据《诉讼费用交纳办法》（国务院令第481号）及最高人民法院相关规定。具体计算方式如下：\n\n1. 案件受理费：按诉讼标的金额的0.5%计算，不足1000元按1000元收取\n2. 保全申请费：财产数额不超过1000元或不涉及财产数额的，每件交纳30元；超过1000元至10万元的部分，按照1%交纳\n3. 鉴定费：根据鉴定机构收费标准确定\n4. 公告费：按实际发生费用计算\n5. 其他诉讼费：包括材料复印、邮寄、交通等实际支出费用'
    },
  
    onLoad(options) {
      // 这里可以根据传入的案件ID加载具体的费用信息
      const caseId = options.caseId;
      this.loadPaymentInfo(caseId);
    },
  
    // 加载支付信息
    loadPaymentInfo(caseId) {
      // 这里应该根据caseId从服务器获取数据
      // 目前使用模拟数据
      console.log('加载案件支付信息，案件ID:', caseId);
      
      // 可以根据caseId设置不同的状态
      // 模拟不同状态
      const statusMap = {
        '1': { status: 'pending', text: '待缴费', class: 'status-pending' },
        '2': { status: 'paid', text: '已支付', class: 'status-paid' },
        '3': { status: 'overdue', text: '已逾期', class: 'status-overdue' }
      };
      
      if (statusMap[caseId]) {
        const statusInfo = statusMap[caseId];
        this.setData({
          'caseInfo.status': statusInfo.status,
          'caseInfo.statusText': statusInfo.text,
          'caseInfo.statusClass': statusInfo.class
        });
      }
    },
  
    // 支付按钮点击事件
    onPaymentTap() {
      const totalFee = this.data.caseInfo.totalFee;
      
      wx.showModal({
        title: '确认支付',
        content: `是否确认支付${totalFee}元诉讼费用？`,
        confirmText: '确认支付',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            this.handlePayment();
          }
        }
      });
    },
  
    // 处理支付逻辑
    handlePayment() {
      wx.showLoading({
        title: '支付中...',
        mask: true
      });
      
      // 模拟支付过程
      setTimeout(() => {
        wx.hideLoading();
        
        // 模拟支付成功
        wx.showModal({
          title: '支付成功',
          content: '诉讼费用支付成功，系统已自动生成缴费凭证。',
          showCancel: false,
          confirmText: '确定',
          success: (res) => {
            if (res.confirm) {
              // 更新支付状态
              this.setData({
                'caseInfo.status': 'paid',
                'caseInfo.statusText': '已支付',
                'caseInfo.statusClass': 'status-paid'
              });
              
              // 显示支付凭证
              this.showPaymentReceipt();
            }
          }
        });
      }, 2000);
    },
  
    // 显示支付凭证
    showPaymentReceipt() {
      wx.showModal({
        title: '缴费凭证',
        content: `支付金额：${this.data.caseInfo.totalFee}元\n支付时间：${this.getCurrentTime()}\n支付方式：微信支付\n凭证编号：${this.generateReceiptNo()}\n\n请妥善保存此凭证，如需发票请凭此凭证联系法院财务处。`,
        confirmText: '保存凭证',
        cancelText: '返回',
        success: (res) => {
          if (res.confirm) {
            // 保存凭证到本地或分享
            this.saveReceipt();
          }
        }
      });
    },
  
    // 获取当前时间
    getCurrentTime() {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    },
  
    // 生成凭证编号
    generateReceiptNo() {
      const random = Math.floor(Math.random() * 1000000);
      return `SP${new Date().getTime()}${String(random).padStart(6, '0')}`;
    },
  
    // 保存凭证
    saveReceipt() {
      wx.showToast({
        title: '凭证已保存',
        icon: 'success',
        duration: 2000
      });
    },
  
    onShareAppMessage() {
      return {
        title: '诉讼费用支付',
        path: '/subpackages/client/pages/payment/payment'
      };
    }
  });