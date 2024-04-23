// Copyright (C) 2012-2024 Zammad Foundation, https://zammad-foundation.org/

import type { NormalizedCacheObject } from '@apollo/client/core'
import { ApolloClient } from '@apollo/client/core'
import type { CacheInitializerModules } from '#shared/types/server/apollo/client.ts'
import link from './link.ts'
import createCache from './cache.ts'

let apolloClient: ApolloClient<NormalizedCacheObject>

export const createApolloClient = (
  cacheInitializerModules: CacheInitializerModules = {},
) => {
  const cache = createCache(cacheInitializerModules)

  apolloClient = new ApolloClient({
    connectToDevTools: process.env.NODE_ENV !== 'production',
    link,
    cache,
    queryDeduplication: true,
    defaultOptions: {
      // always refresh query results from the server
      // https://www.apollographql.com/docs/react/data/queries/#setting-a-fetch-policy
      watchQuery: {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-and-network',
      },
    },
  })

  return apolloClient
}

export const getApolloClient = () => {
  return apolloClient
}

export const clearApolloClientStore = async () => {
  await apolloClient.clearStore()
}
