// scripts/fix-components.js
const fs = require('fs');
const path = require('path');

console.log('🔧 开始修复组件配置...\n');

// 1. 检查并修复组件配置
function fixComponentConfigs() {
  const componentsDir = path.join(__dirname, '../common/components');
  const componentTypes = ['basic', 'form', 'business'];
  
  componentTypes.forEach(type => {
    const typePath = path.join(componentsDir, type);
    if (fs.existsSync(typePath)) {
      const items = fs.readdirSync(typePath);
      items.forEach(item => {
        const componentPath = path.join(typePath, item);
        if (fs.statSync(componentPath).isDirectory()) {
          const jsonPath = path.join(componentPath, `${item}.json`);
          if (fs.existsSync(jsonPath)) {
            try {
              const config = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
              // 确保有 component: true
              if (!config.component) {
                config.component = true;
                fs.writeFileSync(jsonPath, JSON.stringify(config, null, 2));
                console.log(`✅ 修复 ${type}/${item} 组件配置`);
              }
            } catch (e) {
              console.log(`❌ 无法修复 ${type}/${item}: ${e.message}`);
            }
          }
        }
      });
    }
  });
}

// 2. 生成路径测试报告
function generatePathReport() {
  console.log('\n📊 组件路径报告:');
  
  const testPagePath = '/pages/test-components/index';
  const components = [
    { name: 'nav-bar', path: '/common/components/basic/nav-bar/nav-bar' },
    { name: 'lubao-button', path: '/common/components/basic/button/button' }
  ];
  
  console.log(`测试页面: ${testPagePath}`);
  console.log('\n建议的解决方案:');
  console.log('1. 清理微信开发者工具缓存');
  console.log('2. 重启微信开发者工具');
  console.log('3. 如果仍有问题，尝试以下路径格式:');
  console.log('   - 绝对路径: /common/components/basic/nav-bar/nav-bar');
  console.log('   - 相对路径: ../../../common/components/basic/nav-bar/nav-bar');
  console.log('   - 简化路径: /common/components/basic/nav-bar');
}

// 3. 创建备用测试页面
function createBackupTestPage() {
  const backupPage = {
    js: `Page({
  data: {
    message: '备用测试页面'
  },
  onLoad() {
    console.log('备用测试页面加载');
  }
})`,
    json: `{
  "usingComponents": {
    "nav-bar": "/common/components/basic/nav-bar/nav-bar"
  },
  "navigationBarTitleText": "备用测试"
}`,
    wxml: `<view class="container">
  <nav-bar title="备用测试" show-back="{{true}}"></nav-bar>
  <view class="content">
    <text>{{message}}</text>
    <text>如果这个页面能正常显示，说明nav-bar组件可用</text>
  </view>
</view>`,
    wxss: `.container {
  padding: 20rpx;
}
.content {
  margin-top: 40rpx;
  text-align: center;
}`
  };
  
  const backupDir = path.join(__dirname, '../pages/backup-test');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  
  fs.writeFileSync(path.join(backupDir, 'index.js'), backupPage.js);
  fs.writeFileSync(path.join(backupDir, 'index.json'), backupPage.json);
  fs.writeFileSync(path.join(backupDir, 'index.wxml'), backupPage.wxml);
  fs.writeFileSync(path.join(backupDir, 'index.wxss'), backupPage.wxss);
  
  console.log('\n✅ 创建备用测试页面: pages/backup-test/index');
}

// 执行修复
fixComponentConfigs();
generatePathReport();
createBackupTestPage();

console.log('\n🎯 修复完成！请执行以下步骤:');
console.log('1. 在 app.json 中添加页面路由: "pages/backup-test/index"');
console.log('2. 清理微信开发者工具缓存');
console.log('3. 重新编译项目');
console.log('4. 访问 pages/backup-test/index 测试组件');