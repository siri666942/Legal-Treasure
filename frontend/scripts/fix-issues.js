// scripts/fix-issues.js
const fs = require('fs');
const path = require('path');

console.log('🔧 开始修复问题...\n');

// 1. 修复 cache.js
const cachePath = path.join('common/utils/cache.js');
let cacheContent = fs.readFileSync(cachePath, 'utf8');

// 替换变量名
cacheContent = cacheContent.replace(
  /const cache = new CacheManager\(\);/g,
  'const defaultCache = new CacheManager();'
);
cacheContent = cacheContent.replace(
  /export default cache;/g,
  'export default defaultCache;'
);

fs.writeFileSync(cachePath, cacheContent, 'utf8');
console.log('✅ 修复 cache.js');

// 2. 修复 event-bus.js
const eventBusPath = path.join('common/utils/event-bus.js');
let eventBusContent = fs.readFileSync(eventBusPath, 'utf8');

eventBusContent = eventBusContent.replace(
  /const eventBus = new EventBus\(\);/g,
  'const globalEventBus = new EventBus();'
);
eventBusContent = eventBusContent.replace(
  /export default eventBus;/g,
  'export default globalEventBus;'
);

fs.writeFileSync(eventBusPath, eventBusContent, 'utf8');
console.log('✅ 修复 event-bus.js');

// 3. 修复 index.js
const indexPath = path.join('common/utils/index.js');
const indexContent = `// common/utils/index.js
// 只使用 export * from 语句，避免冲突

export * from './request';
export * from './validate';
export * from './date';
export * from './string';
export * from './file';
export * from './storage';
export * from './router';
export * from './routes';
export * from './constants';
export * from './encrypt';
export * from './device';
export * from './formatter';
export * from './performance';
export * from './logger';
export * from './event-bus';
export * from './cache';
export * from './debounce';
export * from './throttle';

// 创建安全的默认导出
import request from './request';
import validate from './validate';
import date from './date';
import string from './string';
import file from './file';
import storage from './storage';
import router from './router';
import routes from './routes';
import constants from './constants';
import encrypt from './encrypt';
import device from './device';
import formatter from './formatter';
import performance from './performance';
import logger from './logger';
import eventBus from './event-bus';
import cache from './cache';
import debounce from './debounce';
import throttle from './throttle';

const utils = {
  request,
  validate,
  date,
  string,
  file,
  storage,
  router,
  routes,
  constants,
  encrypt,
  device,
  formatter,
  performance,
  logger,
  eventBus,
  cache,
  debounce,
  throttle
};

export default utils;
`;

fs.writeFileSync(indexPath, indexContent, 'utf8');
console.log('✅ 修复 index.js');

// 4. 修复 device.js 中的冲突函数名
const devicePath = path.join('common/utils/device.js');
let deviceContent = fs.readFileSync(devicePath, 'utf8');

// 重命名 getStorageInfo 函数
deviceContent = deviceContent.replace(
  /export function getStorageInfo\(\) \{/g,
  'export function getStorageInfoEx() {'
);
deviceContent = deviceContent.replace(
  /getStorageInfo,/g,
  'getStorageInfoEx,'
);

fs.writeFileSync(devicePath, deviceContent, 'utf8');
console.log('✅ 修复 device.js');

console.log('\n🎉 所有修复完成！请重新编译小程序。');