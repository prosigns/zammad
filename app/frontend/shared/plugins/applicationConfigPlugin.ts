// Copyright (C) 2012-2024 Zammad Foundation, https://zammad-foundation.org/

import { useApplicationStore } from '#shared/stores/application.ts'
import type { ConfigList } from '#shared/types/store.ts'
import { storeToRefs } from 'pinia'
import type { App } from 'vue'
import { unref } from 'vue'

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $c: ConfigList
  }
}

const applicationConfigPlugin = (app: App) => {
  const application = useApplicationStore()
  const { config } = storeToRefs(application)

  Object.defineProperty(app.config.globalProperties, '$c', {
    enumerable: true,
    get: () => unref(config),
  })
}

export default applicationConfigPlugin
