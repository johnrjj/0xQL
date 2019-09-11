import { pickBy } from 'lodash'
import { HttpClient } from '@0x/connect'
import { PubSub, withFilter } from 'graphql-subscriptions'
import {
  UpdateOrdersChannelMessage,
  OrdersChannelMessageTypes,
} from '@0x/types'
import {
  QueryResolvers,
  MutationResolvers,
  SubscriptionResolvers,
} from './resolvers-types'
import {
  deserializeOrder,
  serializeOrder,
  serializePaginatedAPIOrderCollection,
  serializePaginatedAssetPairsCollection,
  serializeOrderConfig,
  parseOrderConfigRequestJson,
} from './utils'

const queryResolver = (restClient: HttpClient): QueryResolvers => ({
  order: async (_root, params) => {
    const orderData = await restClient.getOrderAsync(params.id, {
      ...(params.networkId && { networkId: params.networkId }),
    })
    const serializedOrder = serializeOrder(orderData.order)
    return {
      metadata: orderData.metaData,
      order: serializedOrder,
    }
  },
  orders: async (_root, params) => {
    const orders = await restClient.getOrdersAsync(pickBy(params))
    const serializedOrdersResponse = serializePaginatedAPIOrderCollection(
      orders
    )
    return serializedOrdersResponse
  },
  orderbook: async (_root, params) => {
    const orderbook = await restClient.getOrderbookAsync(
      {
        baseAssetData: params.baseAssetData,
        quoteAssetData: params.quoteAssetData,
      },
      {
        networkId: params.networkId || undefined,
        page: params.page || undefined,
        perPage: params.perPage || undefined,
      }
    )
    const serializedOrderbook = {
      asks: serializePaginatedAPIOrderCollection(orderbook.asks),
      bids: serializePaginatedAPIOrderCollection(orderbook.bids),
    }
    return serializedOrderbook
  },
  assetPairs: async (_root, params) => {
    const options = {
      assetDataA: params.assetDataA,
      assetDataB: params.assetDataB,
      networkId: params.networkId,
      page: params.page,
      perPage: params.perPage,
    }
    const assetPairs = await restClient.getAssetPairsAsync(pickBy(options))
    const serializedAssetPairs = serializePaginatedAssetPairsCollection(
      assetPairs
    )
    return serializedAssetPairs
  },
  feeRecipients: async (_root, params) => {
    const assetPairs = await restClient.getFeeRecipientsAsync({
      networkId: params.networkId || undefined,
      page: params.page || undefined,
      perPage: params.perPage || undefined,
    })
    return assetPairs
  },
  orderConfig: async (_root, { networkId, ...orderConfigOptions }) => {
    const options = parseOrderConfigRequestJson(orderConfigOptions)
    const requestConfig = pickBy({ networkId })
    const orderConfigResponse = await restClient.getOrderConfigAsync(
      options,
      requestConfig
    )
    const serializedOrderConfig = serializeOrderConfig(orderConfigResponse)
    return serializedOrderConfig
  },
})

const mutationResolver = (restClient: HttpClient): MutationResolvers => ({
  postOrder: async (_parent, { order, networkId }) => {
    let config: any = {}
    if (networkId) {
      config.networkId = networkId
    }
    const deserializedSignedOrder = deserializeOrder(order)
    await restClient.submitOrderAsync(deserializedSignedOrder, config)
    return true
  },
})

const subscriptionResolver = (
  pubsub: PubSub,
  ordersUpdateTopic: string
): SubscriptionResolvers => ({
  subscribeToOrders: {
    resolve: (
      payload: UpdateOrdersChannelMessage,
      variables,
      _context,
      _info
    ) => {
      return {
        ...payload,
        requestId: variables.requestId,
      } as any
    },
    subscribe: withFilter(
      () => pubsub.asyncIterator(ordersUpdateTopic),
      (payload: UpdateOrdersChannelMessage, _variables) => {
        if (payload.type !== OrdersChannelMessageTypes.Update) {
          return false
        }
        return true
      }
    ),
  },
})

export { queryResolver, mutationResolver, subscriptionResolver }
