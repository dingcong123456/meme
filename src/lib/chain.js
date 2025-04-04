export const connectChain = async (config) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      ...config
    }),
  }
  try {
    const response = await fetch(process.env.CHAIN_HOST, options);
    const contentType = response.headers.get('content-type');

    const status = response.status;
    let result;
    if (contentType.includes('application/json')) {
        result = await response.json();
    } else if (contentType.includes('text/')) {
        result = await response.text();
    } else {
        throw new Error('Unsupported content type: ' + contentType);
    }
    if ([400, 500].includes(status)) {
        throw result;
    }
    return result;
} catch (error) {
    console.error('Fetch request failed:', error);
    throw error;
}
}