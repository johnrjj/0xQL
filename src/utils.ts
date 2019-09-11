import { BigNumber, orderHashUtils, SignedOrder } from '0x.js'
import { assert } from '@0x/assert'
import { schemas } from '@0x/json-schemas'
import { orderParsingUtils } from '@0x/order-utils'
import { PaginatedCollection, APIOrder, AssetPairsItem, OrderConfigResponse, OrderConfigRequest } from '@0x/types'

class SignedOrderModel {
  public senderAddress?: string
  public makerAddress?: string
  public takerAddress?: string
  public makerAssetData?: string
  public takerAssetData?: string
  public exchangeAddress?: string
  public feeRecipientAddress?: string
  public expirationTimeSeconds?: string // 0x docs inconsistent here on type (number vs string)
  public makerFee?: string
  public takerFee?: string
  public makerAssetAmount?: string
  public takerAssetAmount?: string
  public salt?: string
  public signature?: string
  constructor(
    opts: {
      hash?: string
      senderAddress?: string
      makerAddress?: string
      takerAddress?: string
      makerAssetData?: string
      takerAssetData?: string
      exchangeAddress?: string
      feeRecipientAddress?: string
      expirationTimeSeconds?: string
      makerFee?: string
      takerFee?: string
      makerAssetAmount?: string
      takerAssetAmount?: string
      salt?: string
      signature?: string
    } = {}
  ) {
    this.senderAddress = opts.senderAddress
    this.makerAddress = opts.makerAddress
    this.takerAddress = opts.takerAddress
    this.makerAssetData = opts.makerAssetData
    this.takerAssetData = opts.takerAssetData
    this.exchangeAddress = opts.exchangeAddress
    this.feeRecipientAddress = opts.feeRecipientAddress
    this.expirationTimeSeconds = opts.expirationTimeSeconds
    this.makerFee = opts.makerFee
    this.takerFee = opts.takerFee
    this.makerAssetAmount = opts.makerAssetAmount
    this.takerAssetAmount = opts.takerAssetAmount
    this.salt = opts.salt
    this.signature = opts.signature
  }
}

const deserializeOrder = (signedOrderModel: Required<SignedOrderModel>): SignedOrder => {
  const signedOrder: SignedOrder = {
    signature: signedOrderModel.signature,
    senderAddress: signedOrderModel.senderAddress,
    makerAddress: signedOrderModel.makerAddress,
    takerAddress: signedOrderModel.takerAddress,
    makerFee: new BigNumber(signedOrderModel.makerFee),
    takerFee: new BigNumber(signedOrderModel.takerFee),
    makerAssetAmount: new BigNumber(signedOrderModel.makerAssetAmount),
    takerAssetAmount: new BigNumber(signedOrderModel.takerAssetAmount),
    makerAssetData: signedOrderModel.makerAssetData,
    takerAssetData: signedOrderModel.takerAssetData,
    salt: new BigNumber(signedOrderModel.salt),
    exchangeAddress: signedOrderModel.exchangeAddress,
    feeRecipientAddress: signedOrderModel.feeRecipientAddress,
    expirationTimeSeconds: new BigNumber(signedOrderModel.expirationTimeSeconds),
  }
  return signedOrder
}

const serializeOrder = (signedOrder: SignedOrder) => {
  const signedOrderModel = {
    signature: signedOrder.signature,
    senderAddress: signedOrder.senderAddress,
    makerAddress: signedOrder.makerAddress,
    takerAddress: signedOrder.takerAddress,
    makerFee: signedOrder.makerFee.toString(),
    takerFee: signedOrder.takerFee.toString(),
    makerAssetAmount: signedOrder.makerAssetAmount.toString(),
    takerAssetAmount: signedOrder.takerAssetAmount.toString(),
    makerAssetData: signedOrder.makerAssetData,
    takerAssetData: signedOrder.takerAssetData,
    salt: signedOrder.salt.toString(),
    exchangeAddress: signedOrder.exchangeAddress,
    feeRecipientAddress: signedOrder.feeRecipientAddress,
    expirationTimeSeconds: signedOrder.expirationTimeSeconds.toNumber().toString(), // conflicting 0x docs around number vs string, going w/ string
    hash: orderHashUtils.getOrderHashHex(signedOrder),
  }
  return signedOrderModel
}

const serializePaginatedAPIOrderCollection = (orders: PaginatedCollection<APIOrder>) => {
  const serializedRecords = orders.records.map(r => ({
    metadata: r.metaData,
    order: serializeOrder(r.order),
  }))
  const serializedOrdersResponse = {
    ...orders,
    records: serializedRecords,
  }
  return serializedOrdersResponse
}

const serializeAssetPairItem = (assetPair: AssetPairsItem) => {
  assetPair.assetDataA
  const { assetDataA, assetDataB } = assetPair
  return {
    assetDataA: {
      ...assetDataA,
      maxAmount: assetDataA.maxAmount.toString(),
      minAmount: assetDataA.minAmount.toString(),
    },
    assetDataB: {
      ...assetDataB,
      maxAmount: assetDataB.maxAmount.toString(),
      minAmount: assetDataB.minAmount.toString(),
    },
  }
}

const serializePaginatedAssetPairsCollection = (assetPairs: PaginatedCollection<AssetPairsItem>) => {
  return {
    ...assetPairs,
    records: assetPairs.records.map(serializeAssetPairItem),
  }
}

const serializeOrderConfig = (orderConfigResponse: OrderConfigResponse) => {
  return {
    ...orderConfigResponse,
    makerFee: orderConfigResponse.makerFee.toString(),
    takerFee: orderConfigResponse.takerFee.toString(),
  }
}

const parseOrderConfigRequestJson = (json: any): OrderConfigRequest => {
  assert.doesConformToSchema('orderConfigResponse', json, schemas.relayerApiOrderConfigResponseSchema)
  return orderParsingUtils.convertStringsFieldsToBigNumbers(json, [
    'makerAssetAmount',
    'takerAssetAmount',
    'expirationTimeSeconds',
  ])
}

export {
  deserializeOrder,
  serializeOrder,
  serializePaginatedAPIOrderCollection,
  serializePaginatedAssetPairsCollection,
  serializeOrderConfig,
  parseOrderConfigRequestJson,
}
