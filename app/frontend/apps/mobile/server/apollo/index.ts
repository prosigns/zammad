// Copyright (C) 2012-2024 Zammad Foundation, https://zammad-foundation.org/

import type { App } from 'vue'
import mainInitializeApolloClient from '#shared/server/apollo/index.ts'
import type {
  InitializeAppApolloClient,
  CacheInitializerModules,
} from '#shared/types/server/apollo/client.ts'

export const cacheInitializerModules: CacheInitializerModules =
  import.meta.glob('./cache/initializer/*.ts', { eager: true })

const initializeApolloClient: InitializeAppApolloClient = (app: App) => {
  mainInitializeApolloClient(app, cacheInitializerModules)
}

export default initializeApolloClient
