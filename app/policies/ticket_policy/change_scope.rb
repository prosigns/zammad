# Copyright (C) 2012-2024 Zammad Foundation, https://zammad-foundation.org/

class TicketPolicy < ApplicationPolicy
  class ChangeScope < BaseScope
    ACCESS_TYPE = :change
  end
end
