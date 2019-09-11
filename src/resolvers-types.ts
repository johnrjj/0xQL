import {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig,
} from 'graphql'
export type Maybe<T> = T | null
export type RequireFields<T, K extends keyof T> = {
  [X in Exclude<keyof T, K>]?: T[X]
} &
  { [P in K]-?: NonNullable<T[P]> }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any
  /** The `Upload` scalar type represents a file upload. */
  Upload: any
}

export type AssetData = {
  __typename?: 'AssetData'
  assetData: Scalars['String']
  minAmount?: Maybe<Scalars['String']>
  maxAmount?: Maybe<Scalars['String']>
  precision?: Maybe<Scalars['Int']>
}

export type AssetPair = {
  __typename?: 'AssetPair'
  assetDataA: AssetData
  assetDataB: AssetData
}

export type AssetPairResponse = {
  __typename?: 'AssetPairResponse'
  total: Scalars['Int']
  page: Scalars['Int']
  perPage: Scalars['Int']
  records: Array<Maybe<AssetPair>>
}

export enum CacheControlScope {
  Public = 'PUBLIC',
  Private = 'PRIVATE',
}

export type FeeRecipientsResponse = {
  __typename?: 'FeeRecipientsResponse'
  total: Scalars['Int']
  page: Scalars['Int']
  perPage: Scalars['Int']
  records: Array<Maybe<Scalars['String']>>
}

export type Mutation = {
  __typename?: 'Mutation'
  postOrder?: Maybe<Scalars['Boolean']>
}

export type MutationPostOrderArgs = {
  order: SignedOrderInput
  networkId?: Maybe<Scalars['Int']>
}

export type Order = {
  __typename?: 'Order'
  makerAddress: Scalars['String']
  takerAddress: Scalars['String']
  feeRecipientAddress: Scalars['String']
  senderAddress: Scalars['String']
  makerAssetAmount: Scalars['String']
  takerAssetAmount: Scalars['String']
  makerFee: Scalars['String']
  takerFee: Scalars['String']
  expirationTimeSeconds: Scalars['String']
  salt: Scalars['String']
  makerAssetData: Scalars['String']
  takerAssetData: Scalars['String']
  exchangeAddress: Scalars['String']
  signature?: Maybe<Scalars['String']>
}

export type OrderbookResponse = {
  __typename?: 'OrderbookResponse'
  bids?: Maybe<PaginatedApiOrder>
  asks?: Maybe<PaginatedApiOrder>
}

export type OrderConfig = {
  __typename?: 'OrderConfig'
  makerFee: Scalars['String']
  takerFee: Scalars['String']
  feeRecipientAddress: Scalars['String']
  senderAddress: Scalars['String']
}

export type PaginatedApiOrder = {
  __typename?: 'PaginatedAPIOrder'
  total: Scalars['Int']
  page: Scalars['Int']
  perPage: Scalars['Int']
  records: Array<Maybe<WrapperSignedOrderWithMetadata>>
}

export type Query = {
  __typename?: 'Query'
  assetPairs?: Maybe<AssetPairResponse>
  order?: Maybe<WrapperSignedOrderWithMetadata>
  orders?: Maybe<PaginatedApiOrder>
  orderbook?: Maybe<OrderbookResponse>
  orderConfig?: Maybe<OrderConfig>
  feeRecipients?: Maybe<FeeRecipientsResponse>
}

export type QueryAssetPairsArgs = {
  assetDataA?: Maybe<Scalars['String']>
  assetDataB?: Maybe<Scalars['String']>
  networkId?: Maybe<Scalars['Int']>
  page?: Maybe<Scalars['Int']>
  perPage?: Maybe<Scalars['Int']>
}

export type QueryOrderArgs = {
  id: Scalars['String']
  networkId?: Maybe<Scalars['Int']>
}

export type QueryOrdersArgs = {
  makerAssetProxyId?: Maybe<Scalars['String']>
  takerAssetProxyId?: Maybe<Scalars['String']>
  makerAssetAddress?: Maybe<Scalars['String']>
  takerAssetAddress?: Maybe<Scalars['String']>
  exchangeAddress?: Maybe<Scalars['String']>
  senderAddress?: Maybe<Scalars['String']>
  makerAssetData?: Maybe<Scalars['String']>
  takerAssetData?: Maybe<Scalars['String']>
  traderAssetData?: Maybe<Scalars['String']>
  makerAddress?: Maybe<Scalars['String']>
  takerAddress?: Maybe<Scalars['String']>
  traderAddress?: Maybe<Scalars['String']>
  feeRecipientAddress?: Maybe<Scalars['String']>
  networkId?: Maybe<Scalars['Int']>
  page?: Maybe<Scalars['Int']>
  perPage?: Maybe<Scalars['Int']>
}

