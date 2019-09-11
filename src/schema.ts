import { gql } from 'apollo-server'

const typeDefs = gql`
  scalar JSON

  """
  An order, signed or unsigned
  """
  type Order {
    makerAddress: String!
    takerAddress: String!
    feeRecipientAddress: String!
    senderAddress: String!
    makerAssetAmount: String!
    takerAssetAmount: String!
    makerFee: String!
    takerFee: String!
    expirationTimeSeconds: String!
    salt: String!
    makerAssetData: String!
    takerAssetData: String!
    exchangeAddress: String!
    signature: String
  }

  """
  A signed order object
  """
  type SignedOrder {
    makerAddress: String!
    takerAddress: String!
    feeRecipientAddress: String!
    senderAddress: String!
    makerAssetAmount: String!
    takerAssetAmount: String!
    makerFee: String!
    takerFee: String!
    expirationTimeSeconds: String!
    salt: String!
    makerAssetData: String!
    takerAssetData: String!
    exchangeAddress: String!
    signature: String!
  }

  input SignedOrderInput {
    makerAddress: String!
    takerAddress: String!
    feeRecipientAddress: String!
    senderAddress: String!
    makerAssetAmount: String!
    takerAssetAmount: String!
    makerFee: String!
    takerFee: String!
    expirationTimeSeconds: String!
    salt: String!
    makerAssetData: String!
    takerAssetData: String!
    exchangeAddress: String!
    signature: String!
  }

  type WrappedOrderWithMetadata {
    order: Order
    metaData: JSON
  }

  type WrappedSignedOrderWithMetadata {
    order: SignedOrder
    metaData: JSON
  }

  type PaginatedAPIOrder {
    total: Int!
    page: Int!
    perPage: Int!
    records: [WrappedSignedOrderWithMetadata]!
  }

  type OrderbookResponse {
    bids: PaginatedAPIOrder
    asks: PaginatedAPIOrder
  }

  type AssetData {
    assetData: String!
    minAmount: String
    maxAmount: String
    precision: Int
  }

  type AssetPair {
    assetDataA: AssetData!
    assetDataB: AssetData!
  }

  type AssetPairResponse {
    total: Int!
    page: Int!
    perPage: Int!
    records: [AssetPair]!
  }

  type FeeRecipientsResponse {
    total: Int!
    page: Int!
    perPage: Int!
    records: [String]!
  }

  type OrderConfig {
    makerFee: String!
    takerFee: String!
    feeRecipientAddress: String!
    senderAddress: String!
  }

  # the schema allows the following queries:
  type Query {
    """
    Retrieves a list of available asset pairs and the information required to trade them (in any order).
    Setting only assetDataA or assetDataB returns pairs filtered by that asset only.
    """
    assetPairs(
      """
      The assetData value for the first asset in the pair.
      """
      assetDataA: String
      """
      The assetData value for the second asset in the pair.
      """
      assetDataB: String
      """
      The id of the Ethereum network
      """
      networkId: Int
      """
      The number of the page to request in the collection.
      """
      page: Int
      """
      The number of records to return per page.
      """
      perPage: Int
    ): AssetPairResponse
    order(
      """
      The hash of the desired 0x order.
      """
      id: String!
      """
      The id of the Ethereum network
      """
      networkId: Int
    ): WrappedSignedOrderWithMetadata
    """
    Retrieves a list of orders given query parameters.
    This endpoint should be paginated.
    For querying an entire orderbook snapshot, the orderbook endpoint is recommended.
    If both makerAssetData and takerAssetData are specified, returned orders will be sorted by price determined by (takerTokenAmount/makerTokenAmount) in ascending order.
    By default, orders returned by this endpoint are unsorted.
    """
    orders(
      makerAssetProxyId: String
      takerAssetProxyId: String
      makerAssetAddress: String
      takerAssetAddress: String
      exchangeAddress: String
      senderAddress: String
      makerAssetData: String
      takerAssetData: String
      traderAssetData: String
      makerAddress: String
      takerAddress: String
      traderAddress: String
      feeRecipientAddress: String
      networkId: Int
      page: Int
      perPage: Int
    ): PaginatedAPIOrder
    """
    Retrieves the orderbook for a given asset pair.
    This endpoint should be paginated.
    Bids will be sorted in descending order by price, and asks will be sorted in ascending order by price.
    Within the price sorted orders, the orders are further sorted by taker fee price which is defined as the takerFee divided by takerTokenAmount.
    After taker fee price, orders are to be sorted by expiration in ascending order.
    The way pagination works for this endpoint is that the page and perPage query params apply to both bids and asks collections, and if page * perPage > total for a certain collection, the records for that collection should just be empty.
    """
    orderbook(
      """
      assetData (makerAssetData or takerAssetData) designated as the base currency in the currency pair calculation of price.
      """
      baseAssetData: String!
      """
      assetData (makerAssetData or takerAssetData) designated as the quote currency in the currency pair calculation of price.
      """
      quoteAssetData: String!
      networkId: Int
      page: Int
      perPage: Int
    ): OrderbookResponse
    """
    Relayers have full discretion over the orders that they are willing to host on their orderbooks (e.g what fees they charge, etc...).
    In order for traders to discover their requirements programmatically, they can send an incomplete order to this endpoint and receive the missing fields, specifc to that order.
    This gives relayers a large amount of flexibility to tailor fees to unique traders, trading pairs and volume amounts.
    Submit a partial order and receive information required to complete the order: senderAddress, feeRecipientAddress, makerFee, takerFee.
    """
    orderConfig(
      makerAddress: String!
      takerAddress: String!
      makerAssetAmount: String!
      takerAssetAmount: String!
      makerAssetData: String!
      takerAssetData: String!
      exchangeAddress: String!
      expirationTimeSeconds: String!
      networkId: String
    ): OrderConfig
    """
    Retrieves a collection of all fee recipient addresses for a relayer.
    """
    feeRecipients(page: Int, networkId: Int, perPage: Int): FeeRecipientsResponse
  }

  # this schema allows the following mutation:
  type Mutation {
    """
    Submit a signed order to the relayer.
    """
    postOrder(order: SignedOrderInput!, networkId: Int): Boolean
  }

  enum SUBSCRIPTION_SUBSCRIBE_REQUEST_TYPES {
    subscribe
  }

  enum SUBSCRIPTION_SUBSCRIBE_REQUEST_CHANNELS {
    orders
  }

  enum SUBSCRIPTION_ORDER_UPDATE_RESPONSE_TYPE {
    update
  }

  enum SUBSCRIPTION_ORDER_UPDATE_RESPONSE_CHANNEL {
    orders
  }

  input SubscriptionFilterParameters {
    makerAssetProxyId: String
    takerAssetProxyId: String
    makerAssetAddress: String
    takerAssetAddress: String
    makerAssetData: String
    takerAssetData: String
    traderAssetData: String
  }

  type SubscriptionOrderUpdateResponse {
    type: SUBSCRIPTION_ORDER_UPDATE_RESPONSE_TYPE!
    channel: SUBSCRIPTION_ORDER_UPDATE_RESPONSE_CHANNEL!
    requestId: String!
    payload: [WrappedSignedOrderWithMetadata]
  }

  type Subscription {
    """
    Subscribe to new orders and order state changes in the orderbook.
    Note: Does not currently support filtering, although the API is in place. This will be available in an upcoming release.
    """
    subscribeToOrders(
      type: SUBSCRIPTION_SUBSCRIBE_REQUEST_TYPES!
      channel: SUBSCRIPTION_SUBSCRIBE_REQUEST_CHANNELS!
      requestId: String!
      payload: SubscriptionFilterParameters
    ): SubscriptionOrderUpdateResponse
  }
`

export { typeDefs }
