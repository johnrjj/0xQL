import { ApolloServer } from 'apollo-server'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import { createServer } from 'http'
import { execute, subscribe } from 'graphql'
import { makeExecutableSchema } from 'graphql-tools'
import { createReadyToUseResolvers, typeDefs } from '../..'

// Here's a basic, minimal example with a standalone GraphQL server with subscriptions configured.
// Configured for RadarRelay's 0x SRAv2 API

const APP_PORT = 4000
const WEBSOCKET_PORT = 4001
const REST_API_ENDPOINT = 'https://api.radarrelay.com/0x/v2'
const WS_API_ENDPOINT = 'wss://ws.radarrelay.com/0x/v2'

const {
  queryResolver,
  mutationResolver,
  subscriptionResolver,
  jsonResolver,
} = createReadyToUseResolvers(REST_API_ENDPOINT, {
  websocketUrl: WS_API_ENDPOINT,
  autoSubscribe: true,
})

const resolvers = {
  Query: queryResolver,
  Mutation: mutationResolver,
  Subscription: subscriptionResolver,
  JSON: jsonResolver,
}

// Setup websocket server
const websocketServer = createServer((_request, response) => {
  response.writeHead(404)
  response.end()
})

SubscriptionServer.create(
  {
    execute,
    subscribe,
    schema: makeExecutableSchema({ typeDefs, resolvers }),
  },
  {
    server: websocketServer,
    path: '/graphql',
  }
)

// Start websocket server
websocketServer.listen(WEBSOCKET_PORT, () =>
  console.log(
    `Websocket server is now running on ws://localhost:${WEBSOCKET_PORT}`
  )
)

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: {
    title: '0xQL Playground',
  },
})

// Start the app server
server.listen({ port: APP_PORT }, () => {
  console.log(
    `🚀 Server ready at http://localhost:${APP_PORT}${server.graphqlPath}`
  )
  console.log(
    `🚀 Subscriptions ready at ws://localhost:${WEBSOCKET_PORT}${server.subscriptionsPath}`
  )
})
