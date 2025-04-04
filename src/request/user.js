import fetchData from '.';

export const getUser = (address) => {
  return fetchData(`/api/user/${address}`);
}

export const addUser = (data) => {
  return fetchData(`/api/user`, { method: 'PUT', body: data });
}

export const modifyUser = (userId, data) => {
  return fetchData(`/api/user/${userId}`, { method: 'PATCH', body: data });
}