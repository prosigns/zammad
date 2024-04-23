# Copyright (C) 2012-2024 Zammad Foundation, https://zammad-foundation.org/

module Gql::Queries
  class Ticket::Articles < BaseQuery

    description 'Fetch ticket articles by ticket ID'

    argument :ticket, Gql::Types::Input::Locator::TicketInputType, description: 'Ticket locator'

    type Gql::Types::Ticket::ArticleType.connection_type, null: false

    def resolve(ticket:)
      if TicketPolicy.new(context.current_user, ticket).agent_read_access?
        ::Ticket::Article.where(ticket: ticket).reorder(:id)
      else
        ::Ticket::Article.where(ticket: ticket, internal: false).reorder(:id)
      end
    end
  end
end
