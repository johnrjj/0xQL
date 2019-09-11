import uuid from 'uuid'
import WS from 'ws'
import ReconnectingWebSocket from 'reconnecting-websocket'
import jsonResolver from 'graphql-type-json'
import { HttpClient } from '@0x/connect'
import { PubSub } from 'graphql-subscriptions'
import { typeDefs } from './schema'
import {
  queryResolver,
  mutationResolver,
  subscriptionResolver,
} from './resolvers'

const resolvers = {
  queryResolver,
  mutationResolver,
  subscriptionResolver,
  jsonResolver,
}

const DEFAULT_ORDERS_TOPIC = 'orders'

const defaultPubSub = new PubSub()

const defaultSubscriptionConfig = {
  ordersTopic: DEFAULT_ORDERS_TOPIC,
  pubsub: defaultPubSub,
}

export interface SubscriptionConfiguration {
  autoSubscribe?: boolean
  websocketUrl?: string
  ordersTopic?: string
  pubsub?: PubSub
}

// Convenience method for consumers
const createReadyToUseResolvers = (
  relayerRestApiUrl: string,
  customSubscriptionConfig: SubscriptionConfiguration = {}
) => {
  const { websocketUrl, autoSubscribe, pubsub, ordersTopic } = {
    ...defaultSubscriptionConfig,
    ...customSubscriptionConfig,
  }
  let ws: ReconnectingWebSocket | undefined
  // If desired, subscribe to the websocket as a consumer and proxy the subscriptions to clients downstream.
  // Note, we can always use the pubsub object directly for tighter integration (e.g. with redis directly)
  if (autoSubscribe && websocketUrl) {
    const websocketOptions = {
      WebSocket: WS,
      connectionTimeout: 1000,
      maxRetries: 20,
    }
    const ws = new ReconnectingWebSocket(websocketUrl, [], websocketOptions)
    // Subscribe to Relayer's websocket when ready
    ws.addEventListener('open', () =>
      ws.send(
        JSON.stringify({
          type: 'subscribe',
          channel: ordersTopic,
          requestId: uuid(),
          payload: {},
        })
      )
    )
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
      if (parsedData.channel === ordersTopic) {
        // Publish to GraphQL subscription bus
        pubsub.publish(ordersTopic, parsedData)
      }
    })
    ws.addEventListener('error', e =>
      console.error('ERROR: Error with the autosubscribed websocket', e)
    )
  }
  return {
    queryResolver: queryResolver(new HttpClient(relayerRestApiUrl)),
    mutationResolver: mutationResolver(new HttpClient(relayerRestApiUrl)),
    subscriptionResolver: subscriptionResolver(pubsub, ordersTopic),
    jsonResolver,
    pubsub,
    ws,
  }
}

export {
  resolvers,
  typeDefs,
  queryResolver,
  mutationResolver,
  subscriptionResolver,
  createReadyToUseResolvers,
  DEFAULT_ORDERS_TOPIC,
  jsonResolver,
}
