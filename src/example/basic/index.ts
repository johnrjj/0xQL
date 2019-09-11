import { ApolloServer } from 'apollo-server'
import { createReadyToUseResolvers, typeDefs } from '../..'

// Here's a basic, minimal example with a standalone GraphQL server, no subscriptions.
// Configured for RadarRelay's 0x Standard Relayer v2 API

const APP_PORT = 4000
const REST_API_ENDPOINT = 'https://api.radarrelay.com/0x/v2'

const { queryResolver, mutationResolver, jsonResolver } = createReadyToUseResolvers(REST_API_ENDPOINT)

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
  console.log(`🚀 Server ready at http://localhost:${APP_PORT}${server.graphqlPath}`)
)