export type QueryOrderbookArgs = {
  baseAssetData: Scalars['String']
  quoteAssetData: Scalars['String']
  networkId?: Maybe<Scalars['Int']>
  page?: Maybe<Scalars['Int']>
  perPage?: Maybe<Scalars['Int']>
}

export type QueryOrderConfigArgs = {
  makerAddress: Scalars['String']
  takerAddress: Scalars['String']
  makerAssetAmount: Scalars['String']
  takerAssetAmount: Scalars['String']
  makerAssetData: Scalars['String']
  takerAssetData: Scalars['String']
  exchangeAddress: Scalars['String']
  expirationTimeSeconds: Scalars['String']
  networkId?: Maybe<Scalars['String']>
}

export type QueryFeeRecipientsArgs = {
  page?: Maybe<Scalars['Int']>
  networkId?: Maybe<Scalars['Int']>
  perPage?: Maybe<Scalars['Int']>
}

export type SignedOrder = {
  __typename?: 'SignedOrder'
  makerAddress: Scalars['String']
  takerAddress: Scalars['String']
  feeRecipientAddress: Scalars['String']
  senderAddress: Scalars['String']
  makerAssetAmount: Scalars['String']
  takerAssetAmount: Scalars['String']
  makerFee: Scalars['String']
  takerFee: Scalars['String']
  expirationTimeSeconds: Scalars['String']
  salt: Scalars['String']
  makerAssetData: Scalars['String']
  takerAssetData: Scalars['String']
  exchangeAddress: Scalars['String']
  signature: Scalars['String']
}

export type SignedOrderInput = {
  makerAddress: Scalars['String']
  takerAddress: Scalars['String']
  feeRecipientAddress: Scalars['String']
  senderAddress: Scalars['String']
  makerAssetAmount: Scalars['String']
  takerAssetAmount: Scalars['String']
  makerFee: Scalars['String']
  takerFee: Scalars['String']
  expirationTimeSeconds: Scalars['String']
  salt: Scalars['String']
  makerAssetData: Scalars['String']
  takerAssetData: Scalars['String']
  exchangeAddress: Scalars['String']
  signature: Scalars['String']
}

export type Subscription = {
  __typename?: 'Subscription'
  subscribeToOrders?: Maybe<SubscriptionOrderUpdateResponse>
}

export type SubscriptionSubscribeToOrdersArgs = {
  type: Subscription_Subscribe_Request_Types
  channel: Subscription_Subscribe_Request_Channels
  requestId: Scalars['String']
  payload?: Maybe<SubscriptionFilterParameters>
}

export enum Subscription_Order_Update_Response_Channel {
  Orders = 'orders',
}

export enum Subscription_Order_Update_Response_Type {
  Update = 'update',
}

export enum Subscription_Subscribe_Request_Channels {
  Orders = 'orders',
}

export enum Subscription_Subscribe_Request_Types {
  Subscribe = 'subscribe',
}

export type SubscriptionFilterParameters = {
  makerAssetProxyId?: Maybe<Scalars['String']>
  takerAssetProxyId?: Maybe<Scalars['String']>
  makerAssetAddress?: Maybe<Scalars['String']>
  takerAssetAddress?: Maybe<Scalars['String']>
  makerAssetData?: Maybe<Scalars['String']>
  takerAssetData?: Maybe<Scalars['String']>
  traderAssetData?: Maybe<Scalars['String']>
}

export type SubscriptionOrderUpdateResponse = {
  __typename?: 'SubscriptionOrderUpdateResponse'
  type: Subscription_Order_Update_Response_Type
  channel: Subscription_Order_Update_Response_Channel
  requestId: Scalars['String']
  payload?: Maybe<Array<Maybe<WrapperSignedOrderWithMetadata>>>
}

export type WrapperOrderWithMetadata = {
  __typename?: 'WrapperOrderWithMetadata'
  order?: Maybe<Order>
  metaData?: Maybe<Scalars['JSON']>
}

