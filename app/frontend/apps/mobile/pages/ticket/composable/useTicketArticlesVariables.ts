// Copyright (C) 2012-2024 Zammad Foundation, https://zammad-foundation.org/

import { useApplicationStore } from '#shared/stores/application.ts'
import { computed } from 'vue'

const ticketArticlesLoaded = new Set<string>()

export const clearTicketArticlesLoadedState = () => {
  ticketArticlesLoaded.clear()
}

export const useTicketArticlesQueryVariables = () => {
  const application = useApplicationStore()

  const ticketArticlesMin = computed(() => {
    return Number(application.config.ticket_articles_min ?? 5)
  })

  const getTicketArticlesQueryVariables = (ticketId: string) => {
    if (ticketArticlesLoaded.has(ticketId)) {
      return {
        ticketId,
        loadDescription: false,
        pageSize: null,
      }
    }

    return {
      ticketId,
      pageSize: ticketArticlesMin.value,
    }
  }

  const markTicketArticlesLoaded = (ticketId: string) => {
    ticketArticlesLoaded.add(ticketId)
  }

  const allTicketArticlesLoaded = (ticketId: string) =>
    ticketArticlesLoaded.has(ticketId)

  return {
    ticketArticlesMin,
    allTicketArticlesLoaded,
    markTicketArticlesLoaded,
    getTicketArticlesQueryVariables,
  }
}
