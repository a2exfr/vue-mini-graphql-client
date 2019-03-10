# vue-mini-graphql-client

> Vue plugin  -  simple GraphQL client for query, mutation and subscriptions support.

[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE)


work in progress
 
## Installation

```bash
yarn add vue-mini-graphql-client
```

Or

```bash
npm install --save vue-mini-graphql-client
```


### Register

```js
import graphPlugin from 'vue-mini-graphql-client';

const token = GetToken(); //just for example

//Client configuration
const clientConfig = {
                	uri: 'http://endpoint.com', // GraphQL endpoint
                 	socket: 'ws://endpoint.com', // GraphQL endpoint for subscriptions
                  	headers: {
                  		authorization: token || '',
                  		// ... all needed headers
                   	},
               	    options: {},
               	    socketOptions: {},
};

Vue.use(graphPlugin, clientConfig);
```


## Usage
Plugin accepts query as simple string and also as AST document( possible to use graphql-tag to import queries), Fragments also supported.
Two methods is used to fetch data :
`this.$graph.query(query, variables)` for Query and `this.$graph.mutation(query, variables)` for Mutation
##### Query
```js
const dice = 3;
const sides = 6;
const queryString = `query RollDice($dice: Int!, $sides: Int) {
  rollDice(numDice: $dice, numSides: $sides)
}`;

	async getData() {
                const result = await this.$graph.query(queryString, { dice, sides });
                console.log(result);
	}

```



###### Example
```js
import {myQuerry} from '/all_my_queries'; // if graphql-tag is used
export default {
	data() {
		return {
            myData:''
            };
    },
mounted(){
	this.getData();
},
methods:{
	async getData() {
                const result = await this.$graph.query(myQuerry, {input:{myVars:'someValue'}});
                console.log(result);
                this.myData = result.data.myQuerry;
	}
},

}
```
##### Mutation
```js
	async getData() {
                const result = await this.$graph.mutation(mutation, mutationVars);
                console.log(result);
	}
````



## Subcriptions
If in `clientConfig` GraphQL endpoint for subscriptions is set(`socket`) possible to use subscription in components 
with 
`this.graphWS.subscribe(query, variables = {}, operationName = '', callback)` 
###### Example
```js
import { onTest } from '/subscriptions.gql';

//in component
mounted() {
	    //Subscribe onTest with this.testing callback
	    this.myEvent = this.$graphWS.subscribe(onTest, {}, 'onTest', this.testing);
},
methods:{
	//Callback that will be fired onTest subscription
	testing(data){
		console.log(data); // subscription payload
	}
},
beforeDestroy() {
	    //Unsubscribe when component destroyed
		this.$graphWS.unsubscribe(this.myEvent); 
},

````
### Usage in Vuex

Query and Mutations
```js 
const client = this._vm.$graph;
client.query(query, variables)
```
Subscriptions
```js
import { onTest } from '/subscriptions.gql';

export const actions = {
	async subscribe({ state, commit }) {
		const client = this._vm.$graphWS;
		client.subscribe(onTest, {}, 'onTest', (data) => {
			console.log('Received data', data);
		});
}
```

## License

[The MIT License](http://opensource.org/licenses/MIT)
