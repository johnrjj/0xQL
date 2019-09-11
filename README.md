# `0xQL` (ZeroEx GraphQL)

tl;dr: Easily add GraphQL support to any 0x Relayer that follows the [0x Standard Relayer API](https://github.com/0xProject/standard-relayer-api) spec.

## Overview

`0xQL` enables developers to quickly build a GraphQL server that can automatically integrate with an existing 0x Relayer. The GraphQL server mirrors functionality of the 0x Relayer's REST and WS API, but instead can be accessed via GraphQL's [Queries](https://graphql.org/learn/queries/), [Mutations](https://graphql.org/learn/queries/#mutations), and [Subscriptions](https://graphql.org/blog/subscriptions-in-graphql-and-relay/).

## Demo

Check out the GraphiQL playground [here](https://zeroexql.herokuapp.com/graphql), which is currently pointed at RadarRelay. Try creating some queries, mutations, or subscriptions.

Check out the [quick start guide](#quick-start-guide) for a sample query and [sample subscription](#subscriptions-demo) to try out on the demo playground.

## Getting Started

### Prerequisite

- `>= Node v10`
- `>= Yarn v1.5`

### Installation

```bash
yarn add 0xql
```

## Quick Start Guide

This guide will walk through setting up a 0xQL GraphQL server that works with [RadarRelay](https://radarrelay.com/).

Install the dependencies

```
$ yarn add 0xql apollo-server
```

Create an index.js file

```bash
$ touch index.js
```

Add the following code to `index.js`

```ts
// index.js
const { ApolloServer } = require('apollo-server')
const { createReadyToUseResolvers, typeDefs } = require('0xql')

const APP_PORT = 4000
const REST_API_ENDPOINT = 'https://api.radarrelay.com/0x/v2'

const {
  queryResolver,
  mutationResolver,
  jsonResolver,
} = createReadyToUseResolvers(REST_API_ENDPOINT)

const resolvers = {
  Query: queryResolver,
  Mutation: mutationResolver,
  JSON: jsonResolver,
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

// Start the GraphQL server
server.listen({ port: APP_PORT }, () =>
  console.log(
    `🚀 Server ready at http://localhost:${APP_PORT}${server.graphqlPath}`
  )
)
```

Finally, start the server

```
node index.js
```

If everything worked, you should see the following printed in the console

```bash
🚀 Server ready at http://localhost:4000/
```

Congrats, you have your own functional 0xQL GraphQL instance pointed at RadarRelay. Let's try it out!

Navigate to [`http://localhost:4000`](http://localhost:4000) to check out the GQL playground

Try a sample query:

```gql
query GetOrders {
  orders {
    records {
      order {
        makerAssetData
        makerAssetAmount
        takerAssetData
        takerAssetAmount
      }
    }
    total
    page
    perPage
  }
}
```

### Adding Subscriptions

In addition to fetching data using queries and modifying data using mutations, the GraphQL spec supports a third operation type, called subscription. GraphQL subscriptions are a way to push data from the server to the clients that choose to listen to real time messages from the server.

If you're looking to add subscriptions, check out the implementation example [here](./src/example/basic-with-subscriptions/index.ts) which builds on the server we just made.

#### Subscriptions Demo

Check out the [demo playground](https://zeroexql.herokuapp.com/graphql) for a live demo of subscriptions in action.

Here's a sample subscription to send to the GraphQL server:

```gql
subscription SubscribeToAllOrders {
  subscribeToOrders(type: subscribe, channel: orders, requestId: "1234") {
    payload {
      order {
        makerAddress
        makerAssetData
        takerAddress
        makerAssetAmount
        takerAssetData
        takerAssetAmount
        signature
        expirationTimeSeconds
      }
    }
  }
}
```

You'll start to get a stream of incoming orders that look like the structure you just requested:

```json
{
  "data": {
    "subscribeToOrders": {
      "payload": [
        {
          "order": {
            "makerAddress": "0x50f84bbee6fb250d6f49e854fa280445369d64d9",
            "makerAssetData": "0xf47261b00000000000000000000000000f5d2fb29fb7d3cfee444a200298f468908cc942",
            "takerAddress": "0x0000000000000000000000000000000000000000",
            "makerAssetAmount": "35003789556299530000000",
            "takerAssetData": "0xf47261b0000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
            "takerAssetAmount": "6609708813064056613",
            "signature": "0x1b37b290a52a5afccf8c9eb155b37dad510aad8b37a607b939ef6c72b73bc86d956d53dd6bc8c910d8f0d28f6fa94b567151a24dedd3d83404eea67684e348481003",
            "expirationTimeSeconds": "1568183099"
          }
        }
      ]
    }
  }
}
```

## More Examples

- [Basic](./src/examples/basic/index.ts) (without subscriptions)
- [Basic](./src/examples/basic-with-subscriptions/index.ts) (with subscriptions)
- [Advanced](./src/examples/advanced/index.ts) (demos integration with existing express server)

## Client Side Integration

Here's an example of integrating React and React Hooks with the 0xQL server. This assumes a React app already exists (you can always use `create-react-app` to bootstrap your app).

We're going to use the popular GraphQL library `Apollo` which offers smooth integration with React. Apollo offers a set of React Hooks which we can consume directly inside our components.

#####

First, set up the code, which includes importing the required code and setting up your first query.

```
yarn add apollo-boost @apollo/react-hooks graphql
```

```ts
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'

const GET_ORDERS_SUMMARY = gql`
  {
    orders {
      records {
        order {
          makerAssetData
          makerAssetAmount
          takerAssetData
          takerAssetAmount
        }
      }
      total
      page
      perPage
    }
  }
`
```

Now let's write our React component

```tsx
function Orders({ onOrderSelected }) {
  const { loading, error, data } = useQuery(GET_ORDERS_SUMMARY);

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  return (
    <div>
      {data.orders.records.map(order) => (
        <div onClick={() => onOrderSelected && onOrderSelected(order)}>
          {order.makerAssetData}
        </div>
      )}
    </div>
  );
}
```

Then finally, let's wrap the component in an App and a GraphQL provider:

```tsx
import React from 'react'
import ApolloClient from 'apollo-boost'
import { render } from 'react-dom'
import { ApolloProvider } from '@apollo/react-hooks'

const client = new ApolloClient({ uri: 'http://localhost:4000' })

const App = () => (
  <ApolloProvider client={client}>
    <Orders onOrderSelected={order => console.log('order selected', order)} />
  </ApolloProvider>
)

render(<App />, document.getElementById('root'))
```

That's it!

## API

### Available Imports

- `typeDefs`
- `createReadyToUseResolvers`
- `resolvers`

---

`typeDefs` - This is the Type Definitions for the GraphQL schema

`createReadyToUseResolvers` - A factory function to create opinionated, ready-to-use resolvers, and if requested, sets up websockets automatically.

```ts
interface SubscriptionConfiguration {
  autoSubscribe?: boolean
  websocketUrl?: string
  ordersTopic?: string
  pubsub?: PubSub
}

const resolvers = createReadyToUseResolvers(
  relayerRestApiUrl: string,
  customSubscriptionConfig: SubscriptionConfiguration
):
```

**Returns:** Object that contains the following:

- queryResolver
- mutationResolver
- subscriptionResolver
- jsonResolver

See the `basic` example on the usage here.

`resolvers`: More advanced fine-grained, less opinionated configuration over resolvers than `createReadyToUseResolvers` provides. See the `advanced` example on usage.

## FAQ

### What's GraphQL?

GraphQL is a query language for APIs that enables declarative data fetching in order to give the client the power to specify exactly the data that is needed from the API.

### What's 0x?

An open protocol for decentralized exchange on the Ethereum blockchain.

### What's `0xQL`

A package that provides primitives and tooling for building GraphQL support into your 0x Relayer.

### How does this package apply to GraphQL?

This package, `0xQL`, provides the necessary GraphQL bindings, resolvers, schema, and types. We also include an optional opinionated setup with most things preconfigured.

### How does this package apply to 0x?

The [0x Standard Relayer API](https://github.com/0xProject/standard-relayer-api) dictates a standard interface for both REST and WebSocket interaction for a relayer. Since this interface is standardized across relayers, we can also add support for GraphQL in a consistent and robust way. This package supports GraphQL queries, mutations, and subscriptions.

### Sounds good, but how do I use this?

This package provides various ways to consume the `0xQL` package, depending on your level of configuration required. For example, `0xQL` supports:

- Creating a standalone GraphQL server with minimal configuration. Check out the [basic example here](./src/example/basic/index.ts).

- If you already have an express server and want to add GraphQL support, you can layer in GraphQL quite easily. Check out the [advanced example here](./src/example/advanced/index.ts)

- If you already have a GraphQL API and you want to add 0x relayer support, you can take the `0xQL` schema and types and stich it together with your own existing GraphQL schema. (See Apollo docs for guides on schema stiching and federated GraphQL support)

### Why write this package?

Why not?

Having more ways and to interact and integrate with 0x relayers is a win for the ecosystem.
