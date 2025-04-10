import dayjs from 'dayjs';
import fetchData from '.';
import {formatEther} from 'ethers';

export const getToken = (tokenId) => {
  return fetchData(`/api/token/${tokenId}`);
}

export const getTokenList = (params) => {
  return fetchData('/api/token', { method: 'GET', params });
};

export const addToken = async (data) => {
  return fetchData(`/api/token`, { method: 'PUT', body: data });
}

export const modifyToken = (tokenId, data) => {
  return fetchData(`/api/token/${tokenId}`, { method: 'PATCH', body: data });
}

export const deleteToken = (tokenId) => {
  return fetchData(`/api/token/${tokenId}`, { method: 'DELETE' });
}

export const apiGetHolders = (params) => {
  return fetchData(`/api/token/users`, { method: 'GET', params });
}

export const getTokenCahrtData = async (tokenAddress, data) => {
  const result = await fetchData(`/api/price/statistics/${tokenAddress}`, { method: 'POST', body: data });
  return result.map((item) => {
    return {
      time: dayjs(item.time).unix(),
      open: +item.open,
      high: +item.high,
      low: +item.low,
      close: +item.close,
      volume: +item.volume,
    };
  });
};

export const getOkbPrice = () => {
  return fetchData('/api/price/usd');
};

export const getTransactions = ({pageNo, address}) => {
  return fetchData('/api/trading', { method: 'GET', params: { pageNo, address } });
};

export const createTokenTransaction = (data) => {
  return fetchData('/api/trading', { method: 'POST', body: data });
};

export const getTokenCommentCount = (tokenId) => {
  return fetchData(`/api/count/comment/${tokenId}`);
};

export const getCommentList = (tokenId, params) => {
  return fetchData(`/api/comment/${tokenId}`, { method: 'GET', params });
};

export const addComment = (tokenId, replyToId, data) => {
  return fetchData(`/api/comment/${tokenId}/${replyToId}`, { method: 'PUT', body: data });
};

export const getCommentCounts = (tokenId) => {
  return fetchData(`/api/count/comment/${tokenId}`);
}
