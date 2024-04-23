# Copyright (C) 2012-2024 Zammad Foundation, https://zammad-foundation.org/

module Gql::Mutations
  class Login < BaseMutation
    include Gql::Mutations::Concerns::HandlesAuthentication

    description 'Performs a user login to create a session'

    argument :input, Gql::Types::Input::LoginInputType, 'Login input fields.'

    field :session, Gql::Types::SessionType, description: 'The current session, if the login was successful.'
    field :two_factor_required, Gql::Types::UserTwoFactorMethodsType, description: 'Two factor authentication methods available for the user about to log-in.'

    def self.authorize(...)
      true
    end

    def resolve(input:)
      authenticate(**input)
    end
  end
end