export type WrapperSignedOrderWithMetadata = {
  __typename?: 'WrapperSignedOrderWithMetadata'
  order?: Maybe<SignedOrder>
  metaData?: Maybe<Scalars['JSON']>
}
export type WithIndex<TObject> = TObject & Record<string, any>
export type ResolversObject<TObject> = WithIndex<TObject>

export type ResolverTypeWrapper<T> = Promise<T> | T

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult

export type StitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>
}

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes>

export type NextResolverFn<T> = () => Promise<T>

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {}
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Query: ResolverTypeWrapper<{}>
  String: ResolverTypeWrapper<Scalars['String']>
  Int: ResolverTypeWrapper<Scalars['Int']>
  AssetPairResponse: ResolverTypeWrapper<AssetPairResponse>
  AssetPair: ResolverTypeWrapper<AssetPair>
  AssetData: ResolverTypeWrapper<AssetData>
  WrapperSignedOrderWithMetadata: ResolverTypeWrapper<
    WrapperSignedOrderWithMetadata
  >
  SignedOrder: ResolverTypeWrapper<SignedOrder>
  JSON: ResolverTypeWrapper<Scalars['JSON']>
  PaginatedAPIOrder: ResolverTypeWrapper<PaginatedApiOrder>
  OrderbookResponse: ResolverTypeWrapper<OrderbookResponse>
  OrderConfig: ResolverTypeWrapper<OrderConfig>
  FeeRecipientsResponse: ResolverTypeWrapper<FeeRecipientsResponse>
  Mutation: ResolverTypeWrapper<{}>
  SignedOrderInput: SignedOrderInput
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>
  Subscription: ResolverTypeWrapper<{}>
  SUBSCRIPTION_SUBSCRIBE_REQUEST_TYPES: Subscription_Subscribe_Request_Types
  SUBSCRIPTION_SUBSCRIBE_REQUEST_CHANNELS: Subscription_Subscribe_Request_Channels
  SubscriptionFilterParameters: SubscriptionFilterParameters
  SubscriptionOrderUpdateResponse: ResolverTypeWrapper<
    SubscriptionOrderUpdateResponse
  >
  SUBSCRIPTION_ORDER_UPDATE_RESPONSE_TYPE: Subscription_Order_Update_Response_Type
  SUBSCRIPTION_ORDER_UPDATE_RESPONSE_CHANNEL: Subscription_Order_Update_Response_Channel
  CacheControlScope: CacheControlScope
  Order: ResolverTypeWrapper<Order>
  Upload: ResolverTypeWrapper<Scalars['Upload']>
  WrapperOrderWithMetadata: ResolverTypeWrapper<WrapperOrderWithMetadata>
}>

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Query: {}
  String: Scalars['String']
  Int: Scalars['Int']
  AssetPairResponse: AssetPairResponse
  AssetPair: AssetPair
  AssetData: AssetData
  WrapperSignedOrderWithMetadata: WrapperSignedOrderWithMetadata
  SignedOrder: SignedOrder
  JSON: Scalars['JSON']
  PaginatedAPIOrder: PaginatedApiOrder
  OrderbookResponse: OrderbookResponse
  OrderConfig: OrderConfig
  FeeRecipientsResponse: FeeRecipientsResponse
  Mutation: {}
  SignedOrderInput: SignedOrderInput
  Boolean: Scalars['Boolean']
  Subscription: {}
  SUBSCRIPTION_SUBSCRIBE_REQUEST_TYPES: Subscription_Subscribe_Request_Types
  SUBSCRIPTION_SUBSCRIBE_REQUEST_CHANNELS: Subscription_Subscribe_Request_Channels
  SubscriptionFilterParameters: SubscriptionFilterParameters
  SubscriptionOrderUpdateResponse: SubscriptionOrderUpdateResponse
  SUBSCRIPTION_ORDER_UPDATE_RESPONSE_TYPE: Subscription_Order_Update_Response_Type
  SUBSCRIPTION_ORDER_UPDATE_RESPONSE_CHANNEL: Subscription_Order_Update_Response_Channel
  CacheControlScope: CacheControlScope
  Order: Order
  Upload: Scalars['Upload']
  WrapperOrderWithMetadata: WrapperOrderWithMetadata
}>

