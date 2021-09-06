import axios from 'axios';
import StorageHelper from '@/helpers/StorageHelper';
import store from '@/store';

function _loadAccessToken() {
  const accessToken = StorageHelper.get('access_token');
  axios.defaults.headers.common['Authorization'] = `Bearer ${ accessToken }`;
}

function _handleCsrfToken() {
  axios.defaults.headers.common['X-CSRFToken'] =
      document.querySelector('[name=csrfmiddlewaretoken]').value;
}

function handle401Error(error) {
  const refreshTokeUrl = `/api/token/refresh/`;

  if (error.config.url === refreshTokeUrl) {
    return Promise.reject(error);
  }

  const originalRequest = error.config;
  const refresh = store.state.refresh_token;

  return axios.post(refreshTokeUrl, {refresh}).then((response) => {
    const accessToken = response.data.access;
    StorageHelper.set('access_token', accessToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${ accessToken }`;
    originalRequest.headers.Authorization = `Bearer ${ accessToken }`;

    return axios(originalRequest);
  }).catch((err) => {
    alert(`${ err.response.status }: 作業逾時或無相關使用授權，請重新登入`);
    window.location.href = '/login';
    return Promise.reject(error);
  });
}

export function axiosSetConfig() {
  _loadAccessToken();

  _handleCsrfToken();

  axios.interceptors.request.use(async function(config) {
    return config;
  }, function(error) {
    return Promise.reject(error);
  });

  axios.interceptors.response.use(function(response) {
    return response;
  }, function(error) {
    if (error.response) {
      switch (error.response.status) {
        case 400:
          const {message} = error.response.data;
          alert(`${ error.response.status }: ${ message || '資料錯誤' }。`);
          break;

        case 401:
          return handle401Error(error);

        case 404:
          alert(`${ error.response.status }: 資料來源不存在`);
          break;

        case 500:
          alert(`${ error.response.status }: 內部系統發生錯誤`);
          break;

        default:
          alert(`${ error.response.status }: 系統維護中，造成您的不便，敬請見諒。`);
          break;
      }
    } else {
      if (error.code === 'ECONNABORTED' && error.message &&
          error.message.indexOf('timeout') !== -1) {
        alert('網路連線逾時，請點「確認」鍵後繼續使用。');
      } else {
        alert('網路連線不穩定，請稍候再試');
      }
    }

    return Promise.reject(error);
  });
}