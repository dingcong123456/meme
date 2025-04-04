import fetchData from '.';

export const fetchDashboardBrief = () => {
  return fetchData('/api/auth/dashboard/brief', { method: 'GET', includeCredential: true });
}

export const fetchDashboardTrade = () => {
  return fetchData('/api/auth/dashboard/trade', { method: 'GET', includeCredential: true });
}
