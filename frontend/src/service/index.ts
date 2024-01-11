import { message } from 'antd';
const serverUrl = '/v1';

const stringify = (data?: Record<string, string | number>) => {
  if (!data) {
    return '';
  }
  return (
    '?' +
    Object.entries(data)
      .map(([key, value]) => `${key}=${value}`)
      .join('&')
  );
};
const errorRequest = new Set<string>();
const get = async <T>(url: string, data?: any) => {
  const requestUrl = `${serverUrl}${url}${stringify(data)}`;
  return fetch(requestUrl, {
    method: 'GET',
  }).then(async (res) => {
    if (res.status !== 200) {
      return;
    }
    const { data, msg, code } = (await res.json()) as API.ResponseVO<T>;

    if (code !== 200) {
      if (!errorRequest.has(requestUrl)) {
        message.error(msg);
      }
    }

    return data;
  });
};

const http =
  (method: 'POST' | 'DELETE' | 'PUT') =>
  async <T>(url: string, data?: Record<string, string>) =>
    fetch(`${serverUrl}${url}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then(async (res) => {
      const responseJson = (await res.json()) as API.ResponseVO<T>;
      const { data, msg, code } = responseJson;
      if (code !== 200) {
        message.error(msg);
      } else {
        message.success(msg === 'success' ? '保存成功' : msg);
      }

      return data;
    });
const post = http('POST');
const put = http('PUT');
const del = http('DELETE');

const services = {
  addOrder: (data: any) => post('/orders', data),
  deleteOrder: (data: any) => del<API.OrderVO>('/orders', data),
  updateOrder: (data: any) => put<API.OrderVO>('/orders', data),
  listOrder: () => get<API.OrderVO[]>('/orders'),
  listOrderWithPagination: (data: any) =>
    get<API.Pagination<API.OrderVO>>(
      `/orders/pagination/${Object.values(data).join('/')}`
    ),
};

export default services;
