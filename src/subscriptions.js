// graphql-ws protocol description https://github.com/apollographql/subscriptions-transport-ws/blob/master/PROTOCOL.md
const GQL = {
	CONNECTION_INIT: 'connection_init',
	CONNECTION_ACK: 'connection_ack',
	CONNECTION_ERROR: 'connection_error',
	CONNECTION_KEEP_ALIVE: 'ka',
	START: 'start',
	STOP: 'stop',
	CONNECTION_TERMINATE: 'connection_terminate',
	DATA: 'data',
	ERROR: 'error',
	COMPLETE: 'complete',
};

export default class Subscribtion {
	constructor(params) {
		this.params = params;
		this.open();
	}

	open() {
		const protocols = 'graphql-ws';
		const { socket: url, socketOptions: options = {} } = this.params;

		this.id = 1;
		this.ReconnectInterval = 5 * 1000;	// ms
		this.subscriptions = new Map();
		this.webSocket = new WebSocket(url, protocols);

		this.webSocket.onopen = () => {
			this.webSocket.send(JSON.stringify({
				type: GQL.CONNECTION_INIT,
				payload: options,
			}));
		};

		this.webSocket.onclose = (event) => {
			switch (event.code) {
				case 1000:
					console.log('GQL WebSockets: closed');
					break;
				default:
					this.reconnect(event);
					break;
			}
		}

		this.webSocket.onmessage = this.onMessage.bind(this);
	}

	removeAllListeners() {
		this.subscriptions.clear();
	}

	reconnect(e) {
		console.log(`GQL WebSockets: retry in ${this.ReconnectInterval}ms`, e);
		this.removeAllListeners();
		setTimeout((that) => {
			console.log('GQL WebSockets: reconnecting...');
			that.open();
		}, this.ReconnectInterval, this);
	}

	shutdown() {
		this.webSocket.send(JSON.stringify({
			type: GQL.CONNECTION_TERMINATE,
		}));
		this.webSocket.close();
	}

	subscribe(query, variables = {}, operationName = '', callback) {
		if (typeof callback !== 'function') {
			throw new TypeError('Callback has to be a function');
		}
		this.id = this.id + 1;
		const id = (this.id).toString();
		this.subscriptions.set(id, callback);
		if (!this.webSocket.readyState) {
			setTimeout((self) => {
				self.send(id, query, variables, operationName);
			}, 100, this);
		} else {
			this.send(id, query, variables, operationName);
		}
		return id;
	}

	send(id, query, variables, operationName) {
		this.webSocket.send(JSON.stringify({
			type: GQL.START,
			id,
			payload: { query, variables, operationName },
		}));
	}

	unsubscribe(id) {
		id = id.toString();
		this.subscriptions.delete(id);
		this.webSocket.send(JSON.stringify({
			type: GQL.STOP,
			id,
		}));
	}

	// graphql-ws protocol description https://github.com/apollographql/subscriptions-transport-ws/blob/master/PROTOCOL.md
	onMessage(event) {
		const data = JSON.parse(event.data);
		console.log(event);
		switch (data.type) {
			case GQL.CONNECTION_ACK: {
				// Server respond of accepted the connection.
				console.log('GQL WebSockets: Connected successfully');
				break;
			}
			case GQL.CONNECTION_ERROR: {
				// Can be  response to GQL.CONNECTION_INIT or parsing errors in the client which will not disconnect.
				console.log('GQL WebSockets: Connection error ', data.payload);
				break;
			}
			case GQL.CONNECTION_KEEP_ALIVE: {
				break;
			}
			case GQL.DATA: {
				const callback = this.subscriptions.get(data.id);
				if (callback) {
					if (data.payload.errors) {
						console.log('GQL WebSockets: Error ', data.payload.errors);
					}
					callback(data.payload.data);
				}
				break;
			}
			case GQL.ERROR: {
				console.log('GQL WebSockets: Error ', data.payload);
				break;
			}
			case GQL.COMPLETE: {
				const callback = this.subscriptions.get(data.id);
				if (callback) {
					this.subscriptions.delete(data.id);
				}
				break;
			}
		}
	}
}
