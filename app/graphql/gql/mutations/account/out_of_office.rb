# Copyright (C) 2012-2024 Zammad Foundation, https://zammad-foundation.org/

module Gql::Mutations
  class Account::OutOfOffice < BaseMutation
    description 'Update user profile out of office settings'

    argument :input, Gql::Types::Input::OutOfOfficeInputType, description: 'Out of Office settings'

    field :success, Boolean, description: 'Profile out of office settings updated successfully?'

    def resolve(input:)
      Service::User::OutOfOffice
        .new(context.current_user, **input)
        .execute

      { success: true }
    end
  end
end
