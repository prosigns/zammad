# Copyright (C) 2012-2024 Zammad Foundation, https://zammad-foundation.org/

class Ticket::Flag < ApplicationModel
  belongs_to :ticket

  association_attributes_ignored :ticket
end
