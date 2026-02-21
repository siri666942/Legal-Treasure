// scripts/quick-fix.js
const fs = require('fs');
const path = require('path');

console.log('🚀 快速修复工具函数问题...\n');

// 1. 修复 storage.js 的导出
const storagePath = path.join('common/utils/storage.js');
let storageContent = fs.readFileSync(storagePath, 'utf8');

// 确保有默认导出
if (!storageContent.includes('export default')) {
  storageContent += '\n\nexport default {\n' +
    '  set: setStorage,\n' +
    '  get: getStorage,\n' +
    '  remove: removeStorage,\n' +
    '  clear: clearStorage,\n' +
    '  has: hasStorage,\n' +
    '  info: getStorageInfo,\n' +
    '  setBatch: setStorageBatch,\n' +
    '  getBatch: getStorageBatch\n' +
    '};\n';
  
  fs.writeFileSync(storagePath, storageContent);
  console.log('✅ 修复 storage.js 导出');
}

// 2. 修复 router.js 的导出
const routerPath = path.join('common/utils/router.js');
let routerContent = fs.readFileSync(routerPath, 'utf8');

// 确保有默认导出
if (!routerContent.includes('export default')) {
  const exportSection = `export default {
  to: navigateTo,
  redirect: redirectTo,
  back: navigateBack,
  switchTab,
  reLaunch,
  forResult: navigateForResult,
  getPages: getCurrentPages,
  getCurrentPage,
  getRoute: getCurrentRoute,
  withAuth: navigateWithAuth,
  backWithData
};`;
  
  if (routerContent.includes('// 默认导出')) {
    routerContent = routerContent.replace('// 默认导出', exportSection);
  } else {
    routerContent += '\n\n' + exportSection;
  }
  
  fs.writeFileSync(routerPath, routerContent);
  console.log('✅ 修复 router.js 导出');
}

// 3. 修复所有工具文件的导出格式
const utilsFiles = [
  'request.js', 'validate.js', 'date.js', 'constants.js', 'cache.js', 'debounce.js'
];

utilsFiles.forEach(file => {
  const filePath = path.join('common/utils', file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 检查是否有默认导出
    if (!content.includes('export default')) {
      // 根据不同文件添加不同的默认导出
      let defaultExport = '';
      
      if (file === 'request.js') {
        defaultExport = '\n\nexport default {\n' +
          '  config,\n' +
          '  get,\n' +
          '  post,\n' +
          '  put,\n' +
          '  delete: del,\n' +
          '  uploadFile,\n' +
          '  downloadFile,\n' +
          '  addInterceptor,\n' +
          '  removeInterceptor\n' +
          '};';
      } else if (file === 'validate.js') {
        defaultExport = '\n\nexport default {\n' +
          '  REGEX,\n' +
          '  phone: validatePhone,\n' +
          '  email: validateEmail,\n' +
          '  idCard: validateIdCard,\n' +
          '  password: validatePassword,\n' +
          '  url: validateUrl,\n' +
          '  numeric: validateNumeric,\n' +
          '  required: validateRequired,\n' +
          '  length: validateLength,\n' +
          '  range: validateRange,\n' +
          '  fileType: validateFileType,\n' +
          '  fileSize: validateFileSize,\n' +
          '  form: validateForm\n' +
          '};';
      } else if (file === 'date.js') {
        defaultExport = '\n\nexport default {\n' +
          '  format: formatDate,\n' +
          '  relative: formatRelativeTime,\n' +
          '  range: getDateRange,\n' +
          '  addDays,\n' +
          '  addMonths,\n' +
          '  addYears,\n' +
          '  diffDays,\n' +
          '  age: calculateAge,\n' +
          '  duration: formatDuration,\n' +
          '  weekday: getWeekday,\n' +
          '  inRange: isDateInRange\n' +
          '};';
      } else if (file === 'constants.js') {
        defaultExport = '\n\nexport default {\n' +
          '  APP_CONFIG,\n' +
          '  USER_ROLES,\n' +
          '  CASE_STATUS,\n' +
          '  CASE_STATUS_MAP,\n' +
          '  CASE_STATUS_COLORS,\n' +
          '  FILE_TYPES,\n' +
          '  LIMITS,\n' +
          '  ERROR_CODES,\n' +
          '  ERROR_MESSAGES,\n' +
          '  STORAGE_KEYS,\n' +
          '  PAGES,\n' +
          '  SUBPACKAGES,\n' +
          '  COLORS\n' +
          '};';
      } else if (file === 'cache.js') {
        defaultExport = '\n\nexport default cache;\nexport { CacheManager };';
      } else if (file === 'debounce.js') {
        defaultExport = '\n\nexport default {\n' +
          '  debounce,\n' +
          '  throttle\n' +
          '};';
      }
      
      if (defaultExport) {
        content += defaultExport;
        fs.writeFileSync(filePath, content);
        console.log('✅ 修复 ' + file + ' 导出');
      }
    }
  }
});

