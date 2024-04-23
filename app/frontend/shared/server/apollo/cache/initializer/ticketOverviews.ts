// Copyright (C) 2012-2024 Zammad Foundation, https://zammad-foundation.org/

import type { InMemoryCacheConfig } from '@apollo/client/cache/inmemory/types'
import registerNotNormalizedObjectFieldsMerge from '#shared/server/apollo/cache/utils/registerNotNormalizedObjectFieldsMerge.ts'

export default function register(config: InMemoryCacheConfig) {
  return registerNotNormalizedObjectFieldsMerge(config, 'Overview', [
    'viewColumns',
    'orderColumns',
  ])
}