export type CacheControlDirectiveResolver<
  Result,
  Parent,
  ContextType = any,
  Args = {
    maxAge?: Maybe<Maybe<Scalars['Int']>>
    scope?: Maybe<Maybe<CacheControlScope>>
  }
> = DirectiveResolverFn<Result, Parent, ContextType, Args>

export type AssetDataResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['AssetData'] = ResolversParentTypes['AssetData']
> = ResolversObject<{
  assetData?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  minAmount?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  maxAmount?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  precision?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
}>

export type AssetPairResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['AssetPair'] = ResolversParentTypes['AssetPair']
> = ResolversObject<{
  assetDataA?: Resolver<ResolversTypes['AssetData'], ParentType, ContextType>
  assetDataB?: Resolver<ResolversTypes['AssetData'], ParentType, ContextType>
}>

export type AssetPairResponseResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['AssetPairResponse'] = ResolversParentTypes['AssetPairResponse']
> = ResolversObject<{
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  page?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  perPage?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  records?: Resolver<
    Array<Maybe<ResolversTypes['AssetPair']>>,
    ParentType,
    ContextType
  >
}>

export type FeeRecipientsResponseResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['FeeRecipientsResponse'] = ResolversParentTypes['FeeRecipientsResponse']
> = ResolversObject<{
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  page?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  perPage?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  records?: Resolver<
    Array<Maybe<ResolversTypes['String']>>,
    ParentType,
    ContextType
  >
}>

export interface JsonScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON'
}

export type MutationResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']
> = ResolversObject<{
  postOrder?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType,
    RequireFields<MutationPostOrderArgs, 'order'>
  >
}>

export type OrderResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Order'] = ResolversParentTypes['Order']
> = ResolversObject<{
  makerAddress?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  takerAddress?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  feeRecipientAddress?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType
  >
  senderAddress?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  makerAssetAmount?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  takerAssetAmount?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  makerFee?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  takerFee?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  expirationTimeSeconds?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType
  >
  salt?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  makerAssetData?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  takerAssetData?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  exchangeAddress?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  signature?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
}>

export type OrderbookResponseResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['OrderbookResponse'] = ResolversParentTypes['OrderbookResponse']
> = ResolversObject<{
  bids?: Resolver<
    Maybe<ResolversTypes['PaginatedAPIOrder']>,
    ParentType,
    ContextType
  >
  asks?: Resolver<
    Maybe<ResolversTypes['PaginatedAPIOrder']>,
    ParentType,
    ContextType
  >
}>

export type OrderConfigResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['OrderConfig'] = ResolversParentTypes['OrderConfig']
> = ResolversObject<{
  makerFee?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  takerFee?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  feeRecipientAddress?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType
  >
  senderAddress?: Resolver<ResolversTypes['String'], ParentType, ContextType>
}>

export type PaginatedApiOrderResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['PaginatedAPIOrder'] = ResolversParentTypes['PaginatedAPIOrder']
> = ResolversObject<{
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  page?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  perPage?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  records?: Resolver<
    Array<Maybe<ResolversTypes['WrapperSignedOrderWithMetadata']>>,
    ParentType,
    ContextType
  >
}>

export type QueryResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']
> = ResolversObject<{
  assetPairs?: Resolver<
    Maybe<ResolversTypes['AssetPairResponse']>,
    ParentType,
    ContextType,
    QueryAssetPairsArgs
  >
  order?: Resolver<
    Maybe<ResolversTypes['WrapperSignedOrderWithMetadata']>,
    ParentType,
    ContextType,
    RequireFields<QueryOrderArgs, 'id'>
  >
  orders?: Resolver<
    Maybe<ResolversTypes['PaginatedAPIOrder']>,
    ParentType,
    ContextType,
    QueryOrdersArgs
  >
  orderbook?: Resolver<
    Maybe<ResolversTypes['OrderbookResponse']>,
    ParentType,
    ContextType,
    RequireFields<QueryOrderbookArgs, 'baseAssetData' | 'quoteAssetData'>
  >
  orderConfig?: Resolver<
    Maybe<ResolversTypes['OrderConfig']>,
    ParentType,
    ContextType,
    RequireFields<
      QueryOrderConfigArgs,
      | 'makerAddress'
      | 'takerAddress'
      | 'makerAssetAmount'
      | 'takerAssetAmount'
      | 'makerAssetData'
      | 'takerAssetData'
      | 'exchangeAddress'
      | 'expirationTimeSeconds'
    >
  >
  feeRecipients?: Resolver<
    Maybe<ResolversTypes['FeeRecipientsResponse']>,
    ParentType,
    ContextType,
    QueryFeeRecipientsArgs
  >
}>

