# Copyright (C) 2012-2024 Zammad Foundation, https://zammad-foundation.org/

# Check if password matches system settings
class PasswordPolicy
  include ::Mixin::HasBackends

  class PasswordPolicy::Error < StandardError; end

  attr_reader :password

  # @param password [String, nil] to evaluate. nil is treated as empty string
  def initialize(password)
    @password = password || ''
  end

  def valid!
    return if valid?

    raise PasswordPolicy::Error, error.first
  end

  def valid?
    errors.blank?
  end

  def error
    errors.first
  end

  def errors
    @errors ||= applicable_backends
      .map { |backend| backend.new(password) }
      .reject(&:valid?)
      .map(&:error)
  end

  private

  def applicable_backends
    @applicable_backends ||= backends.select(&:applicable?)
  end
end
