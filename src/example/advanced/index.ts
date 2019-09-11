import http from 'http'
import express from 'express'
import WS from 'ws'
import cors from 'cors'
import uuid from 'uuid/v4'
import ReconnectingWebSocket from 'reconnecting-websocket'
import { ApolloServer } from 'apollo-server-express'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import { HttpClient } from '@0x/connect'
import { createServer } from 'http'
import { execute, subscribe } from 'graphql'
import { makeExecutableSchema } from 'graphql-tools'
import { PubSub } from 'graphql-subscriptions'
import {
  typeDefs,
  queryResolver,
  mutationResolver,
  subscriptionResolver,
  jsonResolver,
  DEFAULT_ORDERS_TOPIC,
} from '../..'

// Here's an example w/ an existing express server with maximum configurability/flexiblity.

const APP_PORT = process.env.PORT ? parseInt(process.env.PORT) : 4000
const WEBSOCKET_PORT = process.env.WEBSOCKET_PORT
  ? parseInt(process.env.WEBSOCKET_PORT)
  : 4001
const ORDERS_TOPIC = process.env.ORDERS_TOPIC || DEFAULT_ORDERS_TOPIC
const SUBSCRIBE_MESSAGE_TYPE = 'subscribe'
const REST_API_ENDPOINT =
  process.env.REST_API_ENDPOINT || 'https://api.radarrelay.com/0x/v2'
const WS_API_ENDPOINT =
  process.env.WS_API_ENDPOINT || 'wss://ws.radarrelay.com/0x/v2'

const websocketOptions = {
  WebSocket: WS,
  connectionTimeout: parseInt(
    process.env.WEBSOCKET_CONNECTION_TIMEOUT || '1000',
    10
  ),
  maxRetries: parseInt(process.env.WEBSOCKET_RECONNECT_MAX_TRIES || '20', 10),
}

// REST Client for 0x SRA
const restClient = new HttpClient(REST_API_ENDPOINT)

// Websocket Proxy for 0x SRA
const ws = new ReconnectingWebSocket(WS_API_ENDPOINT, [], websocketOptions)

const subscribeWsToOrders = (ws: ReconnectingWebSocket) => {
  ws.send(
    JSON.stringify({
      type: SUBSCRIBE_MESSAGE_TYPE,
      channel: ORDERS_TOPIC,
      requestId: uuid(),
      payload: {},
    })
  )
}

// PubSub bus for GraphQL Subscriptions
const pubsub = new PubSub()

// Subscribe to Relayer's websocket when ready
ws.addEventListener('open', () => subscribeWsToOrders(ws))

// Listen to messages from relayer websocket
// and route to GraphQL subscriptions handler
ws.addEventListener('message', m => {
  const { data } = m
  let parsedData = data
  try {
    parsedData = JSON.parse(data)
  } catch (e) {
    return
  }
  if (parsedData.channel === 'orders') {
    // Publish to GraphQL subscription bus
    pubsub.publish(ORDERS_TOPIC, parsedData)
  }
})

const resolvers = {
  Query: queryResolver(restClient),
  Mutation: mutationResolver(restClient),
  Subscription: subscriptionResolver(pubsub, ORDERS_TOPIC),
  JSON: jsonResolver,
}

// Setup websocket server
const websocketServer = createServer((_request, response) => {
  console.log('???')
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
    `Websocket Server is now running on ws://localhost:${WEBSOCKET_PORT}`
  )
)

// Setup graphql server
// Start with a basic express server...
const app = express()
app.use(cors())

// Express routes work as usual
app.get('/healthcheck', (_, res) => res.sendStatus(200))

// Then we'll create and apply the GraphQL server middleware
const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: err => err,
})
server.applyMiddleware({ app })

const httpServer = http.createServer(app)
server.installSubscriptionHandlers(httpServer)

httpServer.listen(APP_PORT, () => {
  console.log(
    `🚀 Server ready at http://localhost:${APP_PORT}${server.graphqlPath}`
  )
  console.log(
    `🚀 Subscriptions ready at ws://localhost:${WEBSOCKET_PORT}${server.subscriptionsPath}`
  )
})
