import Graph from './graph';
import Subscribtion from './subscriptions';

const graphPlugin = {
	install(Vue, options = {}) {
		if (Vue.minigraph_installed) {
			return;
		}

		Vue.minigraph_installed = true;

		const { socket = '' } = options;

		if (!Vue.prototype.$graph) {
			Vue.prototype.$graph = new Graph(options);
		}
		if (socket) {
			if (!Vue.prototype.$graphWS) {
				Vue.prototype.$graphWS = new Subscribtion(options);
			}
		}
	},
};

export default graphPlugin;