// 4. 修复 index.js
const indexPath = path.join('common/utils/index.js');
const indexContent = `// common/utils/index.js

// 导出所有工具
export { default as request } from './request';
export { default as storage } from './storage';
export { default as validate } from './validate';
export { default as date } from './date';
export { default as constants } from './constants';
export { default as router } from './router';
export { default as cache } from './cache';
export { default as debounce } from './debounce';

// 导入所有默认导出
import request from './request';
import storage from './storage';
import validate from './validate';
import date from './date';
import constants from './constants';
import router from './router';
import cache from './cache';
import debounce from './debounce';

// 统一工具对象
const utils = {
  request,
  storage,
  validate,
  date,
  constants,
  router,
  cache,
  debounce
};

// 默认导出
export default utils;

// 快捷方式
export const $request = request;
export const $storage = storage;
export const $validate = validate;
export const $date = date;
export const $constants = constants;
export const $router = router;
export const $cache = cache;
export const $debounce = debounce;
`;

fs.writeFileSync(indexPath, indexContent);
console.log('✅ 修复 index.js');

// 5. 创建简单的诊断页面
const simpleTestDir = path.join('pages/test-simple');
if (!fs.existsSync(simpleTestDir)) {
  fs.mkdirSync(simpleTestDir, { recursive: true });
}

const simpleFiles = {
  'test-simple.js': `Page({
  data: {
    logs: []
  },

  onLoad: function() {
    this.log('页面加载');
    this.testBasic();
  },

  log: function(message) {
    var logs = this.data.logs;
    logs.push({
      time: new Date().toLocaleTimeString(),
      message: message
    });
    this.setData({ logs: logs });
  },

  testBasic: function() {
    var that = this;
    
    // 1. 测试工具函数导入
    that.log('检查工具函数导入...');
    
    var tools = ['request', 'storage', 'validate', 'date', 'constants', 'router'];
    tools.forEach(function(tool) {
      try {
        var module = require('../../common/utils/' + tool + '.js');
        if (module && module.default) {
          that.log('✅ ' + tool + '.js 导入成功');
        } else {
          that.log('⚠️ ' + tool + '.js 导入但格式异常');
        }
      } catch (e) {
        that.log('❌ ' + tool + '.js 导入失败: ' + e.message);
      }
    });
    
    // 2. 测试 index.js
    try {
      var utils = require('../../common/utils/index.js');
      that.log('✅ index.js 导入成功');
      console.log('工具列表:', Object.keys(utils.default || utils));
    } catch (e) {
      that.log('❌ index.js 导入失败: ' + e.message);
    }
    
    // 3. 测试基本存储功能
    try {
      wx.setStorageSync('test_key', 'test_value');
      var value = wx.getStorageSync('test_key');
      if (value === 'test_value') {
        that.log('✅ 基础存储功能正常');
      }
      wx.removeStorageSync('test_key');
    } catch (e) {
      that.log('❌ 基础存储失败: ' + e.message);
    }
  },

  exportLogs: function() {
    var logs = this.data.logs;
    var logText = '简单测试报告:\\n\\n';
    
    logs.forEach(function(log) {
      logText += '[' + log.time + '] ' + log.message + '\\n';
    });
    
    wx.setClipboardData({
      data: logText,
      success: function() {
        wx.showToast({
          title: '日志已复制',
          icon: 'success'
        });
      }
    });
  }
});`,

  'test-simple.json': `{
  "navigationBarTitleText": "简单测试",
  "usingComponents": {}
}`,

  'test-simple.wxml': `<view class="container">
  <view class="header">
    <text>简单测试页面</text>
  </view>
  
  <button bindtap="testBasic">运行测试</button>
  <button bindtap="exportLogs">导出日志</button>
  
  <view class="logs">
    <view wx:for="{{logs}}" wx:key="index" class="log-item">
      <text class="log-time">[{{item.time}}]</text>
      <text class="log-message">{{item.message}}</text>
    </view>
  </view>
</view>`,

  'test-simple.wxss': `.container {
  padding: 20rpx;
}

.logs {
  margin-top: 40rpx;
}

.log-item {
  padding: 10rpx 0;
  border-bottom: 1rpx solid #eee;
}`
};

Object.entries(simpleFiles).forEach(([filename, content]) => {
  fs.writeFileSync(path.join(simpleTestDir, filename), content);
});

console.log('✅ 创建简单测试页面');

console.log('\n🎉 修复完成！请按以下步骤操作：');
console.log('1. 运行修复脚本: node scripts/quick-fix.js');
console.log('2. 重新编译小程序');
console.log('3. 访问新页面: pages/test-simple/test-simple');
console.log('4. 点击"运行测试"，然后"导出日志"');
console.log('5. 将导出的日志粘贴给我分析');