// Copyright (C) 2012-2024 Zammad Foundation, https://zammad-foundation.org/

import type { ComputedRef, Ref, UnwrapRef } from 'vue'
import { onBeforeUnmount, onBeforeMount, ref, watch } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import useMetaTitle from '#shared/composables/useMetaTitle.ts'

export interface HeaderOptions {
  title?: string | ComputedRef<string>
  titleClass?: string | ComputedRef<string>
  backTitle?: string | ComputedRef<string>
  backUrl?: RouteLocationRaw | ComputedRef<RouteLocationRaw>
  backAvoidHomeButton?: boolean
  backIgnore?: string[]
  refetch?: ComputedRef<boolean>
  actionTitle?: string | ComputedRef<string>
  actionHidden?: boolean | ComputedRef<boolean> | Ref<boolean>
  onAction?(): unknown
}

export const headerOptions = ref<HeaderOptions>({})

const { setViewTitle } = useMetaTitle()

watch(
  () => headerOptions.value.title,
  (title) => title && setViewTitle(title),
)

export const useHeader = (options: HeaderOptions) => {
  onBeforeMount(() => {
    headerOptions.value = options as UnwrapRef<HeaderOptions>
  })

  onBeforeUnmount(() => {
    headerOptions.value = {}
  })
}
