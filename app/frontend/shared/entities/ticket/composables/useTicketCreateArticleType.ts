// Copyright (C) 2012-2024 Zammad Foundation, https://zammad-foundation.org/

import { computed } from 'vue'
import { useApplicationStore } from '#shared/stores/application.ts'
import type { FormFieldAdditionalProps } from '#shared/components/Form/types.ts'
import { TicketCreateArticleType } from '../types.ts'

export const useTicketCreateArticleType = (
  additionalProps: FormFieldAdditionalProps = {},
) => {
  const application = useApplicationStore()

  const ticketCreateArticleType = {
    [TicketCreateArticleType.PhoneIn]: {
      icon: 'phone-in',
      label: __('Received Call'),
      sender: 'Customer',
      type: 'phone',
    },
    [TicketCreateArticleType.PhoneOut]: {
      icon: 'phone-out',
      label: __('Outbound Call'),
      sender: 'Agent',
      type: 'phone',
    },
    [TicketCreateArticleType.EmailOut]: {
      icon: 'mail-out',
      label: __('Send Email'),
      sender: 'Agent',
      type: 'email',
    },
  }

  const availableTypes = computed(() => {
    let configuredAvailableTypes =
      (application.config.ui_ticket_create_available_types as
        | TicketCreateArticleType[]
        | TicketCreateArticleType) || []

    if (!Array.isArray(configuredAvailableTypes)) {
      configuredAvailableTypes = [configuredAvailableTypes]
    }

    return configuredAvailableTypes
  })

  const options = computed(() => {
    return availableTypes.value.map((availableType) => ({
      label: ticketCreateArticleType[availableType].label,
      value: availableType,
      icon: ticketCreateArticleType[availableType].icon,
    }))
  })

  const defaultTicketCreateType = application.config
    .ui_ticket_create_default_type as TicketCreateArticleType

  const ticketArticleSenderTypeField = {
    name: 'articleSenderType',
    type: 'radio',
    required: true,
    value: availableTypes.value.includes(defaultTicketCreateType)
      ? defaultTicketCreateType
      : availableTypes.value[0],
    props: {
      buttons: true,
      options,
      ...additionalProps,
    },
  }

  return { ticketCreateArticleType, ticketArticleSenderTypeField }
}