export type SignedOrderResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['SignedOrder'] = ResolversParentTypes['SignedOrder']
> = ResolversObject<{
  makerAddress?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  takerAddress?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  feeRecipientAddress?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType
  >
  senderAddress?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  makerAssetAmount?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  takerAssetAmount?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  makerFee?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  takerFee?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  expirationTimeSeconds?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType
  >
  salt?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  makerAssetData?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  takerAssetData?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  exchangeAddress?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  signature?: Resolver<ResolversTypes['String'], ParentType, ContextType>
}>

export type SubscriptionResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']
> = ResolversObject<{
  subscribeToOrders?: SubscriptionResolver<
    Maybe<ResolversTypes['SubscriptionOrderUpdateResponse']>,
    'subscribeToOrders',
    ParentType,
    ContextType,
    RequireFields<
      SubscriptionSubscribeToOrdersArgs,
      'type' | 'channel' | 'requestId'
    >
  >
}>

export type SubscriptionOrderUpdateResponseResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['SubscriptionOrderUpdateResponse'] = ResolversParentTypes['SubscriptionOrderUpdateResponse']
> = ResolversObject<{
  type?: Resolver<
    ResolversTypes['SUBSCRIPTION_ORDER_UPDATE_RESPONSE_TYPE'],
    ParentType,
    ContextType
  >
  channel?: Resolver<
    ResolversTypes['SUBSCRIPTION_ORDER_UPDATE_RESPONSE_CHANNEL'],
    ParentType,
    ContextType
  >
  requestId?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  payload?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['WrapperSignedOrderWithMetadata']>>>,
    ParentType,
    ContextType
  >
}>

export interface UploadScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['Upload'], any> {
  name: 'Upload'
}

export type WrapperOrderWithMetadataResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['WrapperOrderWithMetadata'] = ResolversParentTypes['WrapperOrderWithMetadata']
> = ResolversObject<{
  order?: Resolver<Maybe<ResolversTypes['Order']>, ParentType, ContextType>
  metaData?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>
}>

export type WrapperSignedOrderWithMetadataResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['WrapperSignedOrderWithMetadata'] = ResolversParentTypes['WrapperSignedOrderWithMetadata']
> = ResolversObject<{
  order?: Resolver<
    Maybe<ResolversTypes['SignedOrder']>,
    ParentType,
    ContextType
  >
  metaData?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>
}>

export type Resolvers<ContextType = any> = ResolversObject<{
  AssetData?: AssetDataResolvers<ContextType>
  AssetPair?: AssetPairResolvers<ContextType>
  AssetPairResponse?: AssetPairResponseResolvers<ContextType>
  FeeRecipientsResponse?: FeeRecipientsResponseResolvers<ContextType>
  JSON?: GraphQLScalarType
  Mutation?: MutationResolvers<ContextType>
  Order?: OrderResolvers<ContextType>
  OrderbookResponse?: OrderbookResponseResolvers<ContextType>
  OrderConfig?: OrderConfigResolvers<ContextType>
  PaginatedAPIOrder?: PaginatedApiOrderResolvers<ContextType>
  Query?: QueryResolvers<ContextType>
  SignedOrder?: SignedOrderResolvers<ContextType>
  Subscription?: SubscriptionResolvers<ContextType>
  SubscriptionOrderUpdateResponse?: SubscriptionOrderUpdateResponseResolvers<
    ContextType
  >
  Upload?: GraphQLScalarType
  WrapperOrderWithMetadata?: WrapperOrderWithMetadataResolvers<ContextType>
  WrapperSignedOrderWithMetadata?: WrapperSignedOrderWithMetadataResolvers<
    ContextType
  >
}>

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>
export type DirectiveResolvers<ContextType = any> = ResolversObject<{
  cacheControl?: CacheControlDirectiveResolver<any, any, ContextType>
}>

/**
 * @deprecated
 * Use "DirectiveResolvers" root object instead. If you wish to get "IDirectiveResolvers", add "typesPrefix: I" to your config.
 */
export type IDirectiveResolvers<ContextType = any> = DirectiveResolvers<
  ContextType
>
