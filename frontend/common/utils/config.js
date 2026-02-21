// 后端 API 基础地址（开发时可改为本机 IP，真机需用局域网 IP 或已备案域名）
const BASE_URL = 'http://127.0.0.1:8000';
const API_PREFIX = '/api/v1';

module.exports = {
  BASE_URL,
  API_PREFIX,
  getBaseUrl: () => BASE_URL,
  getApiUrl: (path) => BASE_URL + API_PREFIX + path
};
