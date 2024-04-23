// Copyright (C) 2012-2024 Zammad Foundation, https://zammad-foundation.org/

import { mockApplicationConfig } from '#tests/support/mock-applicationConfig.ts'
import { mockPermissions } from '#tests/support/mock-permissions.ts'
import { useTicketCreate } from '../useTicketCreate.ts'

describe('useTicketCreate', () => {
  it('check for agent permission and setting customer ticket create enabled', () => {
    mockPermissions(['ticket.agent'])
    mockApplicationConfig({
      customer_ticket_create: true,
    })

    const { ticketCreateEnabled } = useTicketCreate()

    expect(ticketCreateEnabled.value).toBe(true)
  })

  it('check for agent permission and setting customer ticket create disabled', () => {
    mockPermissions(['ticket.agent'])
    mockApplicationConfig({
      customer_ticket_create: true,
    })

    const { ticketCreateEnabled } = useTicketCreate()

    expect(ticketCreateEnabled.value).toBe(true)
  })

  it('check for customer permission and setting customer ticket create enabled', () => {
    mockPermissions(['ticket.customer'])
    mockApplicationConfig({
      customer_ticket_create: true,
    })

    const { ticketCreateEnabled } = useTicketCreate()

    expect(ticketCreateEnabled.value).toBe(true)
  })

  it('check for customer permission and setting customer ticket create disabled', () => {
    mockPermissions(['ticket.customer'])
    mockApplicationConfig({
      customer_ticket_create: false,
    })

    const { ticketCreateEnabled } = useTicketCreate()

    expect(ticketCreateEnabled.value).toBe(false)
  })

  it('check for agent, but no customer permission', () => {
    mockPermissions(['ticket.agent'])

    const { isTicketCustomer } = useTicketCreate()

    expect(isTicketCustomer.value).toBe(false)
  })

  it('check for agent + customer permission', () => {
    mockPermissions(['ticket.agent', 'ticket.customer'])

    const { isTicketCustomer } = useTicketCreate()

    expect(isTicketCustomer.value).toBe(false)
  })

  it('check for no agent, but customer permission', () => {
    mockPermissions(['ticket.customer'])

    const { isTicketCustomer } = useTicketCreate()

    expect(isTicketCustomer.value).toBe(true)
  })
})
