// Copyright (C) 2012-2024 Zammad Foundation, https://zammad-foundation.org/

import { ref, onUnmounted } from 'vue'
import {
  type MaybeComputedElementRef,
  type MaybeElement,
  onKeyStroke,
  useElementBounding,
  useWindowSize,
} from '@vueuse/core'
import { EnumTextDirection } from '#shared/graphql/types.ts'
import { useLocaleStore } from '#shared/stores/locale.ts'

export const useResizeWidthHandle = (
  resizeCallback: (positionX: number) => void,
  handleRef: MaybeComputedElementRef<MaybeElement>,
  keyStrokeCallback: (e: KeyboardEvent, adjustment: number) => void,
  options?: {
    calculateFromRight?: boolean
  },
) => {
  const isResizingHorizontal = ref(false)

  const locale = useLocaleStore()
  const { width } = useElementBounding(handleRef)
  const { width: screenWidth } = useWindowSize()

  const resize = (event: MouseEvent | TouchEvent) => {
    // Position the cursor as close to the handle center as possible.
    let positionX = Math.round(width.value / 2)

    if (event instanceof MouseEvent) {
      positionX += event.pageX
    } else if (event.targetTouches[0]) {
      positionX += event.targetTouches[0].pageX
    }

    // In case of RTL locale, subtract the reported position from the current screen width.
    if (
      locale.localeData?.dir === EnumTextDirection.Rtl &&
      !options?.calculateFromRight // If the option is set, do not calculate from the right.
    )
      positionX = screenWidth.value - positionX

    // In case of LTR locale and resizer is used from right side of the window, subtract the reported position from the current screen width.
    if (
      locale.localeData?.dir === EnumTextDirection.Ltr &&
      options?.calculateFromRight
    )
      positionX = screenWidth.value - positionX

    resizeCallback(positionX)
  }

  const endResizing = () => {
    // eslint-disable-next-line no-use-before-define
    removeListeners()
    isResizingHorizontal.value = false
  }

  const removeListeners = () => {
    document.removeEventListener('touchmove', resize)
    document.removeEventListener('touchend', endResizing)
    document.removeEventListener('mousemove', resize)
    document.removeEventListener('mouseup', endResizing)
  }
  const addEventListeners = () => {
    document.addEventListener('touchend', endResizing)
    document.addEventListener('touchmove', resize)
    document.addEventListener('mouseup', endResizing)
    document.addEventListener('mousemove', resize)
  }

  const startResizing = (e: MouseEvent) => {
    // Do not react on double click event.
    if (e.detail > 1) return

    e.preventDefault()

    isResizingHorizontal.value = true
    addEventListeners()
  }

  onUnmounted(() => {
    removeListeners()
  })

  // a11y keyboard navigation horizontal resize
  onKeyStroke('ArrowLeft', (e: KeyboardEvent) => {
    if (options?.calculateFromRight) {
      keyStrokeCallback(e, locale.localeData?.dir === 'rtl' ? -5 : 5)
    } else {
      keyStrokeCallback(e, locale.localeData?.dir === 'rtl' ? 5 : -5)
    }
  })

  onKeyStroke('ArrowRight', (e: KeyboardEvent) => {
    if (options?.calculateFromRight) {
      keyStrokeCallback(e, locale.localeData?.dir === 'rtl' ? 5 : -5)
    } else {
      keyStrokeCallback(e, locale.localeData?.dir === 'rtl' ? -5 : 5)
    }
  })

  return {
    isResizingHorizontal,
    startResizing,
  }
}
