/**
 * 封装 wx.request，统一 baseURL、Token 与错误处理，仅做与后端对接用。
 */
const { getApiUrl, getBaseUrl } = require('./config.js');

function getToken() {
  try {
    return wx.getStorageSync('lubao_token') || '';
  } catch (e) {
    return '';
  }
}

/**
 * 发起请求。method: GET/POST 等，path: 如 '/auth/login'（不含 /api/v1），data: 请求体（GET 时为 null），needAuth: 是否带 Token。
 * 返回 Promise<{ data, statusCode }>，失败时 reject({ message, statusCode, detail })。
 */
function request({ method = 'GET', path, data = null, needAuth = false }) {
  const url = path.startsWith('http') ? path : getApiUrl(path);
  const header = {
    'Content-Type': 'application/json'
  };
  if (needAuth) {
    const token = getToken();
    if (token) header['Authorization'] = 'Bearer ' + token;
  }
  return new Promise((resolve, reject) => {
    wx.request({
      url,
      method,
      data,
      header,
      success(res) {
        const code = res.statusCode;
        if (code >= 200 && code < 300) {
          resolve({ data: res.data, statusCode: code });
          return;
        }
        const detail = (res.data && res.data.detail) || res.errMsg || '请求失败';
        reject({ message: typeof detail === 'string' ? detail : JSON.stringify(detail), statusCode: code, detail: res.data });
      },
      fail(err) {
        reject({ message: err.errMsg || '网络错误', statusCode: 0, detail: null });
      }
    });
  });
}

module.exports = {
  getToken,
  getBaseUrl,
  getApiUrl,
  get(path, needAuth = false) {
    return request({ method: 'GET', path, needAuth });
  },
  post(path, data, needAuth = false) {
    return request({ method: 'POST', path, data, needAuth });
  }
};
