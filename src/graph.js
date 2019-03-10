import { print } from 'graphql/language/printer';

export default class Graph {
	constructor(params) {
		const { headers, uri } = params;
		this.setHeaders(headers);
		this.endpoint = uri;
	}

	setHeaders(data) {
		this.headers = Object.assign({}, data, {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		});
	}

	query(qs, variables = {}, options = {}) {
		return this.run(JSON.stringify({
			query: this.queryNormalize(qs),
			variables,
		}), options);
	}

	mutation(qs, variables = {}, options = {}) {
		return this.run(JSON.stringify({
			query: this.queryNormalize(qs),
			variables,
		}), options);
	}

	queryNormalize(qs) {
		if (typeof qs === 'string') {
			return qs;
		}
		if (typeof qs === 'object') {
			return print(qs);
		}
		throw new TypeError('Invalid query');
	}

	async run(body, options) {
		try {
			const response = await fetch(this.endpoint, {
				method: 'POST',
				headers: this.headers,
				body,
				...options,
			});
			if (!response.ok) {
				throw new Error(`Network response was not ok. ${response.status}, ${response.statusText}`);
			}
			return await response.json();
		} catch (err) {
			console.log(err);
			throw new Error(err);
		}
	}
}
