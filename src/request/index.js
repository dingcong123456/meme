
const fetchData = async (url, options = {}) => {
	const { includeCredential } = options;
	if (!options.headers) {
		options.headers = {};
	}
	if (options.method !== 'GET') {
		options.headers = {
			'Content-Type': 'application/json',
			...options.headers,
		};
		if (options.body instanceof FormData) {
			delete options.headers['Content-Type'];
		}
		if (options.headers['Content-Type'] === 'application/json') {
			options.body = JSON.stringify(options.body);
		}
	} else {
		// add params to url
		if (options.params) {
			const params = new URLSearchParams(options.params);
			url += '?' + params.toString();
		}
		delete options.params;
	}
	if (includeCredential) {
		options.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
	}
	try {
		const response = await fetch(url, options);
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
};

export default fetchData;
