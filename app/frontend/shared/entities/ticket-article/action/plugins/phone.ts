// Copyright (C) 2012-2024 Zammad Foundation, https://zammad-foundation.org/

import type { TicketArticleActionPlugin, TicketArticleType } from './types.ts'

const actionPlugin: TicketArticleActionPlugin = {
  order: 100,

  addTypes() {
    const type: TicketArticleType = {
      apps: ['mobile'],
      value: 'phone',
      label: __('Phone'),
      icon: 'phone',
      fields: {
        attachments: {},
        body: {
          required: true,
        },
      },
      view: {
        agent: ['change'],
      },
      internal: false,
    }
    return [type]
  },
}

export default actionPlugin
