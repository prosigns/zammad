// Copyright (C) 2012-2024 Zammad Foundation, https://zammad-foundation.org/

import { computed } from 'vue'
import { useApplicationStore } from '#shared/stores/application.ts'
import { useSessionStore } from '#shared/stores/session.ts'

export const useTicketCreate = () => {
  const application = useApplicationStore()
  const session = useSessionStore()

  const ticketCreateEnabled = computed(() => {
    return (
      session.hasPermission('ticket.agent') ||
      (session.hasPermission('ticket.customer') &&
        application.config.customer_ticket_create)
    )
  })

  const isTicketCustomer = computed(() => {
    return (
      session.hasPermission('ticket.customer') &&
      !session.hasPermission('ticket.agent')
    )
  })

  return {
    ticketCreateEnabled,
    isTicketCustomer,
  }
}
